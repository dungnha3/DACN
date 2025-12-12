import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../config/app_constants.dart';
import '../models/notification_model.dart';
import 'api_service.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  // Get my notifications
  // Backend: GET /api/notifications?page=0&size=20&sort=createdAt,desc
  Future<List<NotificationModel>> getMyNotifications({int page = 0, int size = 20}) async {
    try {
      final response = await _apiService.get('/notifications?page=$page&size=$size&sort=createdAt,desc');
      
      // Backend returns Page<Notification>
      if (response is Map<String, dynamic> && response.containsKey('content')) {
        final content = response['content'] as List;
        return content.map((e) => NotificationModel.fromJson(e)).toList();
      } else if (response is List) {
         // Fallback if backend changes to list
         return response.map((e) => NotificationModel.fromJson(e)).toList();
      } else {
        debugPrint('Unexpected response format: ${response.runtimeType}');
      }
    } catch (e) {
      debugPrint('Error getting notifications: $e');
    }
    return [];
  }

  // Get unread count
  // Backend: GET /api/notifications/unread-count
  Future<int> getUnreadCount() async {
    try {
      final response = await _apiService.get('/notifications/unread-count');
      if (response is Map<String, dynamic> && response.containsKey('unreadCount')) {
        return response['unreadCount'] as int;
      }
    } catch (e) {
      debugPrint('Error getting unread count: $e');
    }
    return 0;
  }

  // Mark as read
  // Backend: PUT /api/notifications/{notificationId}/read
  Future<bool> markAsRead(int notificationId) async {
    try {
      await _apiService.put('/notifications/$notificationId/read', {});
      return true;
    } catch (e) {
      debugPrint('Error marking as read: $e');
      return false;
    }
  }

  // Mark ALL as read
  // Backend: PUT /api/notifications/mark-all-read
  Future<bool> markAllAsRead() async {
    try {
      await _apiService.put('/notifications/mark-all-read', {});
      return true;
    } catch (e) {
      debugPrint('Error marking all as read: $e');
      return false;
    }
  }

  // Delete notification
  // Backend: DELETE /api/notifications/{notificationId}
  Future<bool> deleteNotification(int notificationId) async {
    try {
      await _apiService.delete('/notifications/$notificationId');
      return true;
    } catch (e) {
      debugPrint('Error deleting notification: $e');
      return false;
    }
  }
}
