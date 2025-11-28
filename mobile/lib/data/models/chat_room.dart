import 'package:mobile/data/models/message.dart';
import 'package:mobile/data/models/user.dart';

enum RoomType { PRIVATE, GROUP }

class ChatRoom {
  final int roomId;
  final String name;
  final String? avatarUrl;
  final RoomType type;
  final int unreadCount;
  final Message? lastMessage;
  final DateTime? lastMessageAt;
  final List<User> members;

  ChatRoom({
    required this.roomId,
    required this.name,
    this.avatarUrl,
    required this.type,
    this.unreadCount = 0,
    this.lastMessage,
    this.lastMessageAt,
    this.members = const [],
  });

  factory ChatRoom.fromJson(Map<String, dynamic> json) {
    return ChatRoom(
      roomId: json['roomId'],
      name: json['name'] ?? 'Unknown Room',
      avatarUrl: json['avatarUrl'],
      type: _parseRoomType(json['roomType']),
      unreadCount: json['unreadCount'] ?? 0,
      lastMessage: json['lastMessage'] != null ? Message.fromJson(json['lastMessage']) : null,
      lastMessageAt: json['lastMessageAt'] != null ? DateTime.parse(json['lastMessageAt']) : null,
      members: (json['members'] as List<dynamic>?)
              ?.map((e) => User.fromJson(e))
              .toList() ??
          [],
    );
  }

  static RoomType _parseRoomType(String? type) {
    return type == 'GROUP' ? RoomType.GROUP : RoomType.PRIVATE;
  }
}
