package DoAn.BE.storage.service;

import DoAn.BE.common.exception.*;
import DoAn.BE.storage.dto.FileDTO;
import DoAn.BE.storage.dto.FileUploadResponse;
import DoAn.BE.storage.dto.StorageStatsDTO;
import DoAn.BE.storage.entity.File;
import DoAn.BE.storage.entity.Folder;
import DoAn.BE.storage.repository.FileRepository;
import DoAn.BE.storage.repository.FolderRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;
    
    @Value("${app.storage.user-quota-gb:5}")
    private Long userQuotaGB;
    
    @Value("${app.storage.admin-quota-gb:10}")
    private Long adminQuotaGB;
    
    private Path fileStorageLocation;
    
    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file, Long folderId, Long userId, String ipAddress, String userAgent) {
        // Validate user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("File không được để trống");
        }
        
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        // Check file name
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Tên file không hợp lệ: " + originalFilename);
        }
        
        // Check quota
        checkStorageQuota(userId, file.getSize());
        
        // Validate folder if provided
        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục"));
            
            // Check if user owns the folder
            if (!folder.getOwner().getUserId().equals(userId)) {
                throw new ForbiddenException("Bạn không có quyền upload vào thư mục này");
            }
        }
        
        try {
            // Initialize storage location
            initializeStorage();
            
            // Generate unique filename
            String fileExtension = getFileExtension(originalFilename);
            String storedFilename = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            
            // Determine storage path
            Path targetLocation = fileStorageLocation.resolve(storedFilename);
            
            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Save file metadata to database
            File fileEntity = new File();
            fileEntity.setFilename(storedFilename);
            fileEntity.setOriginalFilename(originalFilename);
            fileEntity.setFilePath(targetLocation.toString());
            fileEntity.setFileSize(file.getSize());
            fileEntity.setMimeType(file.getContentType());
            fileEntity.setFolder(folder);
            fileEntity.setOwner(user);
            fileEntity.setUploadIp(ipAddress);
            fileEntity.setUploadUserAgent(userAgent);
            fileEntity.setVersion(1);
            fileEntity.setIsDeleted(false);
            
            fileEntity = fileRepository.save(fileEntity);
            
            // Build response
            FileUploadResponse response = new FileUploadResponse();
            response.setFileId(fileEntity.getFileId());
            response.setFilename(storedFilename);
            response.setOriginalFilename(originalFilename);
            response.setFileSize(file.getSize());
            response.setFileSizeFormatted(fileEntity.getFileSizeFormatted());
            response.setMimeType(file.getContentType());
            response.setDownloadUrl("/api/storage/files/" + fileEntity.getFileId() + "/download");
            response.setMessage("Upload file thành công");
            
            return response;
            
        } catch (IOException ex) {
            throw new FileStorageException("Không thể lưu file: " + originalFilename, ex);
        }
    }
    
    @Transactional(readOnly = true)
    public Resource downloadFile(Long fileId, Long userId) {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new StorageFileNotFoundException("Không tìm thấy file"));
        
        // Check if user owns the file
        if (!file.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền tải file này");
        }
        
        // Check if file is deleted
        if (file.getIsDeleted()) {
            throw new StorageFileNotFoundException("File đã bị xóa");
        }
        
        try {
            Path filePath = Paths.get(file.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("File không tồn tại hoặc không thể đọc: " + file.getOriginalFilename());
            }
        } catch (MalformedURLException ex) {
            throw new StorageFileNotFoundException("File không tồn tại: " + file.getOriginalFilename());
        }
    }
    
    @Transactional(readOnly = true)
    public FileDTO getFileById(Long fileId, Long userId) {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new StorageFileNotFoundException("Không tìm thấy file"));
        
        // Check if user owns the file
        if (!file.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xem file này");
        }
        
        return convertToDTO(file);
    }
    
    @Transactional(readOnly = true)
    public List<FileDTO> getUserFiles(Long userId) {
        List<File> files = fileRepository.findByOwner_UserId(userId);
        return files.stream()
            .filter(f -> !f.getIsDeleted())
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<FileDTO> getFolderFiles(Long folderId, Long userId) {
        // Validate folder
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục"));
        
        // Check if user owns the folder
        if (!folder.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xem thư mục này");
        }
        
        List<File> files = fileRepository.findByFolder_FolderId(folderId);
        return files.stream()
            .filter(f -> !f.getIsDeleted())
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteFile(Long fileId, Long userId) {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new StorageFileNotFoundException("Không tìm thấy file"));
        
        // Check if user owns the file
        if (!file.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xóa file này");
        }
        
        // Soft delete
        file.setIsDeleted(true);
        fileRepository.save(file);
    }
    
    @Transactional
    public void permanentDeleteFile(Long fileId, Long userId) {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new StorageFileNotFoundException("Không tìm thấy file"));
        
        // Check if user owns the file
        if (!file.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xóa file này");
        }
        
        try {
            // Delete physical file
            Path filePath = Paths.get(file.getFilePath());
            Files.deleteIfExists(filePath);
            
            // Delete from database
            fileRepository.delete(file);
        } catch (IOException ex) {
            throw new FileStorageException("Không thể xóa file vật lý", ex);
        }
    }
    
    @Transactional(readOnly = true)
    public StorageStatsDTO getStorageStats(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        
        List<File> userFiles = fileRepository.findByOwner_UserId(userId);
        List<Folder> userFolders = folderRepository.findByOwner_UserId(userId);
        
        long totalFiles = userFiles.stream().filter(f -> !f.getIsDeleted()).count();
        long totalFolders = userFolders.size();
        long totalSize = userFiles.stream()
            .filter(f -> !f.getIsDeleted())
            .mapToLong(File::getFileSize)
            .sum();
        
        // Determine quota based on role
        long quotaBytes = (user.getRole().name().equals("ADMIN") ? adminQuotaGB : userQuotaGB) * 1024 * 1024 * 1024;
        long remainingQuota = quotaBytes - totalSize;
        double usagePercentage = (double) totalSize / quotaBytes * 100;
        
        StorageStatsDTO stats = new StorageStatsDTO();
        stats.setTotalFiles(totalFiles);
        stats.setTotalFolders(totalFolders);
        stats.setTotalSize(totalSize);
        stats.setTotalSizeFormatted(formatSize(totalSize));
        stats.setQuotaLimit(quotaBytes);
        stats.setQuotaLimitFormatted(formatSize(quotaBytes));
        stats.setRemainingQuota(remainingQuota);
        stats.setRemainingQuotaFormatted(formatSize(remainingQuota));
        stats.setUsagePercentage(Math.round(usagePercentage * 100.0) / 100.0);
        
        return stats;
    }
    
    // Helper methods
    private void initializeStorage() throws IOException {
        if (fileStorageLocation == null) {
            fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(fileStorageLocation);
        }
    }
    
    private void checkStorageQuota(Long userId, long fileSize) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        
        List<File> userFiles = fileRepository.findByOwner_UserId(userId);
        long currentUsage = userFiles.stream()
            .filter(f -> !f.getIsDeleted())
            .mapToLong(File::getFileSize)
            .sum();
        
        long quotaBytes = (user.getRole().name().equals("ADMIN") ? adminQuotaGB : userQuotaGB) * 1024 * 1024 * 1024;
        
        if (currentUsage + fileSize > quotaBytes) {
            throw new StorageQuotaExceededException(
                String.format("Vượt quá dung lượng cho phép. Đã dùng: %s, Giới hạn: %s",
                    formatSize(currentUsage), formatSize(quotaBytes))
            );
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf(".") + 1);
        }
        return "";
    }
    
    private String formatSize(long bytes) {
        if (bytes == 0) return "0 B";
        
        String[] units = {"B", "KB", "MB", "GB", "TB"};
        int unitIndex = 0;
        double size = bytes;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return String.format("%.2f %s", size, units[unitIndex]);
    }
    
    private FileDTO convertToDTO(File file) {
        FileDTO dto = new FileDTO();
        dto.setFileId(file.getFileId());
        dto.setFilename(file.getFilename());
        dto.setOriginalFilename(file.getOriginalFilename());
        dto.setFilePath(file.getFilePath());
        dto.setFileSize(file.getFileSize());
        dto.setFileSizeFormatted(file.getFileSizeFormatted());
        dto.setMimeType(file.getMimeType());
        dto.setFileExtension(file.getFileExtension());
        
        if (file.getFolder() != null) {
            dto.setFolderId(file.getFolder().getFolderId());
            dto.setFolderName(file.getFolder().getName());
        }
        
        dto.setOwnerId(file.getOwner().getUserId());
        dto.setOwnerName(file.getOwner().getUsername());
        dto.setVersion(file.getVersion());
        dto.setIsLatestVersion(file.isLatestVersion());
        dto.setCreatedAt(file.getCreatedAt());
        dto.setUpdatedAt(file.getUpdatedAt());
        dto.setIsImage(file.isImage());
        dto.setIsDocument(file.isDocument());
        dto.setIsVideo(file.isVideo());
        
        return dto;
    }
}
