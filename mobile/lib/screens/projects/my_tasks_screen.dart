import 'package:flutter/material.dart';
import '../../data/services/project_service.dart';
import '../../data/services/auth_service.dart';
import 'issue_detail_screen.dart';
import '../../widgets/common_widgets.dart';
import '../../config/app_router.dart';

class MyTasksScreen extends StatefulWidget {
  const MyTasksScreen({super.key});

  @override
  State<MyTasksScreen> createState() => _MyTasksScreenState();
}

class _MyTasksScreenState extends State<MyTasksScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ProjectService _projectService = ProjectService();
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  List<dynamic> _allTasks = [];
  List<dynamic> _todoTasks = [];
  List<dynamic> _inProgressTasks = [];
  List<dynamic> _doneTasks = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchTasks();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchTasks() async {
    setState(() => _isLoading = true);
    try {
      final userIdStr = await _authService.getUserId();
      if (userIdStr != null) {
        final userId = int.parse(userIdStr);
        final data = await _projectService.getMyTasks(userId);
        
        setState(() {
          _allTasks = data ?? [];
          _filterTasks();
        });
      }
    } catch (e) {

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lỗi tải danh sách công việc')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _filterTasks() {
    _todoTasks = _allTasks.where((t) => t['status'] == 'TODO' || t['status'] == 'OPEN').toList();
    _inProgressTasks = _allTasks.where((t) => t['status'] == 'IN_PROGRESS').toList();
    _doneTasks = _allTasks.where((t) => t['status'] == 'DONE' || t['status'] == 'CLOSED').toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Công việc của tôi'),
        centerTitle: true,
        backgroundColor: Colors.blue.shade800,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: [
            Tab(text: 'Cần làm (${_todoTasks.length})'),
            Tab(text: 'Đang làm (${_inProgressTasks.length})'),
            Tab(text: 'Hoàn thành (${_doneTasks.length})'),
          ],
        ),
      ),
      body: _isLoading
          ? const LoadingIndicator()
          : TabBarView(
              controller: _tabController,
              children: [
                _buildTaskList(_todoTasks),
                _buildTaskList(_inProgressTasks),
                _buildTaskList(_doneTasks),
              ],
            ),
    );
  }

  Widget _buildTaskList(List<dynamic> tasks) {
    if (tasks.isEmpty) {
      return const EmptyState(message: 'Không có công việc nào', icon: Icons.assignment_turned_in_outlined);
    }

    return RefreshIndicator(
      onRefresh: _fetchTasks,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: tasks.length,
        itemBuilder: (context, index) {
          final task = tasks[index];
          return _buildTaskCard(task);
        },
      ),
    );
  }

  Widget _buildTaskCard(Map<String, dynamic> task) {
    Color priorityColor = Colors.green;
    String priority = task['priority'] ?? 'MEDIUM';
    
    if (priority == 'HIGH' || priority == 'URGENT') {
      priorityColor = Colors.red;
    } else if (priority == 'LOW') {
      priorityColor = Colors.blue;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () async {
          final result = await Navigator.pushNamed(
            context,
            AppRouter.issueDetail,
            arguments: {'issueId': task['id']},
          );
          if (result == true) {
            _fetchTasks(); // Refresh if status changed
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      task['title'] ?? 'Tiêu đề công việc',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: priorityColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: priorityColor.withValues(alpha: 0.5)),
                    ),
                    child: Text(
                      priority,
                      style: TextStyle(color: priorityColor, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.folder_outlined, size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    task['projectName'] ?? 'Dự án',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                  const Spacer(),
                  Icon(Icons.calendar_today, size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    task['dueDate'] ?? 'N/A',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
