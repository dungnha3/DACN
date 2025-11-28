class Project {
  final int projectId;
  final String name;
  final String keyProject;
  final String description;
  final String status;
  final String startDate;
  final String endDate;

  Project({
    required this.projectId,
    required this.name,
    required this.keyProject,
    required this.description,
    required this.status,
    required this.startDate,
    required this.endDate,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      projectId: json['projectId'],
      name: json['name'],
      keyProject: json['keyProject'],
      description: json['description'] ?? '',
      status: json['status'],
      startDate: json['startDate'],
      endDate: json['endDate'],
    );
  }
}
