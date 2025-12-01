import 'package:flutter/material.dart';
import '../../data/services/notification_service.dart';
import '../../data/models/notification_model.dart';
import '../../config/app_router.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final NotificationService _notificationService = NotificationService();
  
  bool _isLoading = false;
  List<NotificationModel> _notifications = [];
  int _page = 0;
  bool _hasMore = true;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
      if (_hasMore && !_isLoading) {
        _fetchNotifications(loadMore: true);
      }
    }
  }

  Future<void> _fetchNotifications({bool loadMore = false}) async {
    if (_isLoading) return;
    
    setState(() => _isLoading = true);
    try {
      if (!loadMore) {
        _page = 0;
        _notifications.clear();
      }

      final newNotifications = await _notificationService.getNotifications(page: _page);
      
      setState(() {
        _notifications.addAll(newNotifications);
        _page++;
        _hasMore = newNotifications.length >= 20; // Assuming page size 20
      });
    } catch (e) {
       // Handle error
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(int id, int index) async {
    try {
      await _notificationService.markAsRead(id);
      // Optimistically update UI
      // Since NotificationModel is final, we might need to replace the item or just force rebuild
      // But for simplicity, we can't easily modify final fields.
      // Let's just re-fetch or ignore for now, or create a copy.
      // Creating a copy is better.
      final old = _notifications[index];
      final updated = NotificationModel(
        id: old.id,
        title: old.title,
        content: old.content,
        type: old.type,
        isRead: true,
        createdAt: old.createdAt,
      );
      
      setState(() {
        _notifications[index] = updated;
      });
    } catch (e) {
      // ignore
    }
  }

  Future<void> _markAllAsRead() async {
    try {
      await _notificationService.markAllAsRead();
      setState(() {
        _notifications = _notifications.map((n) => NotificationModel(
          id: n.id,
          title: n.title,
          content: n.content,
          type: n.type,
          isRead: true,
          createdAt: n.createdAt,
        )).toList();
      });
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã đánh dấu tất cả là đã đọc')),
        );
      }
    } catch (e) {
      // ignore
    }
  }

  Future<void> _deleteNotification(int id, int index) async {
    try {
      await _notificationService.deleteNotification(id);
      setState(() {
        _notifications.removeAt(index);
      });
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã xóa thông báo')),
        );
      }
    } catch (e) {
      // ignore
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Thông báo'),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all),
            tooltip: 'Đánh dấu tất cả đã đọc',
            onPressed: _markAllAsRead,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => _fetchNotifications(loadMore: false),
        child: _notifications.isEmpty && !_isLoading
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.notifications_off_outlined, size: 80, color: Colors.grey[300]),
                    const SizedBox(height: 20),
                    Text('Không có thông báo nào', style: TextStyle(color: Colors.grey[600], fontSize: 16)),
                  ],
                ),
              )
            : ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: _notifications.length + (_hasMore ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _notifications.length) {
                    return Center(child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: CircularProgressIndicator(color: theme.primaryColor),
                    ));
                  }

                  final notification = _notifications[index];
                  final bool isRead = notification.isRead;

                  return Dismissible(
                    key: Key(notification.id.toString()),
                    direction: DismissDirection.endToStart,
                    background: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.error,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.centerRight,
                      padding: const EdgeInsets.only(right: 20),
                      child: const Icon(Icons.delete, color: Colors.white),
                    ),
                    onDismissed: (direction) {
                      _deleteNotification(notification.id, index);
                    },
                    child: Card(
                      color: isRead ? Colors.white : theme.primaryColor.withOpacity(0.05),
                      elevation: isRead ? 1 : 0,
                      shadowColor: Colors.black12,
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: isRead ? BorderSide.none : BorderSide(color: theme.primaryColor.withOpacity(0.2)),
                      ),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () {
                          if (!isRead) {
                            _markAsRead(notification.id, index);
                          }
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: isRead ? Colors.grey[200] : theme.primaryColor.withOpacity(0.1),
                                child: Icon(
                                  _getIconForType(notification.type),
                                  color: isRead ? Colors.grey : theme.primaryColor,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            notification.title,
                                            style: TextStyle(
                                              fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                              fontSize: 16,
                                              color: isRead ? Colors.black87 : theme.primaryColor,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        if (!isRead)
                                          Container(
                                            width: 8,
                                            height: 8,
                                            decoration: BoxDecoration(
                                              color: theme.colorScheme.error,
                                              shape: BoxShape.circle,
                                            ),
                                          ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      notification.content,
                                      style: TextStyle(color: Colors.grey[700], height: 1.4, fontSize: 14),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      notification.createdAt,
                                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'TASK':
        return Icons.assignment_outlined;
      case 'CHAT':
        return Icons.chat_bubble_outline;
      case 'SYSTEM':
        return Icons.info_outline;
      case 'LEAVE':
        return Icons.calendar_today_outlined;
      case 'PAYROLL':
        return Icons.attach_money;
      default:
        return Icons.notifications_none;
    }
  }
}
