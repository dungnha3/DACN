import 'package:flutter/material.dart';
import '../../data/services/notification_service.dart';
import '../../data/services/thong_bao_service.dart';
import '../../data/models/notification_model.dart';
import '../../data/models/thong_bao_model.dart';
import '../../config/app_router.dart';
import '../hr/payroll_screen.dart';
import 'package:intl/intl.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  final NotificationService _notificationService = NotificationService();
  final ThongBaoService _thongBaoService = ThongBaoService();
  
  // System Notifications State
  bool _isLoadingSys = false;
  List<NotificationModel> _sysNotifications = [];
  int _pageSys = 0;
  bool _hasMoreSys = true;

  // News (ThongBao) State
  bool _isLoadingNews = false;
  List<ThongBaoModel> _newsNotifications = [];
  int _pageNews = 0;
  bool _hasMoreNews = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchSystemNotifications();
    _fetchNewsNotifications();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // --- Fetching Logic ---

  Future<void> _fetchSystemNotifications({bool loadMore = false}) async {
    if (_isLoadingSys) return;
    setState(() => _isLoadingSys = true);
    try {
      if (!loadMore) {
        _pageSys = 0;
        _sysNotifications.clear();
      }
      final newItems = await _notificationService.getMyNotifications(page: _pageSys);
      setState(() {
        _sysNotifications.addAll(newItems);
        _pageSys++;
        _hasMoreSys = newItems.length >= 20;
      });
    } catch (e) {
      debugPrint("Error fetching system notifications: $e");
    } finally {
      if (mounted) setState(() => _isLoadingSys = false);
    }
  }

  Future<void> _fetchNewsNotifications({bool loadMore = false}) async {
    if (_isLoadingNews) return;
    setState(() => _isLoadingNews = true);
    try {
      if (!loadMore) {
        _pageNews = 0;
        _newsNotifications.clear();
      }
      final newItems = await _thongBaoService.getMyThongBao(page: _pageNews);
      setState(() {
        _newsNotifications.addAll(newItems);
        _pageNews++;
        _hasMoreNews = newItems.length >= 10;
      });
    } catch (e) {
       debugPrint("Error fetching news: $e");
    } finally {
      if (mounted) setState(() => _isLoadingNews = false);
    }
  }

  // --- Actions ---

  Future<void> _markAsReadSys(NotificationModel item) async {
    if (item.isRead) return;
    await _notificationService.markAsRead(item.notificationId);
    setState(() {
      final index = _sysNotifications.indexOf(item);
      if (index != -1) {
        _sysNotifications[index] = NotificationModel(
          notificationId: item.notificationId,
          title: item.title,
          content: item.content,
          type: item.type,
          link: item.link,
          createdAt: item.createdAt,
          isRead: true,
        );
      }
    });
  }

  Future<void> _markAsReadNews(ThongBaoModel item) async {
    if (item.trangThai == 'DA_DOC') return;
    await _thongBaoService.markAsRead(item.id);
    // Optimistic update not fully supported for ThongBaoModel (final fields) without copyWith
    // Just refetch or ignore for UI simplicity
    _fetchNewsNotifications(); 
  }

  void _handleSysTap(NotificationModel item) {
    _markAsReadSys(item);
    
    // Deep linking
    final link = item.link;
    if (link != null && link.isNotEmpty) {
      if (link.contains('bang-luong') || link.contains('payroll')) {
        Navigator.push(context, MaterialPageRoute(builder: (_) => const PayrollScreen()));
      } else if (link.contains('chat')) {
        Navigator.pushNamed(context, '/chat');
      } else if (link.contains('nghi-phep') || link.contains('leave')) {
        Navigator.pushNamed(context, '/leave-requests');
      }
    }
  }

  void _showNewsDetail(ThongBaoModel item) {
    _markAsReadNews(item);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (context, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 50,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: _getNewsColor(item.loai).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _getNewsTypeLabel(item.loai),
                      style: TextStyle(
                        color: _getNewsColor(item.loai),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    item.tieuDe,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 16, color: Colors.grey[500]),
                      const SizedBox(width: 4),
                      Text(
                        _formatDate(item.ngayTao),
                        style: TextStyle(color: Colors.grey[500], fontSize: 13),
                      ),
                    ],
                  ),
                  const Divider(height: 32),
                  Text(
                    item.noiDung,
                    style: TextStyle(
                      fontSize: 16,
                      height: 1.6,
                      color: Colors.grey[800],
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.grey[50], // Light background
      appBar: AppBar(
        title: const Text('Trung tâm Thông báo', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.primaryColor,
          unselectedLabelColor: Colors.grey[600],
          indicatorColor: theme.primaryColor,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          tabs: const [
            Tab(text: 'Biến động'),
            Tab(text: 'Tin tức'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all),
            tooltip: 'Đọc tất cả',
            onPressed: () {
               // Determine current tab
               if (_tabController.index == 0) {
                 _notificationService.markAllAsRead().then((_) => _fetchSystemNotifications());
               } else {
                 _thongBaoService.markAllAsRead().then((_) => _fetchNewsNotifications());
               }
            },
          ),
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSystemList(),
          _buildNewsList(),
        ],
      ),
    );
  }

  Widget _buildSystemList() {
    if (_sysNotifications.isEmpty && !_isLoadingSys) {
      return _buildEmptyState('Không có thông báo nào', Icons.notifications_off_outlined);
    }
    return RefreshIndicator(
      onRefresh: () => _fetchSystemNotifications(),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: _sysNotifications.length + (_hasMoreSys ? 1 : 0),
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          if (index == _sysNotifications.length) return const Center(child: Padding(padding: EdgeInsets.all(8.0), child: CircularProgressIndicator()));
          
          final item = _sysNotifications[index];
          return Dismissible(
            key: Key('sys_${item.notificationId}'),
            background: Container(color: Colors.red, alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 20), child: const Icon(Icons.delete, color: Colors.white)),
            onDismissed: (_) {
               _notificationService.deleteNotification(item.notificationId);
               setState(() => _sysNotifications.removeAt(index));
            },
            child: _buildSystemCard(item),
          );
        },
      ),
    );
  }

  Widget _buildNewsList() {
    if (_newsNotifications.isEmpty && !_isLoadingNews) {
      return _buildEmptyState('Không có tin tức nào', Icons.article_outlined);
    }
    return RefreshIndicator(
      onRefresh: () => _fetchNewsNotifications(),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: _newsNotifications.length + (_hasMoreNews ? 1 : 0),
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          if (index == _newsNotifications.length) return const Center(child: Padding(padding: EdgeInsets.all(8.0), child: CircularProgressIndicator()));
          
          final item = _newsNotifications[index];
          return _buildNewsCard(item);
        },
      ),
    );
  }

  Widget _buildSystemCard(NotificationModel item) {
    final theme = Theme.of(context);
    final isRead = item.isRead;
    
    return Container(
      decoration: BoxDecoration(
        color: isRead ? Colors.white : Colors.blue.shade50,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: isRead ? Colors.transparent : Colors.blue.withOpacity(0.2)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _handleSysTap(item),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isRead ? Colors.grey[100] : Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _getSysIcon(item.type),
                    color: isRead ? Colors.grey : theme.primaryColor,
                    size: 24,
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
                              item.title,
                              style: TextStyle(
                                fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                fontSize: 16,
                                color: Colors.black87,
                              ),
                            ),
                          ),
                          Text(
                            _formatTime(item.createdAt),
                            style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.content,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: Colors.grey[600], height: 1.4),
                      ),
                    ],
                  ),
                ),
                if (!isRead)
                  Container(
                    margin: const EdgeInsets.only(left: 8, top: 5),
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNewsCard(ThongBaoModel item) {
    final color = _getNewsColor(item.loai);
    final isRead = item.trangThai == 'DA_DOC';

    return GestureDetector(
      onTap: () => _showNewsDetail(item),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
             BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          children: [
            Container(
              height: 6,
              decoration: BoxDecoration(
                color: color,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                       Container(
                         padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                         decoration: BoxDecoration(
                           color: color.withOpacity(0.1),
                           borderRadius: BorderRadius.circular(6),
                         ),
                         child: Text(
                           _getNewsTypeLabel(item.loai),
                           style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold),
                         ),
                       ),
                       const Spacer(),
                       if (!isRead)
                         Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(4)), child: const Text("MỚI", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold))),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    item.tieuDe,
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: isRead ? FontWeight.w500 : FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.noiDung,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.grey[600], height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.calendar_today_outlined, size: 14, color: Colors.grey[400]),
                      const SizedBox(width: 4),
                      Text(
                        _formatDate(item.ngayTao),
                        style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(String text, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(text, style: TextStyle(color: Colors.grey[500], fontSize: 16)),
        ],
      ),
    );
  }

  // --- Helpers ---

  IconData _getSysIcon(String type) {
    switch (type) {
      case 'PAYROLL': return Icons.attach_money;
      case 'task': 
      case 'TASK': return Icons.check_circle_outline;
      case 'LEAVE': return Icons.flight_takeoff;
      case 'CHAT': return Icons.chat_bubble_outline;
      default: return Icons.notifications_none;
    }
  }

  Color _getNewsColor(String type) {
    switch (type) {
      case 'KHEN_THUONG': return Colors.orange;
      case 'KY_LUAT': return Colors.red;
      case 'TUYEN_DUNG': return Colors.green;
      case 'LICH_NGHI': return Colors.purple;
      case 'CHINH_SACH': return Colors.blue;
      default: return Colors.teal;
    }
  }

  String _getNewsTypeLabel(String type) {
    switch (type) {
      case 'KHEN_THUONG': return 'Khen thưởng';
      case 'KY_LUAT': return 'Kỷ luật';
      case 'TUYEN_DUNG': return 'Tuyển dụng';
      case 'LICH_NGHI': return 'Lịch nghỉ';
      case 'CHINH_SACH': return 'Chính sách';
      case 'TIN_TUC': return 'Tin tức';
      default: return type;
    }
  }

  String _formatTime(String isoDate) {
    if (isoDate.isEmpty) return '';
    try {
      final date = DateTime.parse(isoDate);
      final now = DateTime.now();
      if (now.difference(date).inDays == 0) {
        return DateFormat('HH:mm').format(date);
      } else if (now.difference(date).inDays < 7) {
         return DateFormat('EEE').format(date); // Mon, Tue...
      } else {
        return DateFormat('dd/MM').format(date);
      }
    } catch (_) {
      return '';
    }
  }

  String _formatDate(String isoDate) {
    if (isoDate.isEmpty) return '';
    try {
      final date = DateTime.parse(isoDate);
      return DateFormat('dd/MM/yyyy HH:mm').format(date);
    } catch (_) {
      return '';
    }
  }
}

