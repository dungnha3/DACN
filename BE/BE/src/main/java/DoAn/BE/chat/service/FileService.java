package DoAn.BE.chat.service;

import DoAn.BE.chat.dto.MessDTO;
import DoAn.BE.chat.dto.SendMessageRequest;
import DoAn.BE.chat.entity.ChatRoom;
import DoAn.BE.chat.entity.ChatRoomMember;
import DoAn.BE.chat.entity.Message;
import DoAn.BE.chat.entity.MessageStatus;
import DoAn.BE.chat.repository.ChatRoomRepository;
import DoAn.BE.chat.repository.ChatRoomMemberRepository;
import DoAn.BE.chat.repository.MessageRepository;
import DoAn.BE.chat.repository.MessageStatusRepository;
import DoAn.BE.storage.repository.FileRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.dto.UserDTO;
import DoAn.BE.user.repository.UserRepository;
import DoAn.BE.common.exception.BadRequestException;
import DoAn.BE.common.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FileService {

    @Autowired
    private FileRepository fileRepository;
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private MessageStatusRepository messageStatusRepository;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Gửi tin nhắn có file đính kèm
     */
    public MessDTO sendMessageWithFile(SendMessageRequest request, Long senderId) {
        // Validate sender tồn tại
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new EntityNotFoundException("Người gửi không tồn tại"));
        
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));
        
        // Kiểm tra sender có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(request.getRoomId(), senderId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền gửi tin nhắn trong phòng này");
        }
        
        // Validate file tồn tại
        if (request.getFileId() == null) {
            throw new BadRequestException("File ID không được để trống");
        }
        
        DoAn.BE.storage.entity.File file = fileRepository.findById(request.getFileId())
            .orElseThrow(() -> new EntityNotFoundException("File không tồn tại"));
        
        // Tạo Message entity
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setMessageType(detectMessageType(request));
        message.setFile(file);
        message.setSentAt(LocalDateTime.now());
        message.setIsDeleted(false);
        
        // Lưu tin nhắn
        message = messageRepository.save(message);
        
        // Tạo MessageStatus cho tất cả members (trừ sender)
        List<ChatRoomMember> members = chatRoomMemberRepository.findByChatRoom_RoomId(request.getRoomId());
        for (ChatRoomMember member : members) {
            if (!member.getUser().getUserId().equals(senderId)) {
                MessageStatus status = new MessageStatus();
                status.setMessage(message);
                status.setUser(member.getUser());
                status.setStatus(MessageStatus.MessageStatusType.DELIVERED);
                status.setTimestamp(LocalDateTime.now());
                messageStatusRepository.save(status);
            }
        }
        
        return convertToMessageDTO(message);
    }
    
    /**
     * Upload file và gửi tin nhắn
     */
    public MessDTO uploadAndSendFile(MultipartFile file, Long roomId, String content, Long senderId) {
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("File không được để trống");
        }
        
        // Validate file size (ví dụ: max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File không được vượt quá 10MB");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("application/"))) {
            throw new BadRequestException("Loại file không được hỗ trợ");
        }
        
        // Lưu file
        DoAn.BE.storage.entity.File fileEntity = new DoAn.BE.storage.entity.File();
        fileEntity.setOriginalFilename(file.getOriginalFilename());
        fileEntity.setFilename(file.getOriginalFilename());
        fileEntity.setFileSize(file.getSize());
        fileEntity.setMimeType(contentType);
        fileEntity.setFilePath("/uploads/" + file.getOriginalFilename()); // TODO: Implement file storage
        fileEntity = fileRepository.save(fileEntity);
        
        // Tạo SendMessageRequest
        SendMessageRequest request = new SendMessageRequest();
        request.setRoomId(roomId);
        request.setContent(content);
        request.setFileId(fileEntity.getFileId());
        request.setFileName(fileEntity.getOriginalFilename());
        request.setFileUrl(fileEntity.getFilePath());
        request.setFileSize(fileEntity.getFileSize());
        request.setFileType(fileEntity.getMimeType());
        
        return sendMessageWithFile(request, senderId);
    }
    
    /**
     * Upload và gửi hình ảnh
     */
    public MessDTO uploadAndSendImage(MultipartFile imageFile, Long roomId, String caption, Long senderId) {
        // Validate file
        if (imageFile.isEmpty()) {
            throw new BadRequestException("Hình ảnh không được để trống");
        }
        
        // Validate file size (ví dụ: max 5MB cho ảnh)
        if (imageFile.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Hình ảnh không được vượt quá 5MB");
        }
        
        // Validate file type - chỉ cho phép ảnh
        String contentType = imageFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Chỉ được phép gửi file hình ảnh");
        }
        
        // Validate image format
        String fileName = imageFile.getOriginalFilename();
        if (fileName == null || !isValidImageFormat(fileName)) {
            throw new BadRequestException("Định dạng ảnh không được hỗ trợ. Chỉ hỗ trợ: JPG, JPEG, PNG, GIF, WEBP");
        }
        
        // Lưu file ảnh
        DoAn.BE.storage.entity.File imageEntity = new DoAn.BE.storage.entity.File();
        imageEntity.setOriginalFilename(fileName);
        imageEntity.setFilename(fileName);
        imageEntity.setFileSize(imageFile.getSize());
        imageEntity.setMimeType(contentType);
        imageEntity.setFilePath("/uploads/images/" + fileName); // TODO: Implement image storage
        imageEntity = fileRepository.save(imageEntity);
        
        // Tạo SendMessageRequest cho ảnh
        SendMessageRequest request = new SendMessageRequest();
        request.setRoomId(roomId);
        request.setContent(caption); // Caption cho ảnh
        request.setFileId(imageEntity.getFileId());
        request.setFileName(imageEntity.getOriginalFilename());
        request.setFileUrl(imageEntity.getFilePath());
        request.setFileSize(imageEntity.getFileSize());
        request.setFileType(imageEntity.getMimeType());
        request.setMessageType(Message.MessageType.IMAGE); // Force set là IMAGE
        
        return sendMessageWithFile(request, senderId);
    }
    
    /**
     * Lấy danh sách file trong phòng chat
     */
    public List<MessDTO> getFilesByRoomId(Long roomId, Long userId) {
        // Validate phòng chat tồn tại
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));
        
        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền xem file trong phòng này");
        }
        
        // Lấy tin nhắn có file
        List<Message> messages = messageRepository.findByChatRoom_RoomIdOrderBySentAtAsc(roomId);
        
        return messages.stream()
            .filter(message -> message.getFile() != null)
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Lấy danh sách hình ảnh trong phòng chat
     */
    public List<MessDTO> getImagesByRoomId(Long roomId, Long userId) {
        // Validate phòng chat tồn tại
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));
        
        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền xem hình ảnh trong phòng này");
        }
        
        // Lấy tin nhắn có hình ảnh
        List<Message> messages = messageRepository.findByChatRoom_RoomIdOrderBySentAtAsc(roomId);
        
        return messages.stream()
            .filter(message -> message.getMessageType() == Message.MessageType.IMAGE)
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Kiểm tra định dạng ảnh có hợp lệ không
     */
    private boolean isValidImageFormat(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return List.of("jpg", "jpeg", "png", "gif", "webp", "bmp").contains(extension);
    }
    
    /**
     * Tự động detect loại tin nhắn
     */
    private Message.MessageType detectMessageType(SendMessageRequest request) {
        if (request.getFileId() != null) {
            String fileName = request.getFileName();
            if (fileName != null) {
                String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                if (List.of("jpg", "jpeg", "png", "gif", "webp").contains(extension)) {
                    return Message.MessageType.IMAGE;
                }
            }
            return Message.MessageType.FILE;
        }
        return Message.MessageType.TEXT;
    }
    
    /**
     * Convert Message entity sang DTO
     */
    private MessDTO convertToMessageDTO(Message message) {
        MessDTO dto = new MessDTO();
        dto.setMessageId(message.getMessageId());
        dto.setRoomId(message.getChatRoom().getRoomId());
        // Convert User to UserDTO
        UserDTO senderDTO = new UserDTO();
        senderDTO.setUserId(message.getSender().getUserId());
        senderDTO.setUsername(message.getSender().getUsername());
        senderDTO.setEmail(message.getSender().getEmail());
        senderDTO.setAvatarUrl(message.getSender().getAvatarUrl());
        dto.setSender(senderDTO);
        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setFileId(message.getFile() != null ? message.getFile().getFileId() : null);
        dto.setFileName(message.getFile() != null ? message.getFile().getOriginalFilename() : null);
        dto.setFileUrl(message.getFile() != null ? message.getFile().getFilePath() : null);
        dto.setSentAt(message.getSentAt());
        dto.setIsDeleted(message.getIsDeleted());
        dto.setEditedAt(message.getEditedAt());
        dto.setIsEdited(message.getEditedAt() != null);
        
        return dto;
    }
}
