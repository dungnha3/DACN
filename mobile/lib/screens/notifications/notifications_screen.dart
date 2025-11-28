import 'package:flutter/material.dart';
import '../../data/services/notification_service.dart';
import '../../config/app_router.dart';


class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final NotificationService _notificationService = NotificationService();
  
  bool _isLoading = false;
  List<dynamic> _notifications = [];
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

      final data = await _notificationService.getNotifications(page: _page);
      final List<dynamic> newNotifications = data['content'] ?? [];
      
      setState(() {
        _notifications.addAll(newNotifications);
        _page++;
        _hasMore = !data['last'];
      });
    } catch (e) {

    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(int id, int index) async {
    try {
      await _notificationService.markAsRead(id);
      setState(() {
        _notifications[index]['read'] = true;
      });
    } catch (e) {

    }
  }

  Future<void> _markAllAsRead() async {
    try {
      await _notificationService.markAllAsRead();
      setState(() {
        for (var n in _notifications) {
          n['read'] = true;
        }
      });
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã đánh dấu tất cả là đã đọc')),
        );
      }
    } catch (e) {

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

    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Thông báo'),
        centerTitle: true,
        backgroundColor: Colors.blue.shade800,
        foregroundColor: Colors.white,
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
                    Icon(Icons.notifications_off_outlined, size: 64, color: Colors.grey[400]),
                    const SizedBox(height: 16),
                    Text('Không có thông báo nào', style: TextStyle(color: Colors.grey[600])),
                  ],
                ),
              )
            : ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(10),
                itemCount: _notifications.length + (_hasMore ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _notifications.length) {
                    return const Center(child: Padding(
                      padding: EdgeInsets.all(10),
                      child: CircularProgressIndicator(),
                    ));
                  }

                  final notification = _notifications[index];
                  final bool isRead = notification['read'] ?? false;

                  return Dismissible(
                    key: Key(notification['id'].toString()),
                    direction: DismissDirection.endToStart,
                    background: Container(
                      color: Colors.red,
                      alignment: Alignment.centerRight,
                      padding: const EdgeInsets.only(right: 20),
                      child: const Icon(Icons.delete, color: Colors.white),
                    ),
                    onDismissed: (direction) {
                      _deleteNotification(notification['id'], index);
                    },
                    child: Card(
                      color: isRead ? Colors.white : Colors.blue.shade50,
                      elevation: 1,
                      margin: const EdgeInsets.only(bottom: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        leading: CircleAvatar(
                          backgroundColor: isRead ? Colors.grey[300] : Colors.blue.shade100,
                          child: Icon(
                            Icons.notifications,
                            color: isRead ? Colors.grey : Colors.blue.shade800,
                          ),
                        ),
                        title: Text(
                          notification['title'] ?? 'Thông báo',
                          style: TextStyle(
                            fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 5),
                            Text(
                              notification['message'] ?? '',
                              style: TextStyle(color: Colors.grey[800]),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              notification['createdAt'] ?? '', // Format date if needed
                              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                        onTap: () {
                          if (!isRead) {
                            _markAsRead(notification['id'], index);
                          }
                          // Navigate if link exists
                          // Navigate if link exists
                          if (notification['type'] == 'TASK' && notification['referenceId'] != null) {
                             Navigator.pushNamed(
                               context, 
                               AppRouter.issueDetail,
                               arguments: {'issueId': notification['referenceId']},
                             );
                          } else if (notification['type'] == 'CHAT' && notification['referenceId'] != null) {
                             // For chat, we might need more info like roomName, but if we only have ID:
                             // We might need to fetch room details or just pass ID and let ChatScreen handle it?
                             // ChatScreen needs roomName. Let's assume we pass a placeholder or fetch it.
                             // Or maybe the notification payload has it.
                             // For now, let's just navigate if we have enough info.
                             // Actually, let's just log it if we can't navigate fully.
                          }
                        },
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
