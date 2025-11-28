import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../data/services/hr_service.dart';
import '../../data/services/auth_service.dart';

class PayrollScreen extends StatefulWidget {
  const PayrollScreen({super.key});

  @override
  State<PayrollScreen> createState() => _PayrollScreenState();
}

class _PayrollScreenState extends State<PayrollScreen> {
  final HRService _hrService = HRService();
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  Map<String, dynamic>? _payrollData;
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
        final data = await _hrService.getPayroll(
          userId,
          _selectedDate.month,
          _selectedDate.year,
        );
        setState(() {
          _payrollData = data;
        });
      }
    } catch (e) {

      setState(() {
        _error = 'Không tìm thấy bảng lương cho tháng này.';
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

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Bảng Lương'),
        centerTitle: true,
        backgroundColor: Colors.blue.shade800,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Month Selector
          Container(
            padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios),
                  onPressed: () => _changeMonth(-1),
                ),
                Column(
                  children: [
                    Text(
                      'Tháng ${_selectedDate.month}/${_selectedDate.year}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Text(
                      'Kỳ lương chính thức',
                      style: TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.arrow_forward_ios),
                  onPressed: () => _changeMonth(1),
                ),
              ],
            ),
          ),

          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
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
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [Colors.green.shade700, Colors.green.shade500],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(20),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.green.withValues(alpha: 0.3),
                                        blurRadius: 10,
                                        offset: const Offset(0, 5),
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
                                          fontWeight: FontWeight.bold,
                                          letterSpacing: 1.2,
                                        ),
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        currencyFormat.format(_payrollData!['netSalary'] ?? 0),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 32,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 5),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(alpha: 0.2),
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        child: Text(
                                          _payrollData!['status'] ?? 'Đã thanh toán',
                                          style: const TextStyle(color: Colors.white, fontSize: 12),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                const SizedBox(height: 20),

                                // Income Details
                                _buildSectionTitle('Thu nhập'),
                                Card(
                                  elevation: 2,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      children: [
                                        _buildRow('Lương cơ bản', _payrollData!['baseSalary'], currencyFormat),
                                        const Divider(),
                                        _buildRow('Phụ cấp', _payrollData!['allowance'], currencyFormat, isPositive: true),
                                        const Divider(),
                                        _buildRow('Thưởng', _payrollData!['bonus'], currencyFormat, isPositive: true),
                                        const Divider(),
                                        _buildRow('Làm thêm giờ', _payrollData!['overtimePay'], currencyFormat, isPositive: true),
                                      ],
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 20),

                                // Deductions
                                _buildSectionTitle('Khấu trừ'),
                                Card(
                                  elevation: 2,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      children: [
                                        _buildRow('Bảo hiểm', _payrollData!['insurance'], currencyFormat, isNegative: true),
                                        const Divider(),
                                        _buildRow('Thuế TNCN', _payrollData!['tax'], currencyFormat, isNegative: true),
                                        const Divider(),
                                        _buildRow('Phạt / Khác', _payrollData!['deductions'], currencyFormat, isNegative: true),
                                      ],
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 20),
                                
                                // Summary
                                Card(
                                  color: Colors.blue.shade50,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      children: [
                                        _buildRow('Tổng thu nhập', _payrollData!['totalIncome'], currencyFormat, isBold: true),
                                        const SizedBox(height: 10),
                                        _buildRow('Tổng khấu trừ', _payrollData!['totalDeductions'], currencyFormat, isBold: true, isNegative: true),
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

  Widget _buildSectionTitle(String title) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(left: 10, bottom: 10),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
        ),
      ),
    );
  }

  Widget _buildRow(String label, dynamic value, NumberFormat format, {bool isPositive = false, bool isNegative = false, bool isBold = false}) {
    double val = 0;
    if (value is int) val = value.toDouble();
    if (value is double) val = value;

    Color textColor = Colors.black87;
    if (isPositive) textColor = Colors.green;
    if (isNegative) textColor = Colors.red;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: Colors.black54,
            ),
          ),
          Text(
            '${isPositive ? '+' : ''}${isNegative ? '-' : ''}${format.format(val)}',
            style: TextStyle(
              fontSize: 14,
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}
