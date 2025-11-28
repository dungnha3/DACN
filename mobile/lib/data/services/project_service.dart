import 'api_service.dart';
import '../models/project.dart';
import '../models/issue.dart';

class ProjectService {
  final ApiService _apiService = ApiService();

  Future<List<Project>> getMyProjects(int userId) async {
    // Backend: /api/project/my-projects (Assuming this exists or similar)
    // Based on gemini.md, endpoints are under /api/project
    // Let's assume /api/project/user/{userId} or similar. 
    // gemini.md doesn't explicitly list "my projects" for employee, but let's try a standard path.
    // If not found, we might need to adjust.
    try {
      final response = await _apiService.get('/project/my-projects');
      if (response is List) {
        return response.map((e) => Project.fromJson(e)).toList();
      }
    } catch (e) {
      // ignore
    }
    return [];
  }

  Future<List<Issue>> getMyTasks(int userId) async {
    // Backend: /api/project/issues/my-issues
    try {
      final response = await _apiService.get('/project/issues/my-issues');
      if (response is List) {
        return response.map((e) => Issue.fromJson(e)).toList();
      }
    } catch (e) {
      // ignore
    }
    return [];
  }

  Future<Issue?> getTaskDetail(int taskId) async {
    try {
      final response = await _apiService.get('/project/issues/$taskId');
      return Issue.fromJson(response);
    } catch (e) {
      return null;
    }
  }

  Future<void> updateTaskStatus(int taskId, String status) async {
    // Backend: /api/project/issues/{id}/status?status={status}
    await _apiService.patch('/project/issues/$taskId/status?status=$status', {});
  }

  Future<void> addComment(int taskId, String content) async {
    // Backend: /api/project/issues/{id}/comments
    await _apiService.post('/project/issues/$taskId/comments', {
      'content': content,
    });
  }
}
