import 'package:flutter/material.dart';
import '../../data/services/storage_service.dart';
import '../../widgets/file_list_widget.dart';

class ProjectFilesScreen extends StatefulWidget {
  final int projectId;
  final String projectName;

  const ProjectFilesScreen({super.key, required this.projectId, required this.projectName});

  @override
  State<ProjectFilesScreen> createState() => _ProjectFilesScreenState();
}

class _ProjectFilesScreenState extends State<ProjectFilesScreen> {
  final StorageService _storageService = StorageService();
  bool _isLoading = true;
  List<Map<String, dynamic>> _files = [];

  @override
  void initState() {
    super.initState();
    _fetchFiles();
  }

  Future<void> _fetchFiles() async {
    setState(() => _isLoading = true);
    try {
      final files = await _storageService.getProjectFiles(widget.projectId);
      setState(() {
        _files = files;
      });
    } catch (e) {
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lỗi tải tài liệu dự án')));
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tài liệu: ${widget.projectName}'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      backgroundColor: const Color(0xFFF5F7FA),
      body: FileListWidget(
        files: _files,
        isLoading: _isLoading,
        onRefresh: _fetchFiles,
      ),
    );
  }
}
