import 'package:flutter/material.dart';
import '../../data/services/project_service.dart';
import '../../data/models/issue.dart';

class IssueDetailScreen extends StatefulWidget {
  final int taskId;

  const IssueDetailScreen({super.key, required this.taskId});

  @override
  State<IssueDetailScreen> createState() => _IssueDetailScreenState();
}

class _IssueDetailScreenState extends State<IssueDetailScreen> {
  final ProjectService _projectService = ProjectService();
  
  bool _isLoading = true;
  Issue? _task;
  final _commentController = TextEditingController();
  bool _isSendingComment = false;

  @override
  void initState() {
    super.initState();
    _fetchTaskDetail();
  }

  Future<void> _fetchTaskDetail() async {
    setState(() => _isLoading = true);
    try {
      final data = await _projectService.getTaskDetail(widget.taskId);
      setState(() {
        _task = data;
      });
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lỗi tải chi tiết công việc')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _updateStatus(String newStatus) async {
    try {
      await _projectService.updateTaskStatus(widget.taskId, newStatus);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cập nhật trạng thái thành công')),
      );
      _fetchTaskDetail(); // Refresh to show updated status/logs
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lỗi cập nhật trạng thái')),
        );
      }
    }
  }

  Future<void> _addComment() async {
    if (_commentController.text.trim().isEmpty) return;

    setState(() => _isSendingComment = true);
    try {
      await _projectService.addComment(widget.taskId, _commentController.text);
      _commentController.clear();
      _fetchTaskDetail(); // Refresh to show new comment
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lỗi gửi bình luận')),
        );
      }
    } finally {
      setState(() => _isSendingComment = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (_isLoading) return Scaffold(backgroundColor: theme.scaffoldBackgroundColor, body: Center(child: CircularProgressIndicator(color: theme.primaryColor)));
    if (_task == null) return Scaffold(backgroundColor: theme.scaffoldBackgroundColor, body: const Center(child: Text('Không tìm thấy công việc')));

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Chi tiết công việc'),
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Card(
              elevation: 2,
              shadowColor: Colors.black12,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _task!.title,
                      style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _buildStatusChip(_task!.issueStatus, theme),
                        const SizedBox(width: 10),
                        _buildPriorityChip(_task!.priority, theme),
                      ],
                    ),
                    const Divider(height: 30),
                    Text(
                      _task!.description.isNotEmpty ? _task!.description : 'Không có mô tả',
                      style: TextStyle(color: Colors.grey[800], height: 1.6, fontSize: 15),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Icon(Icons.person_outline, size: 18, color: Colors.grey[600]),
                        const SizedBox(width: 8),
                        Text('Người giao: ${_task!.reporterName ?? "N/A"}', style: TextStyle(color: Colors.grey[600])),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Row(
                      children: [
                        Icon(Icons.calendar_today, size: 18, color: Colors.grey[600]),
                        const SizedBox(width: 8),
                        Text('Hạn chót: ${_task!.dueDate ?? "N/A"}', style: TextStyle(color: Colors.grey[600])),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 25),

            // Status Action
            Text('Cập nhật trạng thái', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildStatusButton('TODO', Colors.grey, theme)),
                const SizedBox(width: 10),
                Expanded(child: _buildStatusButton('IN_PROGRESS', theme.colorScheme.secondary, theme)),
                const SizedBox(width: 10),
                Expanded(child: _buildStatusButton('DONE', theme.colorScheme.primary, theme)),
              ],
            ),

            const SizedBox(height: 30),

            // Attachments (Placeholder)
            Text('Tài liệu đính kèm', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Container(
              height: 80,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(12),
                color: Colors.grey.shade50,
              ),
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.attach_file, color: Colors.grey.shade400),
                    const SizedBox(width: 8),
                    Text('Chưa có tài liệu nào', style: TextStyle(color: Colors.grey.shade500)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 30),

            // Comments Section
            Text('Bình luận & Hoạt động', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Card(
              elevation: 2,
              shadowColor: Colors.black12,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Comment Input
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _commentController,
                            decoration: InputDecoration(
                              hintText: 'Viết bình luận...',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(25), borderSide: BorderSide.none),
                              filled: true,
                              fillColor: Colors.grey[100],
                              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        CircleAvatar(
                          backgroundColor: theme.primaryColor,
                          child: IconButton(
                            icon: _isSendingComment 
                                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Icon(Icons.send, color: Colors.white, size: 20),
                            onPressed: _isSendingComment ? null : _addComment,
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 30),
                    
                    // Comments List
                    if (_task!.comments.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 20),
                        child: Text('Chưa có bình luận nào', style: TextStyle(color: Colors.grey)),
                      )
                    else
                      ..._task!.comments.map((comment) => _buildCommentItem(comment, theme)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusButton(String status, Color color, ThemeData theme) {
    bool isSelected = _task!.issueStatus == status;
    // Map status codes if needed, assuming backend uses strings
    String label = status;
    if (status == 'IN_PROGRESS') label = 'IN PROG';
    
    return ElevatedButton(
      onPressed: isSelected ? null : () => _updateStatus(status),
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? color : Colors.white,
        foregroundColor: isSelected ? Colors.white : color,
        side: BorderSide(color: color),
        elevation: isSelected ? 2 : 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
      child: Text(
        label,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildStatusChip(String status, ThemeData theme) {
    Color color = Colors.grey;
    if (status == 'IN_PROGRESS') color = theme.colorScheme.secondary;
    if (status == 'DONE') color = theme.colorScheme.primary;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        status,
        style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildPriorityChip(String priority, ThemeData theme) {
    Color color = theme.colorScheme.primary;
    if (priority == 'HIGH') color = theme.colorScheme.error;
    if (priority == 'MEDIUM') color = Colors.orange;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        priority,
        style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildCommentItem(Comment comment, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: theme.primaryColor.withOpacity(0.1),
            child: Text(comment.authorName.isNotEmpty ? comment.authorName[0].toUpperCase() : 'U', 
              style: TextStyle(fontSize: 14, color: theme.primaryColor, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      comment.authorName,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    Text(
                      comment.createdAt,
                      style: TextStyle(color: Colors.grey[500], fontSize: 11),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(comment.content, style: const TextStyle(fontSize: 14, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
