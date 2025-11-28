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
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.roomName),
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : ListView.builder(
                    controller: _scrollController,
                    reverse: true, // Start from bottom
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      final isMe = message.sender.userId == _currentUserId;
                      return _buildMessageBubble(message, isMe);
                    },
                  ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        padding: EdgeInsets.symmetric(vertical: 10, horizontal: 14),
        decoration: BoxDecoration(
          color: isMe ? Colors.blue : Colors.grey[300],
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isMe)
              Text(
                message.sender.username,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.black54,
                ),
              ),
            Text(
              message.content,
              style: TextStyle(color: isMe ? Colors.white : Colors.black87),
            ),
            SizedBox(height: 2),
            Text(
              DateFormat('HH:mm').format(message.sentAt),
              style: TextStyle(
                fontSize: 10,
                color: isMe ? Colors.white70 : Colors.black54,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                border: InputBorder.none,
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          IconButton(
            icon: Icon(Icons.send, color: Colors.blue),
            onPressed: _sendMessage,
          ),
        ],
      ),
    );
  }
}
