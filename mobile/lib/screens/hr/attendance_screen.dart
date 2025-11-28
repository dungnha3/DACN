import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:intl/intl.dart';
import 'dart:async';
import '../../data/services/hr_service.dart';
import '../../data/services/auth_service.dart';
import '../../data/models/attendance.dart';

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
  int? _nhanvienId;
  Attendance? _todayAttendance;
  Timer? _timer;
  Position? _currentPosition;
  String? _statusMessage;

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
      _currentTime = DateFormat('HH:mm').format(now);
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
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      _currentPosition = position;

      // Calculate distance
      double distance = Geolocator.distanceBetween(
        position.latitude,
        position.longitude,
        _companyLat,
        _companyLng,
      );
      
      setState(() {
        _distanceToCompany = distance;
      });

      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        // Safely access properties with null coalescing
        final street = place.street ?? '';
        final subAdmin = place.subAdministrativeArea ?? '';
        final admin = place.administrativeArea ?? '';
        
        setState(() {
          // Join non-empty parts
          _currentAddress = [street, subAdmin, admin]
              .where((s) => s.isNotEmpty)
              .join(', ');
          
          if (_currentAddress.isEmpty) {
            _currentAddress = 'Không xác định được địa chỉ';
          }
        });
      }
    } catch (e) {
      setState(() => _currentAddress = 'Không thể lấy vị trí: $e');
    }
  }

  Future<void> _checkTodayAttendance() async {
    try {
      final userIdStr = await _authService.getUserId();
      if (userIdStr != null) {
        final userId = int.parse(userIdStr);
        
        // Fetch nhanvienId if not already fetched
        if (_nhanvienId == null) {
          _nhanvienId = await _hrService.getEmployeeIdByUserId(userId);
        }

        if (_nhanvienId != null) {
          final response = await _hrService.getTodayAttendance(_nhanvienId!);
          
          if (response != null) {
             final hasCheckedIn = response['hasCheckedIn'] == true;
             final hasCheckedOut = response['hasCheckedOut'] == true;
             final chamCongData = response['chamCong'];

             setState(() {
               if (hasCheckedIn && !hasCheckedOut) {
                 _isCheckedIn = true;
                 if (chamCongData != null) {
                   _todayAttendance = Attendance.fromJson(chamCongData);
                   _currentAttendanceId = _todayAttendance!.chamcongId;
                 }
                 _statusMessage = "Bạn đã Check-in. Chúc một ngày làm việc tốt lành!";
               } else if (hasCheckedIn && hasCheckedOut) {
                 _isCheckedIn = false; 
                 if (chamCongData != null) {
                   _todayAttendance = Attendance.fromJson(chamCongData);
                 }
                 _statusMessage = "Bạn đã hoàn thành công việc hôm nay.";
               } else {
                 _isCheckedIn = false;
                 _statusMessage = "Bạn chưa Check-in hôm nay.";
               }
             });
          }
        }
      }
    } catch (e) {
      debugPrint('Error checking attendance: $e');
    }
  }

  Future<void> _handleCheckInOut() async {
    if (_currentPosition == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đang lấy vị trí GPS, vui lòng đợi...')),
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
        // Check if already checked out today
        if (_todayAttendance != null && _todayAttendance!.gioRa != null) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Bạn đã Check-out hôm nay rồi!')),
          );
          return;
        }

        if (_nhanvienId == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Không tìm thấy thông tin nhân viên!')),
          );
          return;
        }

        await _hrService.checkIn(
          _nhanvienId!,
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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // Company Location (from gemini.md)
  static const double _companyLat = 21.0285;
  static const double _companyLng = 105.8542;
  static const double _allowedRadius = 500.0; // meters

  double? _distanceToCompany;

  // ... inside _getCurrentLocation ...

  // ... inside build ...
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Stack(
        children: [
          // 1. Map Background (Placeholder)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: MediaQuery.of(context).size.height * 0.6,
            child: Container(
              color: Colors.blue.shade50,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map, size: 80, color: Colors.blue.shade200),
                    const SizedBox(height: 10),
                    Text(
                      "Bản đồ GPS",
                      style: TextStyle(color: Colors.blue.shade300, fontSize: 18),
                    ),
                    if (_currentPosition != null)
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          "Lat: ${_currentPosition!.latitude.toStringAsFixed(4)}, Lng: ${_currentPosition!.longitude.toStringAsFixed(4)}",
                          style: TextStyle(color: Colors.blue.shade400),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          
          // Back Button
          Positioned(
            top: 40,
            left: 10,
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black87),
              onPressed: () => Navigator.pop(context),
            ),
          ),

          // 2. Bottom Sheet Action Area
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            height: MediaQuery.of(context).size.height * 0.45,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    offset: Offset(0, -5),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Time & Date
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _currentTime,
                            style: theme.textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          Text(
                            _currentDate,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: _isCheckedIn ? theme.colorScheme.secondary.withOpacity(0.1) : theme.colorScheme.error.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _isCheckedIn ? 'Đang làm việc' : 'Chưa vào ca',
                          style: TextStyle(
                            color: _isCheckedIn ? theme.colorScheme.secondary : theme.colorScheme.error,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Address & Distance
                  Row(
                    children: [
                      Icon(Icons.location_on, color: theme.primaryColor),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _currentAddress,
                              style: const TextStyle(fontSize: 14),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (_distanceToCompany != null)
                              Text(
                                'Cách công ty: ${_distanceToCompany!.toStringAsFixed(0)}m',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: (_distanceToCompany! > _allowedRadius) ? theme.colorScheme.error : theme.colorScheme.secondary,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const Spacer(),

                  // Status Message
                  if (_statusMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Center(
                        child: Text(
                          _statusMessage!,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontStyle: FontStyle.italic,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),

                  // Action Button
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: (_isLoading || (_todayAttendance?.gioRa != null)) ? null : _handleCheckInOut,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isCheckedIn ? theme.colorScheme.error : theme.primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                        elevation: 5,
                      ),
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(_isCheckedIn ? Icons.logout : Icons.login),
                                const SizedBox(width: 10),
                                Text(
                                  _isCheckedIn ? 'CHECK-OUT' : 'CHECK-IN',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
