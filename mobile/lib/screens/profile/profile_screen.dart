import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import '../../data/models/user.dart';
import '../../data/models/issue.dart';
import '../../data/services/user_service.dart';
import '../../data/services/auth_service.dart';
import '../../data/services/storage_service.dart';
import '../../data/services/project_service.dart';

import '../../widgets/common_widgets.dart';
import '../../config/app_router.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _userService = UserService();
  final _authService = AuthService();
  final _storageService = StorageService();
  final _projectService = ProjectService();
  final _formKey = GlobalKey<FormState>();
  
  User? _user;
  bool _isLoading = true;
  bool _isEditing = false;
  
  // Stats
  int _todoCount = 0;
  int _inProgressCount = 0;
  int _doneCount = 0;
  bool _isLoadingStats = true;

  late TextEditingController _fullNameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;

  @override
  void initState() {
    super.initState();
    _fullNameController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _loadProfile();
    _loadStats();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    final user = await _userService.getProfile();
    if (user != null) {
      if (mounted) {
        setState(() {
          _user = user;
          _fullNameController.text = user.fullName ?? '';
          _emailController.text = user.email;
          _phoneController.text = user.phoneNumber ?? '';
          _isLoading = false;
        });
      }
    } else {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Không thể tải thông tin cá nhân')),
        );
      }
    }
  }

  Future<void> _loadStats() async {
    try {
      final tasks = await _projectService.getMyTasks();
      if (mounted) {
        setState(() {
          _todoCount = tasks.where((t) => t.statusName.toUpperCase().contains('TO DO')).length;
          _inProgressCount = tasks.where((t) => 
            t.statusName.toUpperCase().contains('PROGRESS') || 
            t.statusName.toUpperCase().contains('REVIEW')
          ).length;
          _doneCount = tasks.where((t) => t.statusName.toUpperCase().contains('DONE')).length;
          _isLoadingStats = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoadingStats = false);
    }
  }

  Future<void> _pickAndUploadAvatar() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.image,
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        setState(() => _isLoading = true);
        
        // 1. Upload file
        final avatarUrl = await _storageService.uploadFile(result.files.first);
        
        if (avatarUrl != null) {
          // 2. Update Profile with new Avatar URL
          // Note: Backend might need full update, so we fetch current values
          final success = await _userService.updateProfile(
            avatarUrl: avatarUrl,
          );

          if (success) {
            await _loadProfile(); // Reload to show new avatar
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cập nhật ảnh đại diện thành công')),
              );
            }
          } else {
             throw Exception('Failed to update profile with new avatar');
          }
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi tải ảnh: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _updateProfile() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      final success = await _userService.updateProfile(
        email: _emailController.text,
        phoneNumber: _phoneController.text,
      );
      
      if (success) {
        await _loadProfile();
        if (mounted) {
          setState(() => _isEditing = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.white),
                  const SizedBox(width: 10),
                  Expanded(child: Text('✅ Cập nhật thông tin thành công')),
                ],
              ),
              backgroundColor: Colors.green.shade600,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              margin: const EdgeInsets.all(16),
            ),
          );
        }
      } else {
        if (mounted) {
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  Icon(Icons.error_outline, color: Colors.white),
                  const SizedBox(width: 10),
                  Expanded(child: Text('Cập nhật thất bại')),
                ],
              ),
              backgroundColor: Colors.red.shade600,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              margin: const EdgeInsets.all(16),
            ),
          );
        }
      }
    }
  }

  Future<void> _logout() async {
    await _authService.logout();
    if (!mounted) return;
    Navigator.of(context).pushNamedAndRemoveUntil(
      AppRouter.login,
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (_isLoading) return Scaffold(backgroundColor: theme.scaffoldBackgroundColor, body: Center(child: CircularProgressIndicator(color: theme.primaryColor)));
    if (_user == null) return Scaffold(backgroundColor: theme.scaffoldBackgroundColor, body: const Center(child: Text('Lỗi tải dữ liệu')));

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      extendBodyBehindAppBar: true, 
      appBar: AppBar(
        title: const Text('Hồ sơ cá nhân', style: TextStyle(fontWeight: FontWeight.w600)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.save : Icons.edit),
            onPressed: () {
              if (_isEditing) {
                _updateProfile();
              } else {
                setState(() => _isEditing = true);
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.zero,
        child: Column(
          children: [
            // Glassmorphism Header
            _buildHeader(theme),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  // Stats Section
                  _buildStatsSection(theme),
                  
                  const SizedBox(height: 20),

                  // Form Section
                  Card(
                    elevation: 0,
                    color: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Thông tin chi tiết', 
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Colors.blueGrey[800],
                              )
                            ),
                            const SizedBox(height: 20),
                            _buildTextField('Họ và tên', _fullNameController, Icons.person, theme, readOnly: true), // Often name is not editable by user
                            const SizedBox(height: 15),
                            _buildTextField('Email', _emailController, Icons.email, theme),
                            const SizedBox(height: 15),
                            _buildTextField('Số điện thoại', _phoneController, Icons.phone, theme),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Actions Section
                  if (!_isEditing) ...[
                    Card(
                      elevation: 0,
                      color: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Column(
                        children: [
                          ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: Colors.blue[50], shape: BoxShape.circle),
                              child: const Icon(Icons.lock_outline, color: Colors.blue, size: 20),
                            ),
                            title: const Text('Đổi mật khẩu', style: TextStyle(fontWeight: FontWeight.w500)),
                            trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                            onTap: () {
                              Navigator.pushNamed(context, AppRouter.changePassword);
                            },
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: const Divider(height: 1),
                          ),
                          ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: Colors.red[50], shape: BoxShape.circle),
                              child: const Icon(Icons.logout, color: Colors.red, size: 20),
                            ),
                            title: const Text('Đăng xuất', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w500)),
                            onTap: _logout,
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [theme.primaryColor, theme.primaryColor.withOpacity(0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
             color: theme.primaryColor.withOpacity(0.3),
             blurRadius: 20,
             offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(20, 100, 20, 30),
      child: Column(
        children: [
          Stack(
            children: [
              Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  border: Border.all(color: Colors.white.withOpacity(0.5), width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(55),
                  child: _user!.avatarUrl != null 
                    ? Image.network(
                        _user!.avatarUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => _buildPlaceholderAvatar(theme),
                      )
                    : _buildPlaceholderAvatar(theme),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: GestureDetector(
                  onTap: _pickAndUploadAvatar,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4),
                      ],
                    ),
                    child: Icon(Icons.camera_alt, color: theme.primaryColor, size: 20),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            _user!.fullName ?? _user!.username,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              _user!.role ?? 'Nhân viên',
              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholderAvatar(ThemeData theme) {
    return Center(
      child: Text(
        _user!.username.isNotEmpty ? _user!.username[0].toUpperCase() : '?',
        style: TextStyle(fontSize: 40, color: theme.primaryColor, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildStatsSection(ThemeData theme) {
    if (_isLoadingStats) {
      return const SizedBox(
        height: 100, 
        child: Center(child: CircularProgressIndicator())
      );
    }
    
    return Row(
      children: [
        _buildStatCard('Cần làm', _todoCount, Colors.orange, theme),
        const SizedBox(width: 12),
        _buildStatCard('Đang làm', _inProgressCount, Colors.blue, theme),
        const SizedBox(width: 12),
        _buildStatCard('Đã xong', _doneCount, Colors.green, theme),
      ],
    );
  }

  Widget _buildStatCard(String title, int count, Color color, ThemeData theme) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Text(
                count.toString(),
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, ThemeData theme, {bool readOnly = false}) {
    return TextFormField(
      controller: controller,
      enabled: _isEditing && !readOnly,
      readOnly: readOnly,
      style: TextStyle(color: Colors.black87, fontWeight: FontWeight.w500),
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: (_isEditing && !readOnly) ? theme.primaryColor : Colors.grey),
        filled: true,
        fillColor: (_isEditing && !readOnly) ? Colors.blue.withOpacity(0.05) : Colors.grey[50],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: theme.primaryColor, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      validator: (v) => v!.isEmpty ? 'Vui lòng nhập thông tin' : null,
    );
  }
}
