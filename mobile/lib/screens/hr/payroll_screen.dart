import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/services/hr_service.dart';
import '../../data/services/auth_service.dart';
import '../../data/models/payroll.dart';

class PayrollScreen extends StatefulWidget {
  const PayrollScreen({super.key});

  @override
  State<PayrollScreen> createState() => _PayrollScreenState();
}

class _PayrollScreenState extends State<PayrollScreen> {
  final HRService _hrService = HRService();
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  Payroll? _payrollData;
  DateTime _selectedDate = DateTime.now();
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchPayroll();
  }

  Future<void> _fetchPayroll() async {
    setState(() {
      _isLoading = true;
      _error = null;
      _payrollData = null;
    });

    try {
      final userIdStr = await _authService.getUserId();
      if (userIdStr != null) {
        final userId = int.parse(userIdStr);
        // Note: Service expects nhanvienId, but we are passing userId.
        // Ideally backend handles this or we fetch nhanvienId first.
        // Assuming userId works for now as per previous logic.
        final dataList = await _hrService.getPayroll(
          userId,
          _selectedDate.month,
          _selectedDate.year,
        );
        
        if (dataList.isNotEmpty) {
          setState(() {
            _payrollData = dataList.first;
          });
        } else {
           setState(() {
            _error = 'Chưa có bảng lương cho tháng này.';
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Lỗi tải dữ liệu: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _changeMonth(int offset) {
    setState(() {
      _selectedDate = DateTime(_selectedDate.year, _selectedDate.month + offset);
    });
    _fetchPayroll();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: 'đ');
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Bảng Lương'),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Month Selector
          Container(
            padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
            decoration: BoxDecoration(
              color: theme.primaryColor,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                  onPressed: () => _changeMonth(-1),
                ),
                Column(
                  children: [
                    Text(
                      'Tháng ${_selectedDate.month}/${_selectedDate.year}',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const Text(
                      'Kỳ lương chính thức',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.arrow_forward_ios, color: Colors.white),
                  onPressed: () => _changeMonth(1),
                ),
              ],
            ),
          ),

          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: theme.primaryColor))
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.receipt_long_outlined, size: 64, color: Colors.grey[400]),
                            const SizedBox(height: 16),
                            Text(_error!, style: TextStyle(color: Colors.grey[600])),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _fetchPayroll,
                              child: const Text('Thử lại'),
                            ),
                          ],
                        ),
                      )
                    : _payrollData == null
                        ? const Center(child: Text('Không có dữ liệu'))
                        : SingleChildScrollView(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                // Net Salary Card
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [theme.colorScheme.secondary, theme.primaryColor],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(24),
                                    boxShadow: [
                                      BoxShadow(
                                        color: theme.primaryColor.withOpacity(0.3),
                                        blurRadius: 15,
                                        offset: const Offset(0, 8),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    children: [
                                      const Text(
                                        'THỰC LĨNH',
                                        style: TextStyle(
                                          color: Colors.white70,
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          letterSpacing: 1.5,
                                        ),
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        currencyFormat.format(_payrollData!.thucNhan),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 36,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 10),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.2),
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        child: Text(
                                          _payrollData!.trangThai,
                                          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                const SizedBox(height: 25),

                                // Income Details
                                _buildSectionTitle('Thu nhập', theme),
                                Card(
                                  elevation: 2,
                                  shadowColor: Colors.black12,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  child: Padding(
                                    padding: const EdgeInsets.all(20),
                                    child: Column(
                                      children: [
                                        _buildRow('Lương cơ bản', _payrollData!.luongCoBan, currencyFormat),
                                        const Divider(height: 24),
                                        _buildRow('Phụ cấp', _payrollData!.phuCap, currencyFormat, isPositive: true, theme: theme),
                                        const Divider(height: 24),
                                        _buildRow('Thưởng', _payrollData!.thuong, currencyFormat, isPositive: true, theme: theme),
                                      ],
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 25),

                                // Deductions
                                _buildSectionTitle('Khấu trừ', theme),
                                Card(
                                  elevation: 2,
                                  shadowColor: Colors.black12,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  child: Padding(
                                    padding: const EdgeInsets.all(20),
                                    child: Column(
                                      children: [
                                        _buildRow('Bảo hiểm', _payrollData!.baoHiem, currencyFormat, isNegative: true, theme: theme),
                                        const Divider(height: 24),
                                        _buildRow('Thuế TNCN', _payrollData!.thue, currencyFormat, isNegative: true, theme: theme),
                                        const Divider(height: 24),
                                        _buildRow('Phạt / Khác', _payrollData!.phat, currencyFormat, isNegative: true, theme: theme),
                                      ],
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 25),
                                
                                // Summary
                                Card(
                                  color: theme.primaryColor.withOpacity(0.05),
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  child: Padding(
                                    padding: const EdgeInsets.all(20),
                                    child: Column(
                                      children: [
                                        _buildRow('Tổng thu nhập', _payrollData!.tongLuong, currencyFormat, isBold: true),
                                        const SizedBox(height: 12),
                                        _buildRow('Tổng khấu trừ', (_payrollData!.baoHiem + _payrollData!.thue + _payrollData!.phat), currencyFormat, isBold: true, isNegative: true, theme: theme),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 30),
                              ],
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(left: 10, bottom: 10),
      child: Text(
        title,
        style: theme.textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.bold,
          color: Colors.grey.shade700,
        ),
      ),
    );
  }

  Widget _buildRow(String label, double value, NumberFormat format, {bool isPositive = false, bool isNegative = false, bool isBold = false, ThemeData? theme}) {
    Color textColor = Colors.black87;
    if (isPositive) textColor = theme?.colorScheme.secondary ?? Colors.green.shade700;
    if (isNegative) textColor = theme?.colorScheme.error ?? Colors.red.shade700;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 15,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            color: Colors.black54,
          ),
        ),
        Text(
          '${isPositive ? '+' : ''}${isNegative ? '-' : ''}${format.format(value)}',
          style: TextStyle(
            fontSize: 15,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
            color: textColor,
          ),
        ),
      ],
    );
  }
}
