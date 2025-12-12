import 'package:flutter/material.dart';
import '../../data/services/storage_service.dart';
import '../../widgets/file_list_widget.dart';

class MyFilesScreen extends StatefulWidget {
  const MyFilesScreen({super.key});

  @override
  State<MyFilesScreen> createState() => _MyFilesScreenState();
}

class _MyFilesScreenState extends State<MyFilesScreen> {
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
      final files = await _storageService.getMyFiles();
      setState(() {
        _files = files;
      });
    } catch (e) {
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(
           SnackBar(
             content: Row(
               children: [
                 Icon(Icons.error_outline, color: Colors.white),
                 const SizedBox(width: 10),
                 Expanded(child: Text('Lỗi tải tài liệu')),
               ],
             ),
             backgroundColor: Colors.red.shade600,
             behavior: SnackBarBehavior.floating,
             shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
             margin: const EdgeInsets.all(16),
           ),
         );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tài liệu của tôi'),
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
