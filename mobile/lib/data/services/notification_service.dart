import 'api_service.dart';
import '../models/notification_model.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<List<NotificationModel>> getNotifications({int page = 0, int size = 20}) async {
    try {
      final response = await _apiService.get('/notification?page=$page&size=$size');
      if (response != null && response['content'] is List) {
        return (response['content'] as List).map((e) => NotificationModel.fromJson(e)).toList();
      }
    } catch (e) {
      // ignore
    }
    return [];
  }

  Future<Map<String, dynamic>?> getUnreadCount() async {
    try {
      return await _apiService.get('/notification/unread-count');
    } catch (e) {
      return null;
    }
  }

  Future<void> markAsRead(int notificationId) async {
    await _apiService.patch('/notification/$notificationId/read', {});
  }

  Future<void> markAllAsRead() async {
    await _apiService.patch('/notification/mark-all-read', {});
  }
  
  Future<void> deleteNotification(int notificationId) async {
    await _apiService.delete('/notification/$notificationId');
  }
}
