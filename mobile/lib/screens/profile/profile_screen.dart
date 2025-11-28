import 'package:flutter/material.dart';
import '../../data/models/user.dart';
import '../../data/services/user_service.dart';
import '../../data/services/auth_service.dart';
import '../auth/login_screen.dart';
import 'change_password_screen.dart';
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
    if (_isLoading) return const Scaffold(body: LoadingIndicator());
    if (_user == null) return const Scaffold(body: Center(child: Text('Lỗi tải dữ liệu')));

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Hồ sơ cá nhân'),
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
            // Avatar Section
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.blue.shade100,
                      border: Border.all(color: Colors.white, width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        _user!.username.isNotEmpty ? _user!.username[0].toUpperCase() : '?',
                        style: TextStyle(fontSize: 50, color: Colors.blue.shade800, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 15),
            Text(
              _user!.fullName ?? _user!.username,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            Text(
              _user!.email,
              style: const TextStyle(color: Colors.grey),
            ),
            
            const SizedBox(height: 30),

            // Form Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Thông tin chi tiết', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),
                      _buildTextField('Họ và tên', _fullNameController, Icons.person),
                      const SizedBox(height: 15),
                      _buildTextField('Email', _emailController, Icons.email),
                      const SizedBox(height: 15),
                      _buildTextField('Số điện thoại', _phoneController, Icons.phone),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Actions Section
            if (!_isEditing) ...[
              Card(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.lock_outline, color: Colors.blue),
                      title: const Text('Đổi mật khẩu'),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          AppRouter.changePassword,
                        );
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.logout, color: Colors.red),
                      title: const Text('Đăng xuất', style: TextStyle(color: Colors.red)),
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

  Widget _buildTextField(String label, TextEditingController controller, IconData icon) {
    return TextFormField(
      controller: controller,
      enabled: _isEditing,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.grey),
        filled: !_isEditing,
        fillColor: _isEditing ? Colors.white : Colors.grey.shade50,
      ),
      validator: (v) => v!.isEmpty ? 'Vui lòng nhập thông tin' : null,
    );
  }
}
