import 'package:flutter/material.dart';
import 'package:mobile/data/models/message.dart';
import 'package:mobile/data/services/auth_service.dart';
import 'package:mobile/data/services/chat_service.dart';
import 'package:mobile/data/services/websocket_service.dart';
import 'package:intl/intl.dart';

class ChatScreen extends StatefulWidget {
  final int roomId;
  final String roomName;

  const ChatScreen({Key? key, required this.roomId, required this.roomName}) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ChatService _chatService = ChatService();
  final WebSocketService _webSocketService = WebSocketService();
  final AuthService _authService = AuthService();
  
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  List<Message> _messages = [];
  bool _isLoading = true;
  int? _currentUserId;

  @override
  void initState() {
    super.initState();
    _loadCurrentUser();
    _loadMessages();
    _connectWebSocket();
  }

  Future<void> _loadCurrentUser() async {
    final userId = await _authService.getUserId();
    if (userId != null) {
      setState(() {
        _currentUserId = int.parse(userId);
      });
    }
  }

  Future<void> _loadMessages() async {
    try {
      final messages = await _chatService.getMessages(widget.roomId);
      setState(() {
        _messages = messages.reversed.toList(); // Show newest at bottom
        _isLoading = false;
      });
      _scrollToBottom();
    } catch (e) {

      setState(() => _isLoading = false);
    }
  }

  Future<void> _connectWebSocket() async {
    final token = await _authService.getAccessToken();
    if (token != null) {
      _webSocketService.connect(token, onConnect: (frame) {
        _subscribeToRoom();
      });
    }
  }

  void _subscribeToRoom() {
    _webSocketService.subscribe('/topic/room.${widget.roomId}', (data) {
      // Handle incoming message
      // Check if it's a chat message
      if (data['type'] == 'CHAT_MESSAGE') {
         // Parse message data
         // Note: The structure might differ slightly from REST API Message model
         // We might need to map it manually or ensure backend sends compatible JSON
         // For now, let's assume 'data' field contains the Message object or similar
         
         // Based on WebSocketNotificationService.java:
         // wsMessage.setData(message); // Set full message object for frontend
         
         if (data['data'] != null) {
           final newMessage = Message.fromJson(data['data']);
           setState(() {
             _messages.insert(0, newMessage); // Add to bottom (reversed list)
           });
         }
      }
    });
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;

    final content = _messageController.text;
    _messageController.clear();

    try {
      // Optimistic update (optional, but let's wait for server response for now to be safe)
      final newMessage = await _chatService.sendMessage(widget.roomId, content);
      setState(() {
        _messages.insert(0, newMessage);
      });
      _scrollToBottom();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send message')),
      );
    }
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        0.0, // Because we reversed the list
        duration: Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  void dispose() {
    _webSocketService.unsubscribe('/topic/room.${widget.roomId}');
    // Don't disconnect here if we want to keep connection alive for notifications
    // But for now, let's keep it simple.
    // Ideally WebSocketService should be a singleton or provided via Provider
    // Since I created a new instance here, I should disconnect it?
    // Wait, WebSocketService in `_ChatScreenState` is a new instance.
    // If I disconnect, it closes the socket.
    // If I navigate back, this state is disposed.
    // So yes, disconnect.
    _webSocketService.disconnect();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(widget.roomName),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: theme.primaryColor))
                : ListView.builder(
                    controller: _scrollController,
                    reverse: true, // Start from bottom
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      final isMe = message.sender.userId == _currentUserId;
                      return _buildMessageBubble(message, isMe, theme);
                    },
                  ),
          ),
          _buildMessageInput(theme),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message, bool isMe, ThemeData theme) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(
          color: isMe ? theme.primaryColor : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isMe ? const Radius.circular(16) : const Radius.circular(4),
            bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isMe)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  message.sender.username,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: theme.primaryColor,
                  ),
                ),
              ),
            Text(
              message.content,
              style: TextStyle(
                color: isMe ? Colors.white : Colors.black87,
                fontSize: 15,
              ),
            ),
            const SizedBox(height: 4),
            Align(
              alignment: Alignment.bottomRight,
              child: Text(
                DateFormat('HH:mm').format(message.sentAt),
                style: TextStyle(
                  fontSize: 10,
                  color: isMe ? Colors.white70 : Colors.grey[500],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageInput(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(30),
                ),
                child: TextField(
                  controller: _messageController,
                  decoration: const InputDecoration(
                    hintText: 'Nhập tin nhắn...',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 14),
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                color: theme.primaryColor,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                onPressed: _sendMessage,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
