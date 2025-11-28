class Payroll {
  final int bangluongId;
  final int thang;
  final int nam;
  final double luongCoBan;
  final double phuCap;
  final double thuong;
  final double phat;
  final double tongLuong;
  final double baoHiem;
  final double thue;
  final double thucNhan;
  final String trangThai;

  Payroll({
    required this.bangluongId,
    required this.thang,
    required this.nam,
    required this.luongCoBan,
    required this.phuCap,
    required this.thuong,
    required this.phat,
    required this.tongLuong,
    required this.baoHiem,
    required this.thue,
    required this.thucNhan,
    required this.trangThai,
  });

  factory Payroll.fromJson(Map<String, dynamic> json) {
    return Payroll(
      bangluongId: json['bangluongId'],
      thang: json['thang'],
      nam: json['nam'],
      luongCoBan: (json['luongCoBan'] ?? 0).toDouble(),
      phuCap: (json['phuCap'] ?? 0).toDouble(),
      thuong: (json['thuong'] ?? 0).toDouble(),
      phat: (json['phat'] ?? 0).toDouble(),
      tongLuong: (json['tongLuong'] ?? 0).toDouble(),
      baoHiem: (json['baoHiem'] ?? 0).toDouble(),
      thue: (json['thue'] ?? 0).toDouble(),
      thucNhan: (json['thucNhan'] ?? 0).toDouble(),
      trangThai: json['trangThai'] ?? 'UNKNOWN',
    );
  }
}
