import 'package:flutter/material.dart';
import 'package:mobile/data/services/auth_service.dart';
import 'package:mobile/data/services/user_service.dart';
import 'package:mobile/data/services/project_service.dart';
import 'package:mobile/data/services/notification_service.dart';
import 'package:mobile/data/models/user.dart';
import 'package:mobile/data/models/issue.dart';
import 'package:mobile/config/app_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with WidgetsBindingObserver {
  final AuthService _authService = AuthService();
  final UserService _userService = UserService();
  final ProjectService _projectService = ProjectService();
  final NotificationService _notificationService = NotificationService();
  
  int _selectedIndex = 0;
  int _unreadNotifications = 0;
  User? _user;
  int _taskCount = 0;
  List<Issue> _recentTasks = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadData();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _fetchUnreadCount();
      _fetchTasks();
    }
  }

  Future<void> _loadData() async {
    await Future.wait([
      _loadUserInfo(),
      _fetchUnreadCount(),
      _fetchTasks(),
    ]);
  }

  Future<void> _loadUserInfo() async {
    final user = await _userService.getProfile();
    if (mounted) {
      setState(() {
        _user = user;
      });
    }
  }

  Future<void> _fetchUnreadCount() async {
    try {
      final count = await _notificationService.getUnreadCount();
      if (mounted) {
        setState(() {
          _unreadNotifications = count;
        });
      }
    } catch (e) {
      // ignore
    }
  }

  Future<void> _fetchTasks() async {
    try {
      final tasks = await _projectService.getMyTasks();
      if (mounted) {
        setState(() {
          // Filter out Done / Completed tasks
          final activeTasks = tasks.where((t) {
            final s = t.statusName.toLowerCase();
            return !s.contains('done') && !s.contains('complete') && !s.contains('finish');
          }).toList();
          
          _taskCount = activeTasks.length;
          _recentTasks = activeTasks.take(3).toList();
        });
      }
    } catch (e) {
      // ignore
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    if (index == 1) {
       Navigator.pushNamed(context, AppRouter.projectList);
    } else if (index == 2) {
      Navigator.pushNamed(context, AppRouter.chatList);
    } else if (index == 3) {
      Navigator.pushNamed(context, AppRouter.profile);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final displayName = _user?.fullName ?? _user?.username ?? 'Nhân viên';
    final role = _user?.role ?? 'EMPLOYEE';
    
    String roleDisplay = 'Nhân viên';
    if (role == 'MANAGER_HR') roleDisplay = 'Quản lý HR';
    else if (role == 'MANAGER_PROJECT') roleDisplay = 'Quản lý dự án';
    else if (role == 'MANAGER_ACCOUNTING') roleDisplay = 'Kế toán';
    else if (role == 'ADMIN') roleDisplay = 'Admin';

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        elevation: 0,
        automaticallyImplyLeading: false,
        backgroundColor: theme.primaryColor,
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.2),
              ),
              child: _user?.avatarUrl != null
                  ? ClipOval(
                      child: Image.network(
                        _user!.avatarUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(Icons.person, color: Colors.white),
                      ),
                    )
                  : const Icon(Icons.person, color: Colors.white),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Xin chào,', style: theme.textTheme.bodySmall?.copyWith(color: Colors.white70)),
                Text(displayName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () async {
                  await Navigator.pushNamed(context, AppRouter.notifications);
                  _fetchUnreadCount();
                },
              ),
              if (_unreadNotifications > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.error,
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
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Quick Stats / Summary Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [theme.primaryColor, theme.colorScheme.secondary],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: theme.primaryColor.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Công việc đang có', style: TextStyle(color: Colors.white70)),
                        const SizedBox(height: 5),
                        Text('$_taskCount Task', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('Vai trò', style: TextStyle(color: Colors.white70)),
                        const SizedBox(height: 5),
                        Text(roleDisplay, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 25),
              Text('Chức năng chính', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
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
                    context,
                    icon: Icons.fingerprint,
                    title: 'Chấm công GPS',
                    color: Colors.orange,
                    onTap: () => Navigator.pushNamed(context, AppRouter.attendance),
                  ),
                  _buildMenuCard(
                    context,
                    icon: Icons.monetization_on,
                    title: 'Bảng lương',
                    color: Colors.green,
                    onTap: () => Navigator.pushNamed(context, AppRouter.payroll),
                  ),
                  _buildMenuCard(
                    context,
                    icon: Icons.calendar_today,
                    title: 'Nghỉ phép',
                    color: Colors.purple,
                    onTap: () => Navigator.pushNamed(context, AppRouter.leaveRequest),
                  ),
                  _buildMenuCard(
                    context,
                    icon: Icons.task_alt,
                    title: 'Công việc',
                    color: theme.primaryColor,
                    onTap: () => Navigator.pushNamed(context, AppRouter.myTasks),
                  ),
                  _buildMenuCard(
                    context,
                    icon: Icons.folder_shared,
                    title: 'Tài liệu',
                    color: Colors.teal,
                    onTap: () => Navigator.pushNamed(context, AppRouter.myFiles),
                  ),
                ],
              ),

              const SizedBox(height: 25),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Công việc cần làm', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, AppRouter.myTasks), 
                    child: const Text('Xem tất cả')
                  ),
                ],
              ),
              const SizedBox(height: 10),
              
              // Recent Tasks List
              if (_recentTasks.isEmpty)
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(Icons.check_circle_outline, size: 40, color: Colors.grey.shade400),
                        const SizedBox(height: 10),
                        const Text('Tuyệt vời! Bạn không có việc tồn đọng.', style: TextStyle(color: Colors.grey)),
                      ],
                    ),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _recentTasks.length,
                  itemBuilder: (context, index) => _buildTaskCard(context, _recentTasks[index]),
                ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: theme.primaryColor,
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

  Widget _buildTaskCard(BuildContext context, Issue task) {
    // Determine color based on priority
    Color priorityColor = Colors.green;
    if (task.priority == 'HIGH' || task.priority == 'CRITICAL') priorityColor = Colors.red;
    else if (task.priority == 'MEDIUM') priorityColor = Colors.orange;

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(
          context,
          AppRouter.issueDetail,
          arguments: {'issueId': task.issueId},
        );
      },
      onLongPress: () {
        if (task.projectId != null) {
           Navigator.pushNamed(
             context, 
             AppRouter.sprintBoard,
             arguments: {
               'projectId': task.projectId,
               'projectName': task.projectName ?? 'Project'
             }
           );
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.05),
              spreadRadius: 2,
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    task.title,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: priorityColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    task.priority,
                    style: TextStyle(color: priorityColor, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.work_outline, size: 14, color: Colors.grey[500]),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    task.projectName ?? 'No Project',
                    style: TextStyle(color: Colors.grey[600], fontSize: 13),
                    maxLines: 1, 
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (task.dueDate != null) ...[
                  const SizedBox(width: 10),
                  Icon(Icons.calendar_today, size: 14, color: Colors.red[300]),
                  const SizedBox(width: 4),
                  Text(
                     task.dueDate!,
                     style: TextStyle(color: Colors.red[300], fontSize: 12),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                     color: Colors.blue.withOpacity(0.05),
                     borderRadius: BorderRadius.circular(6),
                     border: Border.all(color: Colors.blue.withOpacity(0.2)),
                  ),
                  child: Text(
                    task.statusName,
                    style: const TextStyle(color: Colors.blue, fontSize: 12, fontWeight: FontWeight.w500),
                  ),
                ),
                if (task.assigneeName != null)
                   CircleAvatar(
                      radius: 12,
                      backgroundColor: Colors.grey[200],
                      backgroundImage: task.assigneeAvatarUrl != null ? NetworkImage(task.assigneeAvatarUrl!) : null,
                      child: task.assigneeAvatarUrl == null 
                        ? Text(task.assigneeName![0].toUpperCase(), style: const TextStyle(fontSize: 10)) 
                        : null,
                   ),
              ],
            ),
          ],
        ),
      ),
    );
  }


  Widget _buildMenuCard(BuildContext context, {required IconData icon, required String title, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
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
                color: color.withOpacity(0.1),
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
