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
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Tin nhắn'),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: FutureBuilder<List<ChatRoom>>(
        future: _chatRoomsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator(color: theme.primaryColor));
          } else if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('Chưa có cuộc trò chuyện nào'));
          }

          final chatRooms = snapshot.data!;
          return RefreshIndicator(
            onRefresh: _refreshChatRooms,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 10),
              itemCount: chatRooms.length,
              separatorBuilder: (context, index) => const Divider(height: 1, indent: 80),
              itemBuilder: (context, index) {
                final room = chatRooms[index];
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  leading: CircleAvatar(
                    radius: 28,
                    backgroundColor: theme.primaryColor.withOpacity(0.1),
                    backgroundImage: room.avatarUrl != null
                        ? NetworkImage(room.avatarUrl!)
                        : null,
                    child: room.avatarUrl == null
                        ? Text(
                            room.name.substring(0, 1).toUpperCase(),
                            style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 20),
                          )
                        : null,
                  ),
                  title: Text(
                    room.name,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      room.lastMessage?.content ?? 'Chưa có tin nhắn',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: room.unreadCount > 0 ? Colors.black87 : Colors.grey[600],
                        fontWeight: room.unreadCount > 0 ? FontWeight.bold : FontWeight.normal,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (room.lastMessageAt != null)
                        Text(
                          DateFormat('HH:mm').format(room.lastMessageAt!),
                          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                        ),
                      const SizedBox(height: 6),
                      if (room.unreadCount > 0)
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.error,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            '${room.unreadCount}',
                            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
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
