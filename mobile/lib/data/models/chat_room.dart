import 'package:mobile/data/models/message.dart';
import 'package:mobile/data/models/user.dart';

enum RoomType { DIRECT, GROUP, PROJECT }

class ChatRoom {
  final int roomId;
  final String name;
  final String? avatarUrl;
  final RoomType type;
  final int unreadCount;
  final Message? lastMessage;
  final DateTime? lastMessageAt;
  final List<User> members;
  final int? projectId;

  ChatRoom({
    required this.roomId,
    required this.name,
    this.avatarUrl,
    required this.type,
    this.unreadCount = 0,
    this.lastMessage,
    this.lastMessageAt,
    this.members = const [],
    this.projectId,
  });

  factory ChatRoom.fromJson(Map<String, dynamic> json) {
    return ChatRoom(
      roomId: json['roomId'] ?? 0,
      name: json['name'] ?? 'Unknown Room',
      avatarUrl: json['avatarUrl'],
      type: _parseRoomType(json['type'] ?? json['roomType']),
      unreadCount: json['unreadCount'] ?? 0,
      lastMessage: json['lastMessage'] != null ? Message.fromJson(json['lastMessage']) : null,
      lastMessageAt: json['lastMessageAt'] != null ? DateTime.tryParse(json['lastMessageAt']) : null,
      members: (json['members'] as List<dynamic>?)
              ?.map((e) => User.fromJson(e))
              .toList() ??
          [],
      projectId: json['project']?['projectId'] ?? json['projectId'],
    );
  }

  static RoomType _parseRoomType(String? type) {
    switch (type?.toUpperCase()) {
      case 'DIRECT':
        return RoomType.DIRECT;
      case 'GROUP':
        return RoomType.GROUP;
      case 'PROJECT':
        return RoomType.PROJECT;
      default:
        return RoomType.DIRECT;
    }
  }

  // Helper to get display name for direct chats
  String getDisplayName(int currentUserId) {
    if (type == RoomType.DIRECT && members.length == 2) {
      final otherMember = members.firstWhere(
        (m) => m.userId != currentUserId,
        orElse: () => members.first,
      );
      return otherMember.username;
    }
    return name;
  }
}
