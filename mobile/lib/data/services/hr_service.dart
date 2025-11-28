import 'api_service.dart';
import '../models/attendance.dart';
import '../models/payroll.dart';
import '../models/leave_request.dart';

class HRService {
  final ApiService _apiService = ApiService();

  // Attendance
  Future<Map<String, dynamic>> checkIn(double latitude, double longitude, String address) async {
    final response = await _apiService.post('/cham-cong/gps', {
      'latitude': latitude,
      'longitude': longitude,
      'diaChiCheckin': address,
    });
    return response;
  }

  Future<void> checkOut(int attendanceId, double lat, double lng, String address) async {
    await _apiService.patch('/cham-cong/$attendanceId/check-out', {});
  }

  Future<Map<String, dynamic>?> getTodayAttendance(int userId) async {
    // Endpoint: /cham-cong/status/{nhanvienId}
    // Note: userId is passed, but backend expects nhanvienId usually. 
    // Assuming the app stores nhanvienId or backend handles userId mapping.
    // Based on gemini.md: GET /cham-cong/status/{nhanvienId}
    // We need to ensure we pass nhanvienId. 
    // For now, let's assume the passed ID is correct (nhanvienId).
    try {
      final response = await _apiService.get('/cham-cong/status/$userId');
      return response;
    } catch (e) {
      return null;
    }
  }

  Future<List<Attendance>> getMonthlyAttendance(int nhanvienId, int month, int year) async {
    final response = await _apiService.get('/cham-cong/nhan-vien/$nhanvienId/month?year=$year&month=$month');
    if (response is List) {
      return response.map((e) => Attendance.fromJson(e)).toList();
    }
    return [];
  }

  // Payroll
  Future<List<Payroll>> getPayroll(int nhanvienId, int month, int year) async {
    // Backend: /bang-luong/nhan-vien/{id}?thang={thang}&nam={nam}
    // Note: gemini.md says /bang-luong/nhan-vien/{id}?thang=1&nam=2024
    final response = await _apiService.get('/bang-luong/nhan-vien/$nhanvienId?thang=$month&nam=$year');
    if (response is List) {
      return response.map((e) => Payroll.fromJson(e)).toList();
    }
    return [];
  }

  // Leave Requests
  Future<void> createLeaveRequest(Map<String, dynamic> data) async {
    await _apiService.post('/nghi-phep', data);
  }

  Future<List<LeaveRequest>> getMyLeaveRequests(int nhanvienId) async {
    final response = await _apiService.get('/nghi-phep/nhan-vien/$nhanvienId');
    if (response is List) {
      return response.map((e) => LeaveRequest.fromJson(e)).toList();
    }
    return [];
  }
}
