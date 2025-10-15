# 🚀 Chat System - Backend API

## 📋 Tổng quan

Hệ thống chat real-time được xây dựng với Spring Boot, cung cấp đầy đủ tính năng chat enterprise-level với WebSocket, notification system, và file management.

## 🏗️ Kiến trúc hệ thống

### 📁 Cấu trúc thư mục
```
src/main/java/DoAn/BE/
├── chat/                    # Chat System
│   ├── controller/         # REST Controllers (6 files)
│   ├── service/           # Business Logic (7 services)
│   ├── repository/        # Data Access Layer
│   ├── entity/           # JPA Entities
│   ├── dto/              # Data Transfer Objects
│   ├── exception/        # Custom Exceptions
│   └── websocket/        # WebSocket Configuration
├── notification/          # Notification System
├── auth/                 # Authentication & Authorization
├── user/                 # User Management
├── common/               # Shared Components
└── ...
```

## 🚀 Tính năng chính

### 💬 Chat Features
- ✅ **Tạo phòng chat** - Group chat và direct chat
- ✅ **Gửi tin nhắn** - Text, file, hình ảnh
- ✅ **Quản lý thành viên** - Add/remove members, roles
- ✅ **Tìm kiếm tin nhắn** - Multi-criteria search
- ✅ **Sửa/xóa tin nhắn** - Message management
- ✅ **Reply tin nhắn** - Thread conversations
- ✅ **Typing indicators** - Real-time typing status
- ✅ **Message status** - Delivered/Seen tracking

### ⚡ Real-time Features
- ✅ **WebSocket** - Real-time communication
- ✅ **Live notifications** - Push notifications
- ✅ **User presence** - Online/offline status
- ✅ **Typing indicators** - Who's typing
- ✅ **Room events** - User join/leave notifications

### 🔒 Security & Authentication
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-based access** - Admin/Member permissions
- ✅ **Input validation** - Request validation
- ✅ **CORS support** - Cross-origin requests

## 📊 API Endpoints

### 🏠 Chat Room Management (10 endpoints)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/chat/rooms` | Tạo phòng chat mới |
| GET | `/api/chat/rooms` | Danh sách phòng chat |
| GET | `/api/chat/rooms/{roomId}` | Thông tin phòng chat |
| POST | `/api/chat/rooms/direct/{userId}` | Tạo chat 1-1 |
| POST | `/api/chat/rooms/{roomId}/members/{userId}` | Thêm thành viên |
| DELETE | `/api/chat/rooms/{roomId}/members/{userId}` | Xóa thành viên |
| DELETE | `/api/chat/rooms/{roomId}/leave` | Rời khỏi phòng |
| PUT | `/api/chat/rooms/{roomId}/members/{userId}/role` | Thay đổi quyền |
| PUT | `/api/chat/rooms/{roomId}/settings` | Cập nhật thông tin phòng |
| GET | `/api/chat/rooms/{roomId}/members` | Danh sách thành viên |

### 💬 Message Management (9 endpoints)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/chat/rooms/{roomId}/messages` | Gửi tin nhắn |
| GET | `/api/chat/rooms/{roomId}/messages` | Lấy tin nhắn (phân trang) |
| PUT | `/api/chat/messages/{messageId}/seen` | Đánh dấu đã xem |
| PUT | `/api/chat/messages/{messageId}` | Sửa tin nhắn |
| DELETE | `/api/chat/messages/{messageId}` | Xóa tin nhắn |
| GET | `/api/chat/rooms/{roomId}/search` | Tìm kiếm tin nhắn |
| GET | `/api/chat/rooms/{roomId}/search/sender` | Tìm theo người gửi |
| GET | `/api/chat/rooms/{roomId}/search/date` | Tìm theo thời gian |
| GET | `/api/chat/rooms/{roomId}/search/type` | Tìm theo loại |

### 📁 File Management (4 endpoints)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/chat/rooms/{roomId}/files` | Upload file |
| POST | `/api/chat/rooms/{roomId}/images` | Upload hình ảnh |
| GET | `/api/chat/rooms/{roomId}/files` | Danh sách file |
| GET | `/api/chat/rooms/{roomId}/images` | Danh sách hình ảnh |

