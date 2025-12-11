class User {
  final int userId;
  final String username;
  final String email;
  final String? fullName;
  final String? phoneNumber;
  final String? avatarUrl;
  final String role;
  final bool isActive;

  User({
    required this.userId,
    required this.username,
    required this.email,
    this.fullName,
    this.phoneNumber,
    this.avatarUrl,
    required this.role,
    required this.isActive,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'] ?? 0,
      username: json['username'] ?? 'Unknown',
      email: json['email'] ?? '',
      fullName: json['fullName'],
      phoneNumber: json['phoneNumber'],
      avatarUrl: json['avatarUrl'],
      role: json['role'] ?? 'EMPLOYEE',
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'username': username,
      'email': email,
      'fullName': fullName,
      'phoneNumber': phoneNumber,
      'avatarUrl': avatarUrl,
      'role': role,
      'isActive': isActive,
    };
  }
}
