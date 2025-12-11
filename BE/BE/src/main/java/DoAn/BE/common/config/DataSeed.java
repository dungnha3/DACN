package DoAn.BE.common.config;

import DoAn.BE.chat.entity.*;
import DoAn.BE.chat.repository.*;
import DoAn.BE.hr.entity.*;
import DoAn.BE.hr.repository.*;
import DoAn.BE.notification.entity.*;
import DoAn.BE.notification.repository.*;
import DoAn.BE.project.entity.*;
import DoAn.BE.project.repository.*;
import DoAn.BE.storage.entity.*;
import DoAn.BE.storage.repository.*;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.entity.RoleChangeRequest;
import DoAn.BE.user.repository.UserRepository;
import DoAn.BE.user.repository.RoleChangeRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * COMPREHENSIVE DATA SEED
 * Pattern giống DefaultUsersInitializer - đơn giản, không @Order, chỉ check
 * count()
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataSeed {

    private final UserRepository userRepository;
    private final RoleChangeRequestRepository roleChangeRequestRepository;
    private final PhongBanRepository phongBanRepository;
    private final ChucVuRepository chucVuRepository;
    private final NhanVienRepository nhanVienRepository;
    private final HopDongRepository hopDongRepository;
    private final ChamCongRepository chamCongRepository;
    private final BangLuongRepository bangLuongRepository;
    private final NghiPhepRepository nghiPhepRepository;
    private final DanhGiaRepository danhGiaRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SprintRepository sprintRepository;
    private final IssueStatusRepository issueStatusRepository;
    private final IssueRepository issueRepository;
    private final IssueCommentRepository issueCommentRepository;
    private final IssueActivityRepository issueActivityRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final MessageRepository messageRepository;
    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final NotificationRepository notificationRepository;
    private final ThongBaoRepository thongBaoRepository;
    private final MessageStatusRepository messageStatusRepository;

    @Bean
    @Order(2) // Chạy SAU DefaultUsersInitializer (@Order(1))
    CommandLineRunner initComprehensiveData() {
        return args -> {
            // Kiểm tra đơn giản như DefaultUsersInitializer
            if (phongBanRepository.count() > 0) {
                log.info("⏭️  Data already exists, skipping seed");
                return;
            }

            // Đợi users được tạo trước
            if (userRepository.count() == 0) {
                log.warn("⚠️  No users found yet, skipping data seed");
                return;
            }

            log.info("🌱 Seeding comprehensive data...");

            try {
                seedHRModule();
                log.info("✅ HR Module completed\n");

                seedProjectModule();
                log.info("✅ Project Module completed\n");

                seedChatModule();
                log.info("✅ Chat Module completed\n");

                seedStorageModule();
                log.info("✅ Storage Module completed\n");

                seedNotificationModule();
                log.info("✅ Notification Module completed\n");

                log.info("\n" +
                        "╔════════════════════════════════════════════════╗\n" +
                        "║   ✅ DATA SEED COMPLETED SUCCESSFULLY!        ║\n" +
                        "╚════════════════════════════════════════════════╝\n");
            } catch (Exception e) {
                log.error("❌ ========================================");
                log.error("❌ ERROR DURING DATA SEEDING");
                log.error("❌ Error: {}", e.getMessage());
                log.error("❌ ========================================", e);
            }
        };
    }

    // ==================== MODULE 1: HR ====================
    // ==================== MODULE 1: HR ====================
    private void seedHRModule() {
        log.info("📋 ========== SEEDING HR MODULE ==========");

        // Lấy TẤT CẢ users để tạo employee (User = Employee trong hệ thống này)
        List<User> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()) {
            log.warn("⚠️  No users found! Skipping HR data...");
            return;
        }

        User hrManager = userRepository.findByUsername("hr").orElse(null);
        User admin = userRepository.findByUsername("admin").orElse(null);
        List<User> pmUsers = userRepository.findByRole(User.Role.MANAGER_PROJECT);
        List<User> accUsers = userRepository.findByRole(User.Role.MANAGER_ACCOUNTING);
        if (hrManager == null) {
            log.warn("⚠️  HR Manager not found!");
        }

        // 1. PHÒNG BAN (Departments) - 10 phòng ban
        log.info("📂 Creating Departments...");
        List<PhongBan> departments = new ArrayList<>();
        String[] deptNames = {
                "Phòng Nhân sự", "Phòng Kế toán", "Phòng Kỹ thuật",
                "Phòng Marketing", "Phòng Kinh doanh", "Phòng Hành chính",
                "Phòng IT", "Phòng Thiết kế", "Phòng Chăm sóc khách hàng",
                "Phòng Nghiên cứu & Phát triển"
        };

        for (String name : deptNames) {
            PhongBan dept = new PhongBan();
            dept.setTenPhongBan(name);
            dept.setMoTa("Quản lý và điều hành các hoạt động của " + name);
            departments.add(phongBanRepository.save(dept));
        }
        log.info("   ✅ Created {} departments", departments.size());

        // 2. CHỨC VỤ (Positions) - 12 chức vụ
        log.info("👔 Creating Positions...");
        List<ChucVu> positions = new ArrayList<>();
        Object[][] positionData = {
                { "Giám đốc", 1 }, { "Phó Giám đốc", 2 },
                { "Trưởng phòng", 3 }, { "Phó phòng", 4 },
                { "Trưởng nhóm", 5 }, { "Nhân viên chính", 6 },
                { "Nhân viên", 7 }, { "Nhân viên mới", 8 },
                { "Thực tập sinh", 9 }, { "Chuyên viên cao cấp", 5 },
                { "Chuyên viên", 6 }, { "Trợ lý", 7 }
        };

        for (Object[] data : positionData) {
            ChucVu position = new ChucVu();
            position.setTenChucVu((String) data[0]);
            position.setMoTa("Vị trí " + data[0] + " trong tổ chức");
            position.setLevel((Integer) data[1]);
            positions.add(chucVuRepository.save(position));
        }
        log.info("   ✅ Created {} positions", positions.size());

        // 3. NHÂN VIÊN (Employees) - UPDATE thông tin cho employees đã được
        // auto-created
        log.info("👥 Updating Employees info...");
        List<NhanVien> nhanViens = nhanVienRepository.findAll();

        String[] hoTenList = {
                "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường",
                "Phạm Thị Dung", "Hoàng Văn Em", "Vũ Thị Phượng",
                "Đặng Văn Giang", "Bùi Thị Hoa", "Đinh Văn Ích",
                "Dương Thị Khánh", "Ngô Văn Long", "Lý Thị Mai",
                "Trương Văn Nam", "Phan Thị Oanh", "Võ Văn Phú",
                "Huỳnh Thị Quỳnh", "Tô Văn Sơn", "Mai Thị Tâm",
                "Hồ Văn Ứng", "Lâm Thị Vân", "Đinh Thị Xuân",
                "Trần Văn Yên", "Lê Thị Zara", "Nguyễn Văn Alpha",
                "Phạm Thị Beta", "Hoàng Văn Gamma", "Vũ Thị Delta",
                "Đặng Văn Epsilon", "Bùi Thị Zeta", "Đinh Văn Eta",
                "Dương Thị Theta"
        };

        for (int i = 0; i < nhanViens.size(); i++) {
            NhanVien nv = nhanViens.get(i);
            User user = nv.getUser();

            // UPDATE thông tin chi tiết
            nv.setHoTen(i < hoTenList.length ? hoTenList[i] : "Nhân viên " + (i + 1));
            nv.setNgaySinh(LocalDate.of(1985 + (i % 15), (i % 12) + 1, (i % 28) + 1));
            nv.setGioiTinh(i % 2 == 0 ? NhanVien.GioiTinh.Nam : NhanVien.GioiTinh.Nữ);

            String[] cities = { "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ" };
            nv.setDiaChi("Số " + (i + 1) + " Phố Láng Hạ, " + cities[i % cities.length]);

            nv.setCccd("0" + String.format("%011d", 12345678900L + i));

            // Generate US phone number: +1 (XXX) XXX-XXXX
            int areaCode = 200 + (i * 17) % 800; // 200-999
            int prefix = 200 + (i * 23) % 800; // 200-999
            int lineNumber = 1000 + (i * 37) % 9000; // 1000-9999
            String usPhoneNumber = String.format("+1 (%03d) %03d-%04d", areaCode, prefix, lineNumber);
            nv.setSdt(usPhoneNumber);

            nv.setNgayVaoLam(LocalDate.now().minusMonths(i * 2L));
            nv.setPhongBan(departments.get(i % departments.size()));

            // Gán chức vụ theo role
            ChucVu chucVu;
            switch (user.getRole()) {
                case ADMIN:
                    chucVu = positions.get(0); // Giám đốc
                    break;
                case MANAGER_HR:
                case MANAGER_ACCOUNTING:
                case MANAGER_PROJECT:
                    chucVu = positions.get(2); // Trưởng phòng
                    break;
                default:
                    chucVu = positions.get(6 + (i % 3)); // Nhân viên, Nhân viên chính, Nhân viên mới
            }
            nv.setChucVu(chucVu);

            // Lương theo chức vụ level
            int level = chucVu.getLevel();
            nv.setLuongCoBan(new BigDecimal((10 - level + 5) * 1000000));
            nv.setPhuCap(new BigDecimal((10 - level) * 300000));

            nhanVienRepository.save(nv);
        }
        log.info("   ✅ Updated {} employees with full info", nhanViens.size());

        // Update trưởng phòng cho các phòng ban
        if (!nhanViens.isEmpty()) {
            List<NhanVien> nhanViensFromDB = nhanVienRepository.findAll();
            List<PhongBan> depsFromDB = phongBanRepository.findAll();
            for (int i = 0; i < Math.min(5, Math.min(nhanViensFromDB.size(), depsFromDB.size())); i++) {
                depsFromDB.get(i).setTruongPhong(nhanViensFromDB.get(i));
                phongBanRepository.save(depsFromDB.get(i));
            }
            log.info("   ✅ Assigned department heads");
        }

        // 4. HỢP ĐỒNG (Contracts) - 30 hợp đồng
        log.info("📄 Creating Contracts...");
        for (int i = 0; i < nhanViens.size(); i++) {
            HopDong contract = new HopDong();
            contract.setNhanVien(nhanViens.get(i));

            // Phân loại hợp đồng
            HopDong.LoaiHopDong loai;
            if (i % 3 == 0) {
                loai = HopDong.LoaiHopDong.THU_VIEC;
            } else if (i % 3 == 1) {
                loai = HopDong.LoaiHopDong.XAC_DINH;
            } else {
                loai = HopDong.LoaiHopDong.VO_THOI_HAN;
            }
            contract.setLoaiHopDong(loai);

            contract.setNgayBatDau(nhanViens.get(i).getNgayVaoLam());
            if (loai != HopDong.LoaiHopDong.VO_THOI_HAN) {
                contract.setNgayKetThuc(contract.getNgayBatDau().plusYears(i % 3 == 0 ? 1 : 2));
            }
            contract.setLuongCoBan(nhanViens.get(i).getLuongCoBan());
            contract.setNoiDung("Hợp đồng lao động giữa Công ty và " + nhanViens.get(i).getHoTen());
            contract.setTrangThai(HopDong.TrangThaiHopDong.HIEU_LUC);
            hopDongRepository.save(contract);
        }
        log.info("   ✅ Created {} contracts", nhanViens.size());

        // 5. CHẤM CÔNG (Attendance) - 300 records (10 ngày x 30 nhân viên)
        log.info("⏰ Creating Attendance records (with GPS)...");
        int attendanceCount = 0;
        Random random = new Random();
        double companyLat = 10.801829;
        double companyLng = 106.714231;

        String[] lateReasons = {
                "Kẹt xe trên đường Xa Lộ Hà Nội",
                "Việc gia đình đột xuất",
                "Thời tiết xấu, mưa lớn",
                "Xe hỏng giữa đường",
                "Con ốm phải đưa đi bác sĩ"
        };
        String[] addresses = {
                "HUTECH Campus A, Khu Công Nghệ Cao, TP.HCM",
                "Tòa nhà E, HUTECH, Quận 9",
                "Cổng chính HUTECH, Đường Điện Biên Phủ"
        };

        for (int day = 0; day < 10; day++) {
            LocalDate date = LocalDate.now().minusDays(day);
            for (NhanVien nv : nhanViens) {
                ChamCong cc = new ChamCong();
                cc.setNhanVien(nv);
                cc.setNgayCham(date);

                // Giờ vào/ra với variation
                int lateMinutes = random.nextInt(30) - 10; // -10 to +20 minutes
                cc.setGioVao(java.time.LocalTime.of(8, 0, 0).plusMinutes(lateMinutes));
                cc.setGioRa(java.time.LocalTime.of(17, 30, 0).plusMinutes(random.nextInt(30)));

                // Add ghiChu for late arrivals (> 15 minutes)
                if (lateMinutes > 15) {
                    cc.setGhiChu(lateReasons[random.nextInt(lateReasons.length)]);
                } else if (lateMinutes > 10) {
                    cc.setGhiChu("Đi trễ " + lateMinutes + " phút");
                }

                // GPS Data (simulate near company)
                double latOffset = (random.nextDouble() - 0.5) * 0.001; // ~100m
                double lngOffset = (random.nextDouble() - 0.5) * 0.001;
                cc.setLatitude(companyLat + latOffset);
                cc.setLongitude(companyLng + lngOffset);
                cc.setDiaChiCheckin(addresses[random.nextInt(addresses.length)]);
                cc.setKhoangCach(random.nextDouble() * 100); // 0-100m
                cc.setPhuongThuc(ChamCong.PhuongThucChamCong.GPS);
                cc.setLoaiCa(ChamCong.LoaiCa.FULL);
                // trangThai and soGioLam: Auto-calculated by @PrePersist

                chamCongRepository.save(cc);
                attendanceCount++;
            }
        }
        log.info("   ✅ Created {} attendance records", attendanceCount);

        // 6. BẢNG LƯƠNG (Payroll) - 90 bảng lương (3 tháng x 30 nhân viên)
        log.info("💰 Creating Payroll records...");
        LocalDate now = LocalDate.now();
        int payrollCount = 0;
        for (int monthOffset = 0; monthOffset < 3; monthOffset++) {
            LocalDate targetDate = now.minusMonths(monthOffset);
            int targetMonth = targetDate.getMonthValue();
            int targetYear = targetDate.getYear();

            for (NhanVien nv : nhanViens) {
                BangLuong bl = new BangLuong();
                bl.setNhanVien(nv);
                bl.setThang(targetMonth);
                bl.setNam(targetYear);
                bl.setLuongCoBan(nv.getLuongCoBan());

                // CRITICAL: Set ngayCongChuan explicitly for calculation to work
                bl.setNgayCongChuan(26);
                // Variable working days (20-26)
                bl.setNgayCong(20 + random.nextInt(7));

                bl.setPhuCap(nv.getPhuCap());
                bl.setThuong(new BigDecimal(nv.getChucVu().getLevel() < 5 ? 2_000_000 : 1_000_000));

                // Add overtime hours for some employees (0-10 hours)
                bl.setGioLamThem(random.nextInt(11));

                // @PrePersist will auto-calculate: bhxh, bhyt, bhtn, thueTNCN,
                // tongLuong, tongKhauTru, luongThucNhan

                bangLuongRepository.save(bl);
                payrollCount++;
            }
        }
        log.info("   ✅ Created {} payroll records", payrollCount);

        // 7. NGHỈ PHÉP (Leave Requests) - 30 đơn nghỉ phép
        log.info("🏖️ Creating Leave Requests...");
        for (int i = 0; i < nhanViens.size(); i++) {
            NghiPhep np = new NghiPhep();
            np.setNhanVien(nhanViens.get(i));

            // Phân loại nghỉ phép
            np.setLoaiPhep(NghiPhep.LoaiPhep.values()[i % 4]);

            np.setNgayBatDau(LocalDate.now().plusDays(i * 2L));
            np.setNgayKetThuc(LocalDate.now().plusDays(i * 2L + (i % 3 + 1)));
            np.setSoNgay(i % 3 + 1);

            String[] reasons = {
                    "Việc gia đình", "Sức khỏe không tốt", "Du lịch nghỉ dưỡng",
                    "Tham dự lễ cưới", "Chăm sóc người thân", "Giải quyết công việc cá nhân"
            };
            np.setLyDo(reasons[i % reasons.length]);

            // Trạng thái đơn với approval flow đầy đủ
            String[] rejectReasons = {
                    "Không đủ ngày phép còn lại",
                    "Trùng với deadline dự án quan trọng",
                    "Thiếu nhân sự trong thời gian này",
                    "Cần bổ sung giấy tờ xác nhận"
            };

            if (i % 4 == 0) {
                // Chờ duyệt
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.CHO_DUYET);
            } else if (i % 4 == 1) {
                // PM đã duyệt, chờ Accounting
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.PM_APPROVED);
                if (!pmUsers.isEmpty()) {
                    np.setPmApprover(pmUsers.get(i % pmUsers.size()));
                    np.setPmApprovedAt(LocalDateTime.now().minusDays(2));
                    np.setPmNote("Không ảnh hưởng tiến độ dự án");
                }
            } else if (i % 4 == 2) {
                // Đã duyệt hoàn toàn (PM + Accounting)
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.DA_DUYET);
                if (!pmUsers.isEmpty()) {
                    np.setPmApprover(pmUsers.get(i % pmUsers.size()));
                    np.setPmApprovedAt(LocalDateTime.now().minusDays(3));
                    np.setPmNote("OK, không ảnh hưởng sprint");
                }
                if (!accUsers.isEmpty()) {
                    np.setAccountingApprover(accUsers.get(i % accUsers.size()));
                    np.setAccountingApprovedAt(LocalDateTime.now().minusDays(1));
                    np.setAccountingNote("Còn " + (12 - np.getSoNgay()) + " ngày phép năm");
                }
                np.setNguoiDuyet(hrManager);
                np.setNgayDuyet(LocalDateTime.now().minusDays(1));
                np.setGhiChuDuyet("Đã xác nhận. Chấp thuận đơn nghỉ phép.");
            } else {
                // Từ chối
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.TU_CHOI);
                np.setNguoiDuyet(hrManager);
                np.setNgayDuyet(LocalDateTime.now().minusDays(1));
                np.setGhiChuDuyet(rejectReasons[i % rejectReasons.length]);
            }

            nghiPhepRepository.save(np);
        }
        log.info("   ✅ Created {} leave requests", nhanViens.size());

        // 8. ĐÁNH GIÁ (Performance Reviews) - 15 đánh giá
        log.info("⭐ Creating Performance Reviews...");
        // Fetch lại NhanVien từ DB để tránh detached entity
        List<NhanVien> nhanViensFromDB = nhanVienRepository.findAll();

        String[] reviewComments = {
                "Nhân viên nhiệt tình, tích cực trong công việc",
                "Cần cải thiện kỹ năng giao tiếp",
                "Hoàn thành tốt các nhiệm vụ được giao",
                "Thái độ làm việc rất chuyên nghiệp",
                "Cần nâng cao kỹ năng chuyên môn"
        };
        String[] goals = {
                "Hoàn thành chứng chỉ AWS trong Q2",
                "Lead một dự án nhỏ độc lập",
                "Cải thiện kỹ năng giao tiếp với khách hàng",
                "Mentoring 2 nhân viên mới",
                "Tham gia 3 khóa đào tạo nội bộ"
        };
        String[] devPlans = {
                "Tham gia khóa đào tạo Leadership",
                "Học thêm về Cloud Architecture",
                "Cải thiện English Communication",
                "Đào sâu về DevOps practices",
                "Nâng cao soft skills"
        };

        for (int i = 0; i < Math.min(15, nhanViensFromDB.size() - 1); i++) {
            DanhGia dg = new DanhGia();
            dg.setNhanVien(nhanViensFromDB.get(i));
            // Người đánh giá là nhân viên kế tiếp
            dg.setNguoiDanhGia(nhanViensFromDB.get(i + 1));

            LocalDate reviewDate = LocalDate.now().minusMonths(i % 3);
            dg.setKyDanhGia(reviewDate.getMonthValue() + "/" + reviewDate.getYear());
            dg.setLoaiDanhGia(i % 2 == 0 ? DanhGia.LoaiDanhGia.HANG_QUY : DanhGia.LoaiDanhGia.HANG_NAM);

            // Set review period dates
            dg.setNgayBatDau(reviewDate.withDayOfMonth(1));
            dg.setNgayKetThuc(reviewDate.withDayOfMonth(reviewDate.lengthOfMonth()));

            // Điểm đánh giá (7.0 - 9.5)
            dg.setDiemChuyenMon(new BigDecimal(7.0 + (i % 5) * 0.5));
            dg.setDiemThaiDo(new BigDecimal(7.5 + (i % 5) * 0.5));
            dg.setDiemKyNangMem(new BigDecimal(7.0 + (i % 6) * 0.4));
            dg.setDiemDongDoi(new BigDecimal(7.0 + (i % 7) * 0.5));
            // diemTong and xepLoai: Auto-calculated by @PrePersist

            dg.setNhanXet(reviewComments[i % reviewComments.length]);
            dg.setMucTieuTiepTheo(goals[i % goals.length]);
            dg.setKeHoachPhatTrien(devPlans[i % devPlans.length]);

            // Set status and completion date based on review date
            if (reviewDate.isBefore(LocalDate.now().minusMonths(1))) {
                dg.setTrangThai(DanhGia.TrangThaiDanhGia.DA_DUYET);
                dg.setNgayHoanThanh(reviewDate.plusDays(5));
            } else if (reviewDate.isBefore(LocalDate.now())) {
                dg.setTrangThai(DanhGia.TrangThaiDanhGia.CHO_DUYET);
            } else {
                dg.setTrangThai(DanhGia.TrangThaiDanhGia.DANG_DANH_GIA);
            }

            danhGiaRepository.save(dg);
        }
        log.info("   ✅ Created {} performance reviews", Math.min(15, nhanViensFromDB.size() - 1));

        // 9. ROLE CHANGE REQUESTS - 5 requests
        log.info("🔄 Creating Role Change Requests...");
        if (hrManager != null && admin != null && nhanViens.size() > 5) {
            for (int i = 0; i < 5; i++) {
                User targetUser = nhanViens.get(i).getUser();
                RoleChangeRequest req = new RoleChangeRequest();
                req.setTargetUser(targetUser);
                req.setCurrentRole(targetUser.getRole());
                req.setRequestedRole(User.Role.MANAGER_PROJECT);
                req.setRequestedBy(hrManager);
                req.setReason("Đề xuất thăng chức do năng lực xuất sắc");

                if (i % 2 == 0) {
                    req.setStatus(RoleChangeRequest.RequestStatus.PENDING);
                } else {
                    req.approve(admin, "Đồng ý thăng chức");
                }

                roleChangeRequestRepository.save(req);
            }
            log.info("   ✅ Created 5 role change requests");
        }

        log.info("📋 ========== HR MODULE COMPLETED ==========\n");
    }

    private void seedProjectModule() {
        log.info("📊 ========== SEEDING PROJECT MODULE ==========");

        List<User> allUsers = userRepository.findAll();
        List<User> pmUsers = userRepository.findByRole(User.Role.MANAGER_PROJECT);
        User pmUser = pmUsers.isEmpty() ? allUsers.get(0) : pmUsers.get(0);
        Random random = new Random();

        // 1. Projects - 10 projects
        log.info("📁 Creating Projects...");
        List<Project> projects = new ArrayList<>();
        String[][] projectData = {
                { "HRM System", "HRM" }, { "Website Công ty", "WEB" }, { "Mobile App", "MOB" },
                { "Dashboard Analytics", "DASH" }, { "CRM System", "CRM" }, { "E-commerce", "ECOM" },
                { "API Gateway", "API" }, { "Microservices", "MICRO" }, { "DevOps Pipeline", "DEV" },
                { "AI Chatbot", "AI" }
        };

        for (String[] data : projectData) {
            Project project = new Project();
            project.setName(data[0]);
            project.setKeyProject(data[1]);
            project.setDescription("Dự án " + data[0] + " cho công ty");
            project.setStatus(Project.ProjectStatus.ACTIVE);
            project.setStartDate(LocalDate.now().minusMonths(3));
            project.setEndDate(LocalDate.now().plusMonths(6));

            // Random Budget 100M - 2B
            long randomBudget = 100_000_000L + (long) (Math.random() * 1_900_000_000L);
            project.setBudget(new java.math.BigDecimal(randomBudget));

            project.setCreatedBy(pmUser);
            project.setIsActive(true);
            projects.add(projectRepository.save(project));
        }
        log.info("   ✅ Created {} projects", projects.size());

        // 2. Project Members - Add ALL users as members across projects
        log.info("👥 Creating Project Members...");
        int memberCount = 0;

        // First: Owner for each project (PM user)
        for (Project project : projects) {
            ProjectMember owner = new ProjectMember();
            owner.setProject(project);
            owner.setUser(pmUser);
            owner.setRole(ProjectMember.ProjectRole.OWNER);
            projectMemberRepository.save(owner);
            memberCount++;
        }

        // Second: Distribute ALL other users across projects as members
        // Each user will be member of ~3 projects
        for (int i = 0; i < allUsers.size(); i++) {
            User user = allUsers.get(i);
            if (user.getUserId().equals(pmUser.getUserId()))
                continue; // Skip owner

            // Add this user to 3 different projects
            for (int j = 0; j < 3; j++) {
                int projectIndex = (i + j) % projects.size();
                Project project = projects.get(projectIndex);

                // Check if already exists (should not but just in case)
                var existing = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(
                        project.getProjectId(), user.getUserId());
                if (existing.isEmpty()) {
                    ProjectMember member = new ProjectMember();
                    member.setProject(project);
                    member.setUser(user);
                    member.setRole(j == 0 ? ProjectMember.ProjectRole.MANAGER : ProjectMember.ProjectRole.MEMBER);
                    projectMemberRepository.save(member);
                    memberCount++;
                }
            }
        }
        log.info("   ✅ Created {} project members (all users now have access)", memberCount);

        // 3. Issue Statuses - Ensure defaults exist
        List<IssueStatus> statuses;
        if (issueStatusRepository.count() == 0) {
            log.info("📋 Creating Issue Statuses...");
            String[][] statusData = {
                    { "To Do", "1", "#6B7280" },
                    { "In Progress", "2", "#3B82F6" },
                    { "Review", "3", "#F59E0B" },
                    { "Done", "4", "#10B981" }
            };
            statuses = new ArrayList<>();
            for (String[] data : statusData) {
                IssueStatus status = new IssueStatus(data[0], Integer.parseInt(data[1]), data[2]);
                statuses.add(issueStatusRepository.save(status));
            }
            log.info("   ✅ Created {} issue statuses", statuses.size());
        } else {
            statuses = issueStatusRepository.findAll();
        }

        // 4. Sprints - 15 sprints
        log.info("🏃 Creating Sprints...");
        List<Sprint> sprints = new ArrayList<>();
        for (int i = 0; i < Math.min(15, projects.size() * 2); i++) {
            Sprint sprint = new Sprint();
            sprint.setProject(projects.get(i % projects.size()));
            sprint.setName("Sprint " + ((i % 5) + 1));
            sprint.setGoal("Hoàn thành " + (3 + i % 5) + " features chính");
            sprint.setStartDate(LocalDate.now().minusWeeks(2));
            sprint.setEndDate(LocalDate.now().plusWeeks(2));
            sprint.setStatus(i % 3 == 0 ? Sprint.SprintStatus.ACTIVE : Sprint.SprintStatus.PLANNING);
            sprint.setCreatedBy(pmUser);
            sprints.add(sprintRepository.save(sprint));
        }
        log.info("   ✅ Created {} sprints", sprints.size());

        // 5. Issues - 100 issues (10 issues per project)
        log.info("📝 Creating Issues...");
        String[] issueTitles = {
                "Implement login", "Fix bug dashboard", "Add API endpoint", "Update docs",
                "Refactor code", "Design UI", "Write tests", "Deploy prod", "Security audit",
                "Performance optimization"
        };
        String[] issueDescriptions = {
                "Implement user authentication with JWT token",
                "Fix chart rendering issue on dashboard page",
                "Create RESTful API endpoint for data retrieval",
                "Update API documentation with new endpoints",
                "Refactor legacy code to improve maintainability",
                "Design responsive UI components",
                "Write unit and integration tests",
                "Deploy application to production server",
                "Conduct security audit and fix vulnerabilities",
                "Optimize database queries and caching"
        };

        for (int i = 0; i < 100; i++) {
            Issue issue = new Issue();
            issue.setProject(projects.get(i % projects.size()));
            if (i % 3 == 0 && !sprints.isEmpty()) {
                issue.setSprint(sprints.get(i % sprints.size()));
            }
            issue.setIssueKey(projects.get(i % projects.size()).getKeyProject() + "-" + (i + 1));
            issue.setTitle(issueTitles[i % issueTitles.length] + " #" + (i + 1));
            issue.setDescription(issueDescriptions[i % issueDescriptions.length]);

            IssueStatus currentStatus = statuses.get(i % statuses.size());
            issue.setIssueStatus(currentStatus);
            issue.setPriority(Issue.Priority.values()[i % 4]);
            issue.setReporter(pmUser);
            // ALWAYS assign to a user to ensure all users have tasks
            if (!allUsers.isEmpty()) {
                User assignee = allUsers.get(i % allUsers.size());
                issue.setAssignee(assignee);

                // CRITICAL FIX: Ensure assignee is a member of the project
                // Otherwise user has task but cannot see project ("My Projects" logic)
                try {
                    boolean isMember = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(
                            issue.getProject().getProjectId(), assignee.getUserId()).isPresent();

                    if (!isMember) {
                        ProjectMember newMember = new ProjectMember(
                                issue.getProject(),
                                assignee,
                                ProjectMember.ProjectRole.MEMBER);
                        projectMemberRepository.save(newMember);
                        log.info("   -> Auto-added user {} as member of project {} (Reason: Assigned Task)",
                                assignee.getUsername(), issue.getProject().getName());
                    }
                } catch (Exception e) {
                    log.warn("Failed to auto-add member during seeding: " + e.getMessage());
                }
            }

            // Estimated hours (4-20 hours)
            BigDecimal estimatedHours = new BigDecimal(4 + i % 16);
            issue.setEstimatedHours(estimatedHours);

            // Set actualHours for completed ("Done") issues
            if ("Done".equals(currentStatus.getName())) {
                // Actual = 80-120% of estimated (realistic variation)
                double multiplier = 0.8 + random.nextDouble() * 0.4;
                issue.setActualHours(estimatedHours
                        .multiply(new BigDecimal(multiplier))
                        .setScale(2, java.math.RoundingMode.HALF_UP));
            }

            // Mix of overdue, today, and future due dates
            if (i % 5 == 0) {
                // Overdue issues (past due dates)
                issue.setDueDate(LocalDate.now().minusDays(random.nextInt(10) + 1));
            } else if (i % 5 == 1) {
                // Due today
                issue.setDueDate(LocalDate.now());
            } else {
                // Future due dates
                issue.setDueDate(LocalDate.now().plusDays(i % 30 + 1));
            }

            issueRepository.save(issue);
        }
        log.info("   ✅ Created 100 issues");

        // 6. Issue Comments - 80 comments
        log.info("💬 Creating Issue Comments...");
        List<Issue> issues = issueRepository.findAll();
        for (int i = 0; i < Math.min(80, issues.size() * 2); i++) {
            IssueComment comment = new IssueComment();
            comment.setIssue(issues.get(i % issues.size()));
            comment.setAuthor(allUsers.get(i % Math.min(10, allUsers.size())));
            comment.setContent("Comment #" + (i + 1) + ": " +
                    (i % 3 == 0 ? "Đã hoàn thành task" : i % 3 == 1 ? "Cần review code" : "Có vấn đề cần thảo luận"));
            issueCommentRepository.save(comment);
        }
        log.info("   ✅ Created 80 issue comments");

        // 7. Issue Activities - 100 activities
        log.info("📈 Creating Issue Activities...");
        for (int i = 0; i < Math.min(100, issues.size() * 3); i++) {
            IssueActivity activity = new IssueActivity();
            activity.setIssue(issues.get(i % issues.size()));
            activity.setUser(allUsers.get(i % Math.min(10, allUsers.size())));
            activity.setActivityType(IssueActivity.ActivityType.values()[i % 13]);
            activity.setFieldName(i % 2 == 0 ? "status" : "assignee");
            activity.setOldValue("Giá trị cũ");
            activity.setNewValue("Giá trị mới");
            issueActivityRepository.save(activity);
        }
        log.info("   ✅ Created 100 issue activities");

        log.info("📊 ========== PROJECT MODULE COMPLETED ==========\n");
    }

    // ==================== MODULE 3: CHAT ====================
    private void seedChatModule() {
        log.info("💬 ========== SEEDING CHAT MODULE ==========");

        List<User> allUsers = userRepository.findAll();
        List<Project> projects = projectRepository.findAll();

        // 1. Chat Rooms - 15 rooms
        log.info("🏠 Creating Chat Rooms...");
        List<ChatRoom> chatRooms = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            ChatRoom room = new ChatRoom();
            if (i < 5) {
                room.setType(ChatRoom.RoomType.DIRECT);
                room.setName(null); // Direct không cần tên
            } else if (i < 10) {
                room.setType(ChatRoom.RoomType.GROUP);
                room.setName("Team Chat " + (i - 4));
            } else {
                room.setType(ChatRoom.RoomType.PROJECT);
                room.setName("Project Discussion " + (i - 9));
                if (i - 10 < projects.size()) {
                    room.setProject(projects.get(i - 10));
                }
            }
            room.setCreatedBy(allUsers.get(i % Math.min(10, allUsers.size())));
            room.setCreatedAt(LocalDateTime.now().minusDays(i * 5L));
            chatRooms.add(chatRoomRepository.save(room));
        }
        log.info("   ✅ Created {} chat rooms", chatRooms.size());

        // 2. Chat Room Members - 50 members
        log.info("👤 Creating Chat Room Members...");
        int memberCount = 0;
        for (ChatRoom room : chatRooms) {
            int membersToAdd = room.getType() == ChatRoom.RoomType.DIRECT ? 2 : 4;
            for (int j = 0; j < membersToAdd && j < allUsers.size(); j++) {
                ChatRoomMember member = new ChatRoomMember();
                ChatRoomMemberId id = new ChatRoomMemberId();
                id.setRoomId(room.getRoomId());
                id.setUserId(allUsers.get((memberCount + j) % allUsers.size()).getUserId());
                member.setId(id);
                member.setChatRoom(room);
                member.setUser(allUsers.get((memberCount + j) % allUsers.size()));
                member.setRole(j == 0 ? ChatRoomMember.MemberRole.ADMIN : ChatRoomMember.MemberRole.MEMBER);
                member.setJoinedAt(LocalDateTime.now().minusDays(j));
                chatRoomMemberRepository.save(member);
                memberCount++;
            }
        }
        log.info("   ✅ Created {} chat room members", memberCount);

        // 3. Messages - 100 messages
        log.info("💌 Creating Messages...");
        String[] messageContents = {
                "Xin chào mọi người!", "Hôm nay họp lúc mấy giờ?", "Dự án đang tiến triển tốt",
                "Cần review code này", "Đã fix bug rồi nhé", "Thanks team!",
                "Meeting notes đã gửi mail", "Deadline tuần sau", "Sprint planning vào thứ 2",
                "Daily standup 9h sáng"
        };
        List<Message> savedMessages = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Message message = new Message();
            message.setChatRoom(chatRooms.get(i % chatRooms.size()));
            message.setSender(allUsers.get(i % Math.min(10, allUsers.size())));
            message.setContent(messageContents[i % messageContents.length]);
            message.setMessageType(Message.MessageType.TEXT);
            message.setSentAt(LocalDateTime.now().minusHours(100 - i));
            savedMessages.add(messageRepository.save(message));
        }
        log.info("   ✅ Created 100 messages");

        // 3.1 Message Status (DELIVERED/SEEN) - mark some messages as seen
        log.info("👁️ Creating Message Status records...");
        int statusCount = 0;
        Random random = new Random();
        // Only process first 20 messages to avoid slow queries
        int messagesToProcess = Math.min(20, savedMessages.size());
        for (int i = 0; i < messagesToProcess; i++) {
            Message msg = savedMessages.get(i);
            // Pick one viewer per message (not the sender)
            int viewerIndex = (i + 1) % Math.min(5, allUsers.size());
            User viewer = allUsers.get(viewerIndex);
            if (!viewer.getUserId().equals(msg.getSender().getUserId())) {
                try {
                    MessageStatus status = new MessageStatus();
                    MessageStatusId statusId = new MessageStatusId();
                    statusId.setMessageId(msg.getMessageId());
                    statusId.setUserId(viewer.getUserId());
                    status.setId(statusId);
                    status.setMessage(msg);
                    status.setUser(viewer);
                    status.setStatus(MessageStatus.MessageStatusType.SEEN);
                    status.setTimestamp(msg.getSentAt().plusMinutes(random.nextInt(30) + 1));
                    messageStatusRepository.save(status);
                    statusCount++;
                } catch (Exception e) {
                    log.debug("Skipping duplicate message status");
                }
            }
        }
        log.info("   ✅ Created {} message status records", statusCount);

        log.info("💬 ========== CHAT MODULE COMPLETED ==========\n");
    }

    // ==================== MODULE 4: STORAGE ====================
    private void seedStorageModule() {
        log.info("💾 ========== SEEDING STORAGE MODULE ==========");

        List<User> allUsers = userRepository.findAll();
        List<Project> projects = projectRepository.findAll();

        // 1. Folders - 20 folders
        log.info("📁 Creating Folders...");
        List<Folder> folders = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            Folder folder = new Folder();
            folder.setName(i < 10 ? "My Documents " + (i + 1) : "Shared Folder " + (i - 9));
            folder.setOwner(allUsers.get(i % Math.min(10, allUsers.size())));

            if (i < 5) {
                folder.setFolderType(Folder.FolderType.PERSONAL);
            } else if (i < 15) {
                folder.setFolderType(Folder.FolderType.SHARED);
            } else {
                folder.setFolderType(Folder.FolderType.PROJECT);
                if (i - 15 < projects.size()) {
                    folder.setProject(projects.get(i - 15));
                }
            }
            folders.add(folderRepository.save(folder));
        }
        log.info("   ✅ Created {} folders", folders.size());

        // 2. Files - 30 files
        log.info("📄 Creating Files...");
        String[] fileNames = {
                "report.pdf", "presentation.pptx", "data.xlsx", "document.docx", "image.png",
                "video.mp4", "audio.mp3", "archive.zip", "code.java", "config.yml"
        };
        String[] mimeTypes = {
                "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.ms-excel",
                "application/msword", "image/png", "video/mp4", "audio/mpeg",
                "application/zip", "text/plain", "text/yaml"
        };

        for (int i = 0; i < 30; i++) {
            File file = new File();
            file.setFilename(
                    "file_" + UUID.randomUUID().toString().substring(0, 8) + "_" + fileNames[i % fileNames.length]);
            file.setOriginalFilename(fileNames[i % fileNames.length]);
            file.setFilePath("/uploads/" + file.getFilename());
            file.setFileSize((long) ((i + 1) * 1024 * 100)); // 100KB - 3MB
            file.setMimeType(mimeTypes[i % mimeTypes.length]);
            file.setFolder(folders.get(i % folders.size()));
            file.setOwner(allUsers.get(i % Math.min(10, allUsers.size())));
            file.setVersion(1);
            file.setIsDeleted(false);
            fileRepository.save(file);
        }
        log.info("   ✅ Created 30 files");

        log.info("💾 ========== STORAGE MODULE COMPLETED ==========\n");
    }

    // ==================== MODULE 5: NOTIFICATION ====================
    private void seedNotificationModule() {
        log.info("🔔 ========== SEEDING NOTIFICATION MODULE ==========");

        List<User> allUsers = userRepository.findAll();

        // 1. Simple Notifications - 30 notifications with realistic deep links
        log.info("📢 Creating Notifications...");
        String[] notifTypes = {
                "NEW_MESSAGE", "TASK_ASSIGNED", "TASK_UPDATED", "COMMENT_ADDED",
                "LEAVE_APPROVED", "LEAVE_REJECTED", "SALARY_UPDATED", "ATTENDANCE_REMINDER"
        };
        String[] notifTitles = {
                "Tin nhắn mới từ Team",
                "Bạn được giao task mới",
                "Task đã được cập nhật",
                "Có comment mới trên task",
                "Đơn nghỉ phép đã được duyệt",
                "Đơn nghỉ phép bị từ chối",
                "Bảng lương tháng này đã sẵn sàng",
                "Nhắc nhở: Bạn chưa chấm công hôm nay"
        };
        String[] notifContents = {
                "Team HR gửi tin nhắn mới trong group chat",
                "Task 'Implement login' được giao cho bạn trong dự án HRM",
                "Task 'Fix bug dashboard' đã chuyển sang 'In Progress'",
                "Admin comment: 'Cần review code trước khi merge'",
                "Đơn nghỉ phép từ 15/12 - 17/12 đã được duyệt",
                "Đơn nghỉ phép bị từ chối. Lý do: Thiếu nhân sự",
                "Bảng lương tháng 11/2024 đã được HR tính xong",
                "Đã 9:30 AM, bạn chưa check-in hôm nay!"
        };
        String[] notifLinks = {
                "/chat/room/1",
                "/projects/issues/HRM-1",
                "/projects/issues/DASH-5",
                "/projects/issues/MOB-10",
                "/hr/leave-requests",
                "/hr/leave-requests",
                "/hr/payroll",
                "/hr/attendance"
        };

        for (int i = 0; i < Math.min(30, allUsers.size() * 3); i++) {
            Notification notif = new Notification();
            notif.setUser(allUsers.get(i % allUsers.size()));
            notif.setType(notifTypes[i % notifTypes.length]);
            notif.setTitle(notifTitles[i % notifTitles.length]);
            notif.setContent(notifContents[i % notifContents.length]);
            notif.setLink(notifLinks[i % notifLinks.length]);
            notif.setIsRead(i % 5 == 0); // 20% đã đọc
            notificationRepository.save(notif);
        }
        log.info("   ✅ Created 30 notifications");

        // 2. ThongBao - 20 advanced notifications
        log.info("📨 Creating ThongBao...");
        String[] tbTitles = {
                "Thông báo họp phòng ban",
                "Lịch nghỉ lễ 2024",
                "Cập nhật chính sách công ty",
                "Thông báo tuyển dụng nội bộ",
                "Kết quả đánh giá quý"
        };
        String[] tbContents = {
                "Họp phòng ban lúc 14:00 ngày mai tại phòng họp A",
                "Công ty nghỉ Tết từ 29/12 đến 05/01/2025",
                "Chính sách làm việc từ xa đã được cập nhật",
                "Phòng IT tuyển 2 vị trí Senior Developer",
                "Kết quả đánh giá Q4 đã sẵn sàng. Vui lòng xem chi tiết."
        };

        for (int i = 0; i < Math.min(20, allUsers.size() * 2); i++) {
            ThongBao tb = new ThongBao();
            tb.setNguoiNhan(allUsers.get(i % allUsers.size()));
            tb.setTieuDe(tbTitles[i % tbTitles.length]);
            tb.setNoiDung(tbContents[i % tbContents.length]);
            tb.setLoai(ThongBao.LoaiThongBao.values()[i % ThongBao.LoaiThongBao.values().length]);
            tb.setTrangThai(i % 4 == 0 ? ThongBao.TrangThaiThongBao.DA_DOC : ThongBao.TrangThaiThongBao.CHUA_DOC);
            tb.setUuTien(ThongBao.MucDoUuTien.values()[i % 4]);
            tb.setGuiEmail(i % 3 == 0);
            thongBaoRepository.save(tb);
        }
        log.info("   ✅ Created 20 ThongBao");

        log.info("🔔 ========== NOTIFICATION MODULE COMPLETED ==========\n");
    }

}
