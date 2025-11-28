import 'package:flutter/material.dart';
import '../../data/models/user.dart';
import '../../data/services/user_service.dart';
import '../../data/services/auth_service.dart';

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
  final _formKey = GlobalKey<FormState>();
  
  User? _user;
  bool _isLoading = true;
  bool _isEditing = false;

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
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    final user = await _userService.getProfile();
    if (user != null) {
      setState(() {
        _user = user;
        _fullNameController.text = user.fullName ?? '';
        _emailController.text = user.email;
        _phoneController.text = user.phoneNumber ?? '';
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Không thể tải thông tin cá nhân')),
        );
      }
    }
  }

  Future<void> _updateProfile() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      final success = await _userService.updateProfile(
        _fullNameController.text,
        _emailController.text,
        _phoneController.text,
      );
      
      if (success) {
        await _loadProfile();
        setState(() => _isEditing = false);
        if (!context.mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cập nhật thành công')),
        );
      } else {
        setState(() => _isLoading = false);
        if (!context.mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cập nhật thất bại')),
        );
      }
    }
  }

  Future<void> _logout() async {
    await _authService.logout();
    if (!context.mounted) return;
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
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Hồ sơ cá nhân'),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
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
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // ID Card Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [theme.colorScheme.secondary, theme.primaryColor],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: theme.primaryColor.withOpacity(0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          border: Border.all(color: Colors.white, width: 4),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 10,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            _user!.username.isNotEmpty ? _user!.username[0].toUpperCase() : '?',
                            style: TextStyle(fontSize: 40, color: theme.primaryColor, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      if (_isEditing)
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.camera_alt, color: theme.primaryColor, size: 20),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _user!.fullName ?? _user!.username,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _user!.role ?? 'Nhân viên',
                    style: const TextStyle(color: Colors.white70, fontSize: 14, letterSpacing: 1),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'ID: ${_user!.userId}',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),

            // Form Section
            Card(
              elevation: 2,
              shadowColor: Colors.black12,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Thông tin chi tiết', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),
                      _buildTextField('Họ và tên', _fullNameController, Icons.person, theme),
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
                elevation: 2,
                shadowColor: Colors.black12,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    ListTile(
                      leading: Icon(Icons.lock_outline, color: theme.primaryColor),
                      title: const Text('Đổi mật khẩu'),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          AppRouter.changePassword,
                        );
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: Icon(Icons.logout, color: theme.colorScheme.error),
                      title: Text('Đăng xuất', style: TextStyle(color: theme.colorScheme.error)),
                      onTap: _logout,
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, ThemeData theme) {
    return TextFormField(
      controller: controller,
      enabled: _isEditing,
      style: TextStyle(color: _isEditing ? Colors.black87 : Colors.grey.shade700),
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: _isEditing ? theme.primaryColor : Colors.grey),
        filled: true,
        fillColor: _isEditing ? Colors.white : Colors.grey.shade50,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: _isEditing ? BorderSide(color: theme.primaryColor) : BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: theme.primaryColor, width: 2),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
      validator: (v) => v!.isEmpty ? 'Vui lòng nhập thông tin' : null,
    );
  }
}
