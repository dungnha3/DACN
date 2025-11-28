import 'package:flutter/material.dart';
import '../../data/services/project_service.dart';
import '../../data/services/auth_service.dart';
import '../../data/models/issue.dart';
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
  List<Issue> _allTasks = [];
  List<Issue> _todoTasks = [];
  List<Issue> _inProgressTasks = [];
  List<Issue> _doneTasks = [];

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
          _allTasks = data;
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
    _todoTasks = _allTasks.where((t) => t.issueStatus == 'TODO' || t.issueStatus == 'OPEN' || t.issueStatus == 'NEW').toList();
    _inProgressTasks = _allTasks.where((t) => t.issueStatus == 'IN_PROGRESS').toList();
    _doneTasks = _allTasks.where((t) => t.issueStatus == 'DONE' || t.issueStatus == 'CLOSED' || t.issueStatus == 'RESOLVED').toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Công việc của tôi'),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          tabs: [
            Tab(text: 'Cần làm (${_todoTasks.length})'),
            Tab(text: 'Đang làm (${_inProgressTasks.length})'),
            Tab(text: 'Hoàn thành (${_doneTasks.length})'),
          ],
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: theme.primaryColor))
          : TabBarView(
              controller: _tabController,
              children: [
                _buildTaskList(_todoTasks, Colors.orange, theme),
                _buildTaskList(_inProgressTasks, theme.primaryColor, theme),
                _buildTaskList(_doneTasks, Colors.green, theme),
              ],
            ),
    );
  }

  Widget _buildTaskList(List<Issue> tasks, Color accentColor, ThemeData theme) {
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
          return _buildTaskCard(task, accentColor, theme);
        },
      ),
    );
  }

  Widget _buildTaskCard(Issue task, Color accentColor, ThemeData theme) {
    Color priorityColor = Colors.green;
    String priority = task.priority;
    
    if (priority == 'HIGH' || priority == 'URGENT') {
      priorityColor = theme.colorScheme.error;
    } else if (priority == 'MEDIUM') {
      priorityColor = Colors.orange;
    } else if (priority == 'LOW') {
      priorityColor = Colors.blue;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shadowColor: Colors.black12,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () async {
          final result = await Navigator.pushNamed(
            context,
            AppRouter.issueDetail,
            arguments: {'issueId': task.issueId},
          );
          if (result == true) {
            _fetchTasks(); // Refresh if status changed
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            border: Border(left: BorderSide(color: accentColor, width: 4)),
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      task.title,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: priorityColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: priorityColor.withOpacity(0.3)),
                    ),
                    child: Text(
                      priority,
                      style: TextStyle(color: priorityColor, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      task.issueKey,
                      style: TextStyle(color: Colors.grey.shade700, fontSize: 11, fontWeight: FontWeight.w500),
                    ),
                  ),
                  const Spacer(),
                  if (task.dueDate != null) ...[
                    Icon(Icons.calendar_today, size: 14, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Text(
                      task.dueDate!,
                      style: TextStyle(color: Colors.grey[600], fontSize: 12),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