### ⌨️ Typing Indicators (3 endpoints)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/chat/rooms/{roomId}/typing/start` | Bắt đầu typing |
| POST | `/api/chat/rooms/{roomId}/typing/stop` | Dừng typing |
| GET | `/api/chat/rooms/{roomId}/typing` | Xem ai đang typing |

### 🔔 Notification System (5 endpoints)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/notifications` | Danh sách notification |
| GET | `/api/notifications/unread-count` | Đếm notification chưa đọc |
| PUT | `/api/notifications/{id}/read` | Đánh dấu đã đọc |
| PUT | `/api/notifications/mark-all-read` | Đánh dấu tất cả đã đọc |
| DELETE | `/api/notifications/{id}` | Xóa notification |

## 🔧 Cài đặt và chạy

### Yêu cầu hệ thống
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Redis (optional, for caching)

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd DACN/BE/BE

# Cài đặt dependencies
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

### Cấu hình database
Cập nhật `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🌐 WebSocket Configuration

### Kết nối WebSocket
```javascript
const socket = new SockJS('/ws/chat');
const stompClient = Stomp.over(socket);

stompClient.connect({
    'Authorization': 'Bearer ' + token
}, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to room messages
    stompClient.subscribe('/topic/room.' + roomId, function(message) {
        const messageData = JSON.parse(message.body);
        // Handle incoming message
    });
    
    // Subscribe to typing indicators
    stompClient.subscribe('/topic/room.' + roomId + '/typing', function(typing) {
        const typingData = JSON.parse(typing.body);
        // Handle typing indicators
    });
});
```

### Gửi tin nhắn qua WebSocket
```javascript
stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({
    roomId: roomId,
    content: messageContent,
    type: 'TEXT'
}));
```

## 📱 Sử dụng API

### Authentication
Tất cả API endpoints yêu cầu JWT token:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "Content-Type: application/json" \
     http://localhost:8080/api/chat/rooms
```

### Tạo phòng chat
```bash
curl -X POST http://localhost:8080/api/chat/rooms \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "My Chat Room",
       "description": "Room description",
       "roomType": "GROUP"
     }'
```

### Gửi tin nhắn
```bash
curl -X POST http://localhost:8080/api/chat/rooms/1/messages \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "content": "Hello everyone!",
       "messageType": "TEXT"
     }'
```

## 🏗️ Kiến trúc chi tiết

### Service Layer
- **ChatRoomService** - Quản lý phòng chat
- **MessageService** - Quản lý tin nhắn
- **FileService** - Upload và quản lý file
- **MessageStatusService** - Trạng thái tin nhắn
- **TypingIndicatorService** - Typing indicators
- **UserPresenceService** - Trạng thái online/offline
- **WebSocketNotificationService** - WebSocket notifications

### Entity Layer
- **ChatRoom** - Phòng chat
- **Message** - Tin nhắn
- **ChatRoomMember** - Thành viên phòng chat
- **MessageStatus** - Trạng thái tin nhắn
- **User** - Người dùng
- **File** - File đính kèm

### Repository Layer
- Custom queries cho search và filtering
- JPA repositories với Spring Data
- Optimized queries để tránh N+1 problems

## 🔒 Security

### JWT Authentication
- Token-based authentication
- Refresh token support
- Session management

### Authorization
- Role-based access control
- Room-level permissions
- Message-level permissions

### Input Validation
- Jakarta Validation annotations
- Custom validators
- SQL injection prevention

## 📊 Performance

### Optimization
- Lazy loading cho relationships
- Pagination cho large datasets
- Caching cho frequently accessed data
- Database indexing

### Monitoring
- Application logs
- Performance metrics
- Error tracking

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

## 📝 API Documentation

API documentation có thể được truy cập tại:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t chat-system .

# Run container
docker run -p 8080:8080 chat-system
```

### Production
- Sử dụng external database
- Configure Redis cho caching
- Setup load balancer
- Enable HTTPS

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.

---

**Chat System v1.0.0** - Enterprise-level real-time chat solution 🚀
