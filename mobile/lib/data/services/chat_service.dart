import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/config/app_constants.dart';
import 'package:mobile/data/models/chat_room.dart';
import 'package:mobile/data/models/message.dart';
import 'package:mobile/data/services/auth_service.dart';

class ChatService {
  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Get all chat rooms
  Future<List<ChatRoom>> getChatRooms() async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('${AppConstants.apiBaseUrl}/chat/rooms'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => ChatRoom.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load chat rooms: ${response.body}');
    }
  }

  // Get messages for a room
  Future<List<Message>> getMessages(int roomId, {int page = 0, int size = 50}) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('${AppConstants.apiBaseUrl}/chat/rooms/$roomId/messages?page=$page&size=$size'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final List<dynamic> content = data['content'];
      return content.map((json) => Message.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load messages: ${response.body}');
    }
  }

  // Send a text message
  Future<Message> sendMessage(int roomId, String content) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('${AppConstants.apiBaseUrl}/chat/rooms/$roomId/messages'),
      headers: headers,
      body: json.encode({'content': content, 'type': 'TEXT'}),
    );

    if (response.statusCode == 201) {
      return Message.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to send message: ${response.body}');
    }
  }
}
