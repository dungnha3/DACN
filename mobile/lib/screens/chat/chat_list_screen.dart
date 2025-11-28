import 'package:flutter/material.dart';
import 'package:mobile/data/models/chat_room.dart';
import 'package:mobile/data/services/chat_service.dart';

import 'package:mobile/config/app_router.dart';
import 'package:intl/intl.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  _ChatListScreenState createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  final ChatService _chatService = ChatService();
  late Future<List<ChatRoom>> _chatRoomsFuture;

  @override
  void initState() {
    super.initState();
    _chatRoomsFuture = _chatService.getChatRooms();
  }

  Future<void> _refreshChatRooms() async {
    setState(() {
      _chatRoomsFuture = _chatService.getChatRooms();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Messages'),
      ),
      body: FutureBuilder<List<ChatRoom>>(
        future: _chatRoomsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No conversations yet'));
          }

          final chatRooms = snapshot.data!;
          return RefreshIndicator(
            onRefresh: _refreshChatRooms,
            child: ListView.builder(
              itemCount: chatRooms.length,
              itemBuilder: (context, index) {
                final room = chatRooms[index];
                return ListTile(
                  leading: CircleAvatar(
                    backgroundImage: room.avatarUrl != null
                        ? NetworkImage(room.avatarUrl!)
                        : null,
                    child: room.avatarUrl == null
                        ? Text(room.name.substring(0, 1).toUpperCase())
                        : null,
                  ),
                  title: Text(room.name, style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Row(
                    children: [
                      Expanded(
                        child: Text(
                          room.lastMessage?.content ?? 'No messages yet',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: room.unreadCount > 0 ? Colors.black87 : Colors.grey,
                            fontWeight: room.unreadCount > 0 ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ),
                    ],
                  ),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (room.lastMessageAt != null)
                        Text(
                          DateFormat('HH:mm').format(room.lastMessageAt!),
                          style: TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      SizedBox(height: 4),
                      if (room.unreadCount > 0)
                        Container(
                          padding: EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            '${room.unreadCount}',
                            style: TextStyle(color: Colors.white, fontSize: 12),
                          ),
                        ),
                    ],
                  ),
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      AppRouter.chat,
                      arguments: {'roomId': room.roomId, 'roomName': room.name},
                    ).then((_) => _refreshChatRooms());
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }
}
