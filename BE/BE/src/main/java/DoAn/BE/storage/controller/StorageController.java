package DoAn.BE.storage.controller;

import DoAn.BE.storage.dto.*;
import DoAn.BE.storage.service.FileStorageService;
import DoAn.BE.storage.service.FolderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {
    
    private final FileStorageService fileStorageService;
    private final FolderService folderService;
    
    // ==================== FILE ENDPOINTS ====================
    
    @PostMapping("/files/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Long folderId,
            Authentication authentication,
            HttpServletRequest request) {
        Long userId = Long.parseLong(authentication.getName());
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        
        FileUploadResponse response = fileStorageService.uploadFile(file, folderId, userId, ipAddress, userAgent);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/files/{fileId}")
    public ResponseEntity<FileDTO> getFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        FileDTO file = fileStorageService.getFileById(fileId, userId);
        return ResponseEntity.ok(file);
    }
    
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        Resource resource = fileStorageService.downloadFile(fileId, userId);
        
        // Get file info for content disposition
        FileDTO fileInfo = fileStorageService.getFileById(fileId, userId);
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(fileInfo.getMimeType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + fileInfo.getOriginalFilename() + "\"")
            .body(resource);
    }
    
    @GetMapping("/files/my-files")
    public ResponseEntity<List<FileDTO>> getMyFiles(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<FileDTO> files = fileStorageService.getUserFiles(userId);
        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/folders/{folderId}/files")
    public ResponseEntity<List<FileDTO>> getFolderFiles(
            @PathVariable Long folderId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<FileDTO> files = fileStorageService.getFolderFiles(folderId, userId);
        return ResponseEntity.ok(files);
    }
    
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Map<String, String>> deleteFile(
            @PathVariable Long fileId,
            @RequestParam(value = "permanent", defaultValue = "false") boolean permanent,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        
        if (permanent) {
            fileStorageService.permanentDeleteFile(fileId, userId);
        } else {
            fileStorageService.deleteFile(fileId, userId);
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", permanent ? "Xóa file vĩnh viễn thành công" : "Xóa file thành công");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<StorageStatsDTO> getStorageStats(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        StorageStatsDTO stats = fileStorageService.getStorageStats(userId);
        return ResponseEntity.ok(stats);
    }
    
    // ==================== FOLDER ENDPOINTS ====================
    
    @PostMapping("/folders")
    public ResponseEntity<FolderDTO> createFolder(
            @Valid @RequestBody CreateFolderRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        FolderDTO folder = folderService.createFolder(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(folder);
    }
    
    @GetMapping("/folders/{folderId}")
    public ResponseEntity<FolderDTO> getFolder(
            @PathVariable Long folderId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        FolderDTO folder = folderService.getFolderById(folderId, userId);
        return ResponseEntity.ok(folder);
    }
    
    @GetMapping("/folders/my-folders")
    public ResponseEntity<List<FolderDTO>> getMyFolders(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<FolderDTO> folders = folderService.getUserFolders(userId);
        return ResponseEntity.ok(folders);
    }
    
    @GetMapping("/folders/{folderId}/subfolders")
    public ResponseEntity<List<FolderDTO>> getSubFolders(
            @PathVariable Long folderId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<FolderDTO> subFolders = folderService.getSubFolders(folderId, userId);
        return ResponseEntity.ok(subFolders);
    }
    
    @GetMapping("/folders/project/{projectId}")
    public ResponseEntity<List<FolderDTO>> getProjectFolders(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<FolderDTO> folders = folderService.getProjectFolders(projectId, userId);
        return ResponseEntity.ok(folders);
    }
    
    @PutMapping("/folders/{folderId}")
    public ResponseEntity<FolderDTO> updateFolder(
            @PathVariable Long folderId,
            @RequestParam String name,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        FolderDTO folder = folderService.updateFolder(folderId, name, userId);
        return ResponseEntity.ok(folder);
    }
    
    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<Map<String, String>> deleteFolder(
            @PathVariable Long folderId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        folderService.deleteFolder(folderId, userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa thư mục thành công");
        return ResponseEntity.ok(response);
    }
    
    // Helper method
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
