import 'api_service.dart';

class HRService {
  final ApiService _apiService = ApiService();

  // Attendance
  Future<dynamic> checkIn(double latitude, double longitude, String address) async {
    return await _apiService.post('/cham-cong/gps', {
      'latitude': latitude,
      'longitude': longitude,
      'diaChiCheckin': address,
    });
  }

  Future<dynamic> checkOut(int attendanceId, double lat, double lng, String address) async {
    // Note: The backend checkOut only takes ID in path, but if we want to record location for checkout,
    // we might need to update the backend or use a different endpoint.
    // However, the current backend checkOut method:
    // @PatchMapping("/{id}/check-out") public ResponseEntity<ChamCongDTO> checkOut(@PathVariable Long id)
    // It DOES NOT take body. So lat/lng/address are ignored by backend for checkout currently.
    // We will just call the endpoint as is.
    return await _apiService.patch('/cham-cong/$attendanceId/check-out', {});
  }

  Future<dynamic> getTodayAttendance(int userId) async {
    return await _apiService.get('/attendance/today/$userId');
  }

  Future<dynamic> getMonthlyAttendance(int userId, int month, int year) async {
    return await _apiService.get('/attendance/user/$userId?month=$month&year=$year');
  }

  // Payroll
  Future<dynamic> getPayroll(int userId, int month, int year) async {
    // Backend: /bang-luong/nhan-vien/{id}/period?thang={thang}&nam={nam}
    return await _apiService.get('/bang-luong/nhan-vien/$userId/period?thang=$month&nam=$year');
  }

  // Leave Requests
  Future<dynamic> createLeaveRequest(Map<String, dynamic> data) async {
    // Backend: /nghi-phep
    return await _apiService.post('/nghi-phep', data);
  }

  Future<dynamic> getMyLeaveRequests(int userId) async {
    // Backend: /nghi-phep/nhan-vien/{id}
    return await _apiService.get('/nghi-phep/nhan-vien/$userId');
  }
}
