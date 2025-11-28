import 'api_service.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<dynamic> getNotifications({int page = 0, int size = 20}) async {
    return await _apiService.get('/thong-bao?page=$page&size=$size');
  }

  Future<dynamic> getUnreadCount() async {
    return await _apiService.get('/thong-bao/unread-count');
  }

  Future<dynamic> markAsRead(int notificationId) async {
    return await _apiService.put('/thong-bao/$notificationId/read', {});
  }

  Future<dynamic> markAllAsRead() async {
    return await _apiService.put('/thong-bao/mark-all-read', {});
  }
  
  Future<dynamic> deleteNotification(int notificationId) async {
    return await _apiService.delete('/thong-bao/$notificationId');
  }
}
