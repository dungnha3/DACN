import 'api_service.dart';
import '../models/attendance.dart';
import '../models/payroll.dart';
import '../models/leave_request.dart';

class HRService {
  final ApiService _apiService = ApiService();

  // Attendance
  Future<Map<String, dynamic>> checkIn(int nhanvienId, double latitude, double longitude, String address) async {
    // Endpoint: /api/cham-cong/gps (Default useApiBase=true)
    final response = await _apiService.post('/cham-cong/gps', {
      'nhanvienId': nhanvienId,
      'latitude': latitude,
      'longitude': longitude,
      'diaChiCheckin': address,
    });
    return response;
  }

  Future<void> checkOut(int attendanceId, double lat, double lng, String address) async {
    // Endpoint: /api/cham-cong/{id}/check-out
    await _apiService.patch('/cham-cong/$attendanceId/check-out', {});
  }

  Future<Map<String, dynamic>?> getTodayAttendance(int nhanvienId) async {
    // Endpoint: /api/cham-cong/status/{nhanvienId}
    try {
      final response = await _apiService.get('/cham-cong/status/$nhanvienId');
      return response;
    } catch (e) {
      return null;
    }
  }

  Future<List<Attendance>> getMonthlyAttendance(int nhanvienId, int month, int year) async {
    // Endpoint: /api/cham-cong/nhan-vien/{id}/month
    final response = await _apiService.get('/cham-cong/nhan-vien/$nhanvienId/month?year=$year&month=$month');
    if (response is List) {
      return response.map((e) => Attendance.fromJson(e)).toList();
    }
    return [];
  }

  // Payroll
  Future<List<Payroll>> getPayroll(int nhanvienId, int month, int year) async {
    // Backend: /bang-luong/nhan-vien/{id} (No /api prefix -> useApiBase: false)
    final response = await _apiService.get('/bang-luong/nhan-vien/$nhanvienId?thang=$month&nam=$year', useApiBase: false);
    if (response is List) {
      return response.map((e) => Payroll.fromJson(e)).toList();
    }
    return [];
  }

  // Leave Requests
  Future<void> createLeaveRequest(Map<String, dynamic> data) async {
    // Backend: /nghi-phep (No /api prefix -> useApiBase: false)
    await _apiService.post('/nghi-phep', data, useApiBase: false);
  }

  Future<List<LeaveRequest>> getMyLeaveRequests(int nhanvienId) async {
    // Backend: /nghi-phep/nhan-vien/{id} (No /api prefix -> useApiBase: false)
    final response = await _apiService.get('/nghi-phep/nhan-vien/$nhanvienId', useApiBase: false);
    if (response is List) {
      return response.map((e) => LeaveRequest.fromJson(e)).toList();
    }
    return [];
  }

  Future<int?> getEmployeeIdByUserId(int userId) async {
    try {
      final response = await _apiService.get('/nhan-vien/user/$userId', useApiBase: false);
      if (response != null && response['nhanvienId'] != null) {
        return response['nhanvienId'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
