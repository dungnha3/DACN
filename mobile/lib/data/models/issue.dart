class Comment {
  final int id;
  final String content;
  final String authorName;
  final String createdAt;

  Comment({
    required this.id,
    required this.content,
    required this.authorName,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] ?? 0,
      content: json['content'] ?? '',
      authorName: json['authorName'] ?? (json['author'] != null ? json['author']['username'] : 'Unknown'),
      createdAt: json['createdAt'] ?? '',
    );
  }
}

class Issue {
  final int issueId;
  final String title;
  final String issueKey;
  final String description;
  final String issueStatus;
  final String priority;
  final String? dueDate;
  final String? assigneeName;
  final String? reporterName;
  final List<Comment> comments;

  Issue({
    required this.issueId,
    required this.title,
    required this.issueKey,
    required this.description,
    required this.issueStatus,
    required this.priority,
    this.dueDate,
    this.assigneeName,
    this.reporterName,
    this.comments = const [],
  });

  factory Issue.fromJson(Map<String, dynamic> json) {
    var commentsList = <Comment>[];
    if (json['comments'] != null) {
      commentsList = (json['comments'] as List).map((e) => Comment.fromJson(e)).toList();
    }

    return Issue(
      issueId: json['issueId'],
      title: json['title'],
      issueKey: json['issueKey'],
      description: json['description'] ?? '',
      issueStatus: json['issueStatus'],
      priority: json['priority'],
      dueDate: json['dueDate'],
      assigneeName: json['assignee'] != null ? json['assignee']['username'] : null,
      reporterName: json['reporter'] != null ? json['reporter']['username'] : null,
      comments: commentsList,
    );
  }
}
