class NotificationModel {
  final int notificationId;
  final String title;
  final String content;
  final String type;
  final String? link;
  final bool isRead;
  final String createdAt;

  NotificationModel({
    required this.notificationId,
    required this.title,
    required this.content,
    required this.type,
    this.link,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    String rawDate = json['createdAt']?.toString() ?? '';
    // Fix format "yyyy-MM-dd HH:mm:ss" to "yyyy-MM-ddTHH:mm:ss" for Dart parsing
    if (rawDate.contains(' ') && !rawDate.contains('T')) {
      rawDate = rawDate.replaceAll(' ', 'T');
    }
    
    return NotificationModel(
      notificationId: json['notificationId'] ?? json['id'] ?? 0,
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      type: json['type'] ?? 'GENERAL',
      link: json['link'],
      isRead: json['isRead'] ?? false,
      createdAt: rawDate,
    );
  }
}
