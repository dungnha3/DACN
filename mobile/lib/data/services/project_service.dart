import 'api_service.dart';

class ProjectService {
  final ApiService _apiService = ApiService();

  Future<dynamic> getMyProjects(int userId) async {
    return await _apiService.get('/projects/my-projects');
  }

  Future<dynamic> getMyTasks(int userId) async {
    return await _apiService.get('/issues/my-issues');
  }

  Future<dynamic> getTaskDetail(int taskId) async {
    return await _apiService.get('/issues/$taskId');
  }

  Future<dynamic> updateTaskStatus(int taskId, String status) async {
    int statusId = 1; // Default TODO
    if (status == 'IN_PROGRESS') statusId = 2;
    if (status == 'DONE') statusId = 4; // Assuming 4 is Done
    
    return await _apiService.patch('/issues/$taskId/status/$statusId', {});
  }

  Future<dynamic> addComment(int taskId, String content) async {
    return await _apiService.post('/comments', {
      'issueId': taskId,
      'content': content,
    });
  }
}
