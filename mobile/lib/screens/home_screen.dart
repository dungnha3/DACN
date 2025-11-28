import 'package:flutter/material.dart';
import 'package:mobile/data/services/auth_service.dart';

import 'package:mobile/screens/profile/profile_screen.dart';
import 'package:mobile/screens/chat/chat_list_screen.dart';
import 'package:mobile/screens/hr/attendance_screen.dart';
import 'package:mobile/screens/hr/payroll_screen.dart';
import 'package:mobile/screens/hr/leave_request_screen.dart';
import 'package:mobile/screens/projects/projects_screen.dart';
import 'package:mobile/screens/projects/my_tasks_screen.dart';
import 'package:mobile/screens/notifications/notifications_screen.dart';

import 'package:mobile/data/services/notification_service.dart';
import 'package:mobile/config/app_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final AuthService _authService = AuthService();
  final NotificationService _notificationService = NotificationService();
  

  int _selectedIndex = 0;
  int _unreadNotifications = 0;

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
    _fetchUnreadCount();
  }

  Future<void> _loadUserInfo() async {
    await _authService.getToken(); // Just checking auth
  }

  Future<void> _fetchUnreadCount() async {
    try {
      final data = await _notificationService.getUnreadCount();
      if (data != null && data['unreadCount'] != null) {
        setState(() {
          _unreadNotifications = data['unreadCount'];
        });
      }
    } catch (e) {

    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    if (index == 1) {
       Navigator.pushNamed(context, AppRouter.myTasks);
    } else if (index == 2) {
      Navigator.pushNamed(context, AppRouter.chatList);
    } else if (index == 3) {
      Navigator.pushNamed(context, AppRouter.profile);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Xin chào,', style: TextStyle(fontSize: 14, color: Colors.white70)),
            Text('Nhân viên', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.blue.shade800,
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () async {
                  await Navigator.pushNamed(context, AppRouter.notifications);
                  _fetchUnreadCount(); // Refresh count on return
                },
              ),
              if (_unreadNotifications > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '$_unreadNotifications',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quick Stats / Summary Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue.shade700, Colors.blue.shade500],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.blue.withValues(alpha: 0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Công việc hôm nay', style: TextStyle(color: Colors.white70)),
                      SizedBox(height: 5),
                      Text('3 Task', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Check-in', style: TextStyle(color: Colors.white70)),
                      SizedBox(height: 5),
                      Text('08:30', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 25),
            const Text('Chức năng chính', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),

            // Grid Menu
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 15,
              mainAxisSpacing: 15,
              children: [
                _buildMenuCard(
                  icon: Icons.fingerprint,
                  title: 'Chấm công GPS',
                  color: Colors.orange,
                  onTap: () => Navigator.pushNamed(context, AppRouter.attendance),
                ),
                _buildMenuCard(
                  icon: Icons.monetization_on,
                  title: 'Bảng lương',
                  color: Colors.green,
                  onTap: () {
                    Navigator.pushNamed(context, AppRouter.payroll);
                  },
                ),
                _buildMenuCard(
                  icon: Icons.calendar_today,
                  title: 'Nghỉ phép',
                  color: Colors.purple,
                  onTap: () {
                    Navigator.pushNamed(context, AppRouter.leaveRequest);
                  },
                ),
                _buildMenuCard(
                  icon: Icons.task_alt,
                  title: 'Công việc',
                  color: Colors.blue,
                  onTap: () {
                    Navigator.pushNamed(context, AppRouter.myTasks);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue.shade800,
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.folder), label: 'Dự án'),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Cá nhân'),
        ],
      ),
    );
  }

  Widget _buildMenuCard({required IconData icon, required String title, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 30, color: color),
            ),
            const SizedBox(height: 15),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
