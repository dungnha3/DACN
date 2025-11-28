class LeaveRequest {
  final int nghiphepId;
  final String loaiNghiPhep;
  final String tuNgay;
  final String denNgay;
  final int soNgay;
  final String lyDo;
  final String trangThai;
  final String? ghiChu;

  LeaveRequest({
    required this.nghiphepId,
    required this.loaiNghiPhep,
    required this.tuNgay,
    required this.denNgay,
    required this.soNgay,
    required this.lyDo,
    required this.trangThai,
    this.ghiChu,
  });

  factory LeaveRequest.fromJson(Map<String, dynamic> json) {
    return LeaveRequest(
      nghiphepId: json['nghiphepId'],
      loaiNghiPhep: json['loaiNghiPhep'],
      tuNgay: json['tuNgay'],
      denNgay: json['denNgay'],
      soNgay: json['soNgay'],
      lyDo: json['lyDo'],
      trangThai: json['trangThai'],
      ghiChu: json['ghiChu'],
    );
  }
}
