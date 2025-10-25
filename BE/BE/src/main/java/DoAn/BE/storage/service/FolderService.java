package DoAn.BE.storage.service;

import DoAn.BE.common.exception.*;
import DoAn.BE.project.entity.Project;
import DoAn.BE.project.repository.ProjectRepository;
import DoAn.BE.storage.dto.CreateFolderRequest;
import DoAn.BE.storage.dto.FolderDTO;
import DoAn.BE.storage.entity.Folder;
import DoAn.BE.storage.repository.FolderRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    
    @Transactional
    public FolderDTO createFolder(CreateFolderRequest request, Long userId) {
        // Validate user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        
        // Validate parent folder if provided
        Folder parentFolder = null;
        if (request.getParentFolderId() != null) {
            parentFolder = folderRepository.findById(request.getParentFolderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục cha"));
            
            // Check if user owns the parent folder
            if (!parentFolder.getOwner().getUserId().equals(userId)) {
                throw new ForbiddenException("Bạn không có quyền tạo thư mục con trong thư mục này");
            }
        }
        
        // Validate project if provided
        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        }
        
        // Create folder
        Folder folder = new Folder();
        folder.setName(request.getName());
        folder.setParentFolder(parentFolder);
        folder.setOwner(user);
        folder.setFolderType(request.getFolderType() != null ? request.getFolderType() : Folder.FolderType.PERSONAL);
        folder.setProject(project);
        
        folder = folderRepository.save(folder);
        return convertToDTO(folder);
    }
    
    @Transactional(readOnly = true)
    public FolderDTO getFolderById(Long folderId, Long userId) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục"));
        
        // Check if user owns the folder
        if (!folder.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xem thư mục này");
        }
        
        return convertToDTO(folder);
    }
    
    @Transactional(readOnly = true)
    public List<FolderDTO> getUserFolders(Long userId) {
        List<Folder> folders = folderRepository.findByOwner_UserId(userId);
        return folders.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<FolderDTO> getSubFolders(Long parentFolderId, Long userId) {
        // Validate parent folder
        Folder parentFolder = folderRepository.findById(parentFolderId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục cha"));
        
        // Check if user owns the parent folder
        if (!parentFolder.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xem thư mục này");
        }
        
        List<Folder> subFolders = folderRepository.findByParentFolder_FolderId(parentFolderId);
        return subFolders.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<FolderDTO> getProjectFolders(Long projectId, Long userId) {
        // Validate project exists
        projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        
        List<Folder> folders = folderRepository.findByProject_ProjectId(projectId);
        return folders.stream()
            .filter(f -> f.getOwner().getUserId().equals(userId))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public FolderDTO updateFolder(Long folderId, String newName, Long userId) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục"));
        
        // Check if user owns the folder
        if (!folder.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền sửa thư mục này");
        }
        
        folder.setName(newName);
        folder = folderRepository.save(folder);
        
        return convertToDTO(folder);
    }
    
    @Transactional
    public void deleteFolder(Long folderId, Long userId) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thư mục"));
        
        // Check if user owns the folder
        if (!folder.getOwner().getUserId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xóa thư mục này");
        }
        
        // Check if folder has files or subfolders
        if (folder.getFiles() != null && !folder.getFiles().isEmpty()) {
            throw new BadRequestException("Không thể xóa thư mục có chứa file");
        }
        
        if (folder.getSubFolders() != null && !folder.getSubFolders().isEmpty()) {
            throw new BadRequestException("Không thể xóa thư mục có chứa thư mục con");
        }
        
        folderRepository.delete(folder);
    }
    
    // Helper methods
    private FolderDTO convertToDTO(Folder folder) {
        FolderDTO dto = new FolderDTO();
        dto.setFolderId(folder.getFolderId());
        dto.setName(folder.getName());
        dto.setFullPath(folder.getFullPath());
        
        if (folder.getParentFolder() != null) {
            dto.setParentFolderId(folder.getParentFolder().getFolderId());
            dto.setParentFolderName(folder.getParentFolder().getName());
        }
        
        dto.setOwnerId(folder.getOwner().getUserId());
        dto.setOwnerName(folder.getOwner().getUsername());
        dto.setFolderType(folder.getFolderType());
        
        if (folder.getProject() != null) {
            dto.setProjectId(folder.getProject().getProjectId());
            dto.setProjectName(folder.getProject().getName());
        }
        
        dto.setCreatedAt(folder.getCreatedAt());
        dto.setFileCount(folder.getFiles() != null ? folder.getFiles().size() : 0);
        dto.setSubFolderCount(folder.getSubFolders() != null ? folder.getSubFolders().size() : 0);
        
        return dto;
    }
}
