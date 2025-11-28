import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:intl/intl.dart';
import 'dart:async';
import 'dart:convert' as import_convert;
import '../../data/services/hr_service.dart';
import '../../data/services/auth_service.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final HRService _hrService = HRService();
  final AuthService _authService = AuthService();
  
  String _currentTime = '';
  String _currentDate = '';
  String _currentAddress = 'Đang lấy vị trí...';
  bool _isLoading = false;
  bool _isCheckedIn = false;
  int? _currentAttendanceId;
  Map<String, dynamic>? _todayAttendance;
  Timer? _timer;
  Position? _currentPosition;

  @override
  void initState() {
    super.initState();
    _updateTime();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) => _updateTime());
    _initializeData();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _updateTime() {
    final now = DateTime.now();
    setState(() {
      _currentTime = DateFormat('HH:mm:ss').format(now);
      _currentDate = DateFormat('EEEE, dd/MM/yyyy', 'vi').format(now);
    });
  }

  Future<void> _initializeData() async {
    setState(() => _isLoading = true);
    await _getCurrentLocation();
    await _checkTodayAttendance();
    setState(() => _isLoading = false);
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      setState(() => _currentAddress = 'Vui lòng bật GPS');
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        setState(() => _currentAddress = 'Quyền vị trí bị từ chối');
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      setState(() => _currentAddress = 'Quyền vị trí bị từ chối vĩnh viễn');
      return;
    }

    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      _currentPosition = position;

      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        setState(() {
          _currentAddress = '${place.street}, ${place.subAdministrativeArea}, ${place.administrativeArea}';
        });
      }
    } catch (e) {

      setState(() => _currentAddress = 'Không thể lấy vị trí');
    }
  }

  Future<void> _checkTodayAttendance() async {
    try {
      final userIdStr = await _authService.getUserId();
      if (userIdStr != null) {
        final userId = int.parse(userIdStr);
        final response = await _hrService.getTodayAttendance(userId);
        
        if (response != null) {
          setState(() {
            _todayAttendance = response;
            // Logic to determine if checked in based on response structure
            // Assuming response has 'checkInTime' and 'checkOutTime'
            if (response['checkInTime'] != null && response['checkOutTime'] == null) {
              _isCheckedIn = true;
              _currentAttendanceId = response['attendanceId'];
            } else {
              _isCheckedIn = false;
            }
          });
        }
      }
    } catch (e) {

    }
  }

  Future<void> _handleCheckInOut() async {
    if (_currentPosition == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đợi lấy vị trí GPS')),
      );
      await _getCurrentLocation();
      return;
    }

    setState(() => _isLoading = true);
    try {
      if (_isCheckedIn) {
        // Check Out
        if (_currentAttendanceId != null) {
          await _hrService.checkOut(
            _currentAttendanceId!,
            _currentPosition!.latitude,
            _currentPosition!.longitude,
            _currentAddress,
          );
          if (!context.mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Check-out thành công!')),
          );
        }
      } else {
        // Check In
        await _hrService.checkIn(
          _currentPosition!.latitude,
          _currentPosition!.longitude,
          _currentAddress,
        );
        if (!context.mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Check-in thành công!')),
        );
      }
      await _checkTodayAttendance();
    } catch (e) {
      if (context.mounted) {
        final errorMessage = _extractErrorMessage(e);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white),
                const SizedBox(width: 10),
                Expanded(child: Text(errorMessage)),
              ],
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  String _extractErrorMessage(dynamic error) {
    final errorStr = error.toString();
    try {
      // Look for JSON part in the error string
      // Format: Exception: API Error: 400 - {"message":"..."}
      final startIndex = errorStr.indexOf('{');
      final endIndex = errorStr.lastIndexOf('}');
      
      if (startIndex != -1 && endIndex != -1) {
        final jsonStr = errorStr.substring(startIndex, endIndex + 1);
        final jsonMap = import_convert.jsonDecode(jsonStr); // Will need import 'dart:convert' as import_convert
        return jsonMap['message'] ?? errorStr;
      }
    } catch (_) {
      // If parsing fails, try to clean up the string a bit
      if (errorStr.contains('Exception: ')) {
        return errorStr.replaceAll('Exception: ', '');
      }
    }
    return errorStr;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chấm công GPS'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _initializeData,
          ),
        ],
      ),
      body: _isLoading && _currentPosition == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Clock Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.blue.shade700, Colors.blue.shade500],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue.withValues(alpha: 0.3),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Text(
                          _currentTime,
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          _currentDate,
                          style: const TextStyle(
                            fontSize: 18,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 30),

                  // Location Info
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.orange.shade50,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.location_on, color: Colors.orange),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Vị trí hiện tại',
                                  style: TextStyle(
                                    color: Colors.grey,
                                    fontSize: 12,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  _currentAddress,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Check In/Out Button
                  GestureDetector(
                    onTap: _isLoading ? null : _handleCheckInOut,
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isCheckedIn ? Colors.red.shade50 : Colors.green.shade50,
                        border: Border.all(
                          color: _isCheckedIn ? Colors.red : Colors.green,
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: (_isCheckedIn ? Colors.red : Colors.green).withValues(alpha: 0.2),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _isCheckedIn ? Icons.logout : Icons.login,
                            size: 50,
                            color: _isCheckedIn ? Colors.red : Colors.green,
                          ),
                          const SizedBox(height: 10),
                          Text(
                            _isCheckedIn ? 'CHECK OUT' : 'CHECK IN',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: _isCheckedIn ? Colors.red : Colors.green,
                            ),
                          ),
                          if (_isLoading)
                            const Padding(
                              padding: EdgeInsets.only(top: 10),
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Today's Stats
                  if (_todayAttendance != null)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                _buildStatItem('Giờ vào', _formatTime(_todayAttendance!['checkInTime'])),
                                _buildStatItem('Giờ ra', _formatTime(_todayAttendance!['checkOutTime'])),
                                _buildStatItem('Tổng giờ', '${_todayAttendance!['workingHours'] ?? 0}h'),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.grey, fontSize: 12),
        ),
        const SizedBox(height: 5),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ],
    );
  }

  String _formatTime(String? dateTimeStr) {
    if (dateTimeStr == null) return '--:--';
    try {
      final dateTime = DateTime.parse(dateTimeStr);
      return DateFormat('HH:mm').format(dateTime);
    } catch (e) {
      return '--:--';
    }
  }
}
