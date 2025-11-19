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
import DoAn.BE.user.repository.UserRepository;
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
 * Pattern giống DefaultUsersInitializer - đơn giản, không @Order, chỉ check count()
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataSeed {

    private final UserRepository userRepository;
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
    private void seedHRModule() {
        log.info("📋 ========== SEEDING HR MODULE ==========");

        // Lấy users để link với nhân viên
        List<User> employees = userRepository.findByRole(User.Role.EMPLOYEE);
        if (employees.isEmpty()) {
            log.warn("⚠️  No EMPLOYEE users found! Creating minimal HR data...");
        }
        
        User hrManager = userRepository.findByUsername("hr").orElse(null);
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
            {"Giám đốc", 1}, {"Phó Giám đốc", 2},
            {"Trưởng phòng", 3}, {"Phó phòng", 4},
            {"Trưởng nhóm", 5}, {"Nhân viên chính", 6},
            {"Nhân viên", 7}, {"Nhân viên mới", 8},
            {"Thực tập sinh", 9}, {"Chuyên viên cao cấp", 5},
            {"Chuyên viên", 6}, {"Trợ lý", 7}
        };
        
        for (Object[] data : positionData) {
            ChucVu position = new ChucVu();
            position.setTenChucVu((String) data[0]);
            position.setMoTa("Vị trí " + data[0] + " trong tổ chức");
            position.setLevel((Integer) data[1]);
            positions.add(chucVuRepository.save(position));
        }
        log.info("   ✅ Created {} positions", positions.size());

        // 3. NHÂN VIÊN (Employees) - 20 nhân viên
        log.info("👥 Creating Employees...");
        List<NhanVien> nhanViens = new ArrayList<>();
        String[] hoTenList = {
            "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường",
            "Phạm Thị Dung", "Hoàng Văn Em", "Vũ Thị Phượng",
            "Đặng Văn Giang", "Bùi Thị Hoa", "Đinh Văn Ích",
            "Dương Thị Khánh", "Ngô Văn Long", "Lý Thị Mai",
            "Trương Văn Nam", "Phan Thị Oanh", "Võ Văn Phú",
            "Huỳnh Thị Quỳnh", "Tô Văn Sơn", "Mai Thị Tâm",
            "Hồ Văn Ứng", "Lâm Thị Vân"
        };

        for (int i = 0; i < Math.min(20, employees.size()); i++) {
            NhanVien nv = new NhanVien();
            nv.setHoTen(hoTenList[i]);
            nv.setNgaySinh(LocalDate.of(1985 + (i % 15), (i % 12) + 1, (i % 28) + 1));
            nv.setGioiTinh(i % 2 == 0 ? NhanVien.GioiTinh.Nam : NhanVien.GioiTinh.Nữ);
            
            String[] cities = {"Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"};
            nv.setDiaChi("Số " + (i + 1) + " Phố Láng Hạ, " + cities[i % cities.length]);
            
            nv.setCccd("0" + String.format("%011d", 12345678900L + i));
            nv.setNgayVaoLam(LocalDate.now().minusMonths(i * 3L));
            nv.setPhongBan(departments.get(i % departments.size()));
            nv.setChucVu(positions.get(i % positions.size()));
            
            // Lương theo chức vụ level
            int level = positions.get(i % positions.size()).getLevel();
            nv.setLuongCoBan(new BigDecimal((10 - level + 5) * 1000000));
            nv.setPhuCap(new BigDecimal((10 - level) * 300000));
            
            nv.setTrangThai(NhanVien.TrangThaiNhanVien.DANG_LAM_VIEC);
            nv.setUser(employees.get(i));
            nhanViens.add(nhanVienRepository.save(nv));
        }
        log.info("   ✅ Created {} employees", nhanViens.size());

        // Update trưởng phòng cho các phòng ban
        // Fetch lại từ DB để tránh detached entity
        if (!nhanViens.isEmpty()) {
            List<NhanVien> nhanViensFromDB = nhanVienRepository.findAll();
            List<PhongBan> depsFromDB = phongBanRepository.findAll();
            for (int i = 0; i < Math.min(5, Math.min(nhanViensFromDB.size(), depsFromDB.size())); i++) {
                depsFromDB.get(i).setTruongPhong(nhanViensFromDB.get(i));
                phongBanRepository.save(depsFromDB.get(i));
            }
            log.info("   ✅ Assigned department heads");
        }

        // 4. HỢP ĐỒNG (Contracts) - 20 hợp đồng
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
        log.info("   ✅ Created 20 contracts");

        // 5. CHẤM CÔNG (Attendance) - 100 records (5 ngày x 20 nhân viên)
        log.info("⏰ Creating Attendance records...");
        int attendanceCount = 0;
        for (int day = 0; day < 5; day++) {
            LocalDate date = LocalDate.now().minusDays(day);
            for (NhanVien nv : nhanViens) {
                ChamCong cc = new ChamCong();
                cc.setNhanVien(nv);
                cc.setNgayCham(date);
                
                // Giờ vào/ra
                cc.setGioVao(java.time.LocalTime.of(8, attendanceCount % 30, 0));
                cc.setGioRa(java.time.LocalTime.of(17, 30 + (attendanceCount % 30), 0));
                
                chamCongRepository.save(cc);
                attendanceCount++;
            }
        }
        log.info("   ✅ Created {} attendance records", attendanceCount);

        // 6. BẢNG LƯƠNG (Payroll) - 20 bảng lương tháng hiện tại
        log.info("💰 Creating Payroll records...");
        LocalDate now = LocalDate.now();
        for (NhanVien nv : nhanViens) {
            BangLuong bl = new BangLuong();
            bl.setNhanVien(nv);
            bl.setThang(now.getMonthValue());
            bl.setNam(now.getYear());
            bl.setLuongCoBan(nv.getLuongCoBan());
            bl.setNgayCong(22);
            bl.setPhuCap(nv.getPhuCap());
            bl.setThuong(new BigDecimal((nv.getChucVu().getLevel() < 5 ? 2000000 : 1000000)));
            bangLuongRepository.save(bl);
        }
        log.info("   ✅ Created 20 payroll records");

        // 7. NGHỈ PHÉP (Leave Requests) - 15 đơn nghỉ phép
        log.info("🏖️ Creating Leave Requests...");
        for (int i = 0; i < Math.min(15, nhanViens.size()); i++) {
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
            
            // Trạng thái đơn
            if (i % 3 == 0) {
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.CHO_DUYET);
            } else if (i % 3 == 1) {
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.DA_DUYET);
                np.setNguoiDuyet(hrManager);
                np.setNgayDuyet(LocalDateTime.now().minusDays(1));
            } else {
                np.setTrangThai(NghiPhep.TrangThaiNghiPhep.TU_CHOI);
                np.setNguoiDuyet(hrManager);
                np.setNgayDuyet(LocalDateTime.now().minusDays(1));
            }
            
            nghiPhepRepository.save(np);
        }
        log.info("   ✅ Created 15 leave requests");

        // 8. ĐÁNH GIÁ (Performance Reviews) - 15 đánh giá
        log.info("⭐ Creating Performance Reviews...");
        // Fetch lại NhanVien từ DB để tránh detached entity
        List<NhanVien> nhanViensFromDB = nhanVienRepository.findAll();
        for (int i = 0; i < Math.min(15, nhanViensFromDB.size() - 1); i++) {
            DanhGia dg = new DanhGia();
            dg.setNhanVien(nhanViensFromDB.get(i));
            // Người đánh giá là nhân viên kế tiếp
            dg.setNguoiDanhGia(nhanViensFromDB.get(i + 1));
            
            LocalDate reviewDate = LocalDate.now().minusMonths(i % 3);
            dg.setKyDanhGia(reviewDate.getMonthValue() + "/" + reviewDate.getYear());
            dg.setLoaiDanhGia(i % 2 == 0 ? DanhGia.LoaiDanhGia.HANG_QUY : DanhGia.LoaiDanhGia.HANG_NAM);
            
            // Điểm đánh giá (7.0 - 9.5)
            dg.setDiemChuyenMon(new BigDecimal(7.0 + (i % 5) * 0.5));
            dg.setDiemThaiDo(new BigDecimal(7.5 + (i % 5) * 0.5));
            dg.setDiemKyNangMem(new BigDecimal(7.0 + (i % 6) * 0.4));
            
            String[] comments = {
                "Nhân viên nhiệt tình, tích cực trong công việc",
                "Cần cải thiện kỹ năng giao tiếp",
                "Hoàn thành tốt các nhiệm vụ được giao",
                "Thái độ làm việc rất chuyên nghiệp",
                "Cần nâng cao kỹ năng chuyên môn"
            };
            dg.setNhanXet(comments[i % comments.length]);
            dg.setKeHoachPhatTrien("Tham gia các khóa đào tạo nâng cao trong quý tới");
            
            danhGiaRepository.save(dg);
        }
        log.info("   ✅ Created {} performance reviews", Math.min(15, nhanViensFromDB.size() - 1));

        log.info("📋 ========== HR MODULE COMPLETED ==========\n");
    }

    // ==================== MODULE 2: PROJECT ====================
    private void seedProjectModule() {
        log.info("📊 ========== SEEDING PROJECT MODULE ==========");

        List<User> allUsers = userRepository.findAll();
        List<User> pmUsers = userRepository.findByRole(User.Role.MANAGER_PROJECT);
        User pmUser = pmUsers.isEmpty() ? allUsers.get(0) : pmUsers.get(0);

        // 1. Projects - 10 projects
        log.info("📁 Creating Projects...");
        List<Project> projects = new ArrayList<>();
        String[][] projectData = {
            {"HRM System", "HRM"}, {"Website Công ty", "WEB"}, {"Mobile App", "MOB"},
            {"Dashboard Analytics", "DASH"}, {"CRM System", "CRM"}, {"E-commerce", "ECOM"},
            {"API Gateway", "API"}, {"Microservices", "MICRO"}, {"DevOps Pipeline", "DEV"},
            {"AI Chatbot", "AI"}
        };

        for (String[] data : projectData) {
            Project project = new Project();
            project.setName(data[0]);
            project.setKeyProject(data[1]);
            project.setDescription("Dự án " + data[0] + " cho công ty");
            project.setStatus(Project.ProjectStatus.ACTIVE);
            project.setStartDate(LocalDate.now().minusMonths(3));
            project.setEndDate(LocalDate.now().plusMonths(6));
            project.setCreatedBy(pmUser);
            project.setIsActive(true);
            projects.add(projectRepository.save(project));
        }
        log.info("   ✅ Created {} projects", projects.size());

        // 2. Project Members - 30 members (3 per project)
        log.info("👥 Creating Project Members...");
        int memberCount = 0;
        for (int i = 0; i < projects.size(); i++) {
            // Owner
            ProjectMember owner = new ProjectMember();
            owner.setProject(projects.get(i));
            owner.setUser(pmUser);
            owner.setRole(ProjectMember.ProjectRole.OWNER);
            projectMemberRepository.save(owner);
            memberCount++;

            // Add 2 more members
            for (int j = 0; j < 2 && (i * 2 + j) < allUsers.size(); j++) {
                ProjectMember member = new ProjectMember();
                member.setProject(projects.get(i));
                member.setUser(allUsers.get(i * 2 + j));
                member.setRole(j == 0 ? ProjectMember.ProjectRole.MANAGER : ProjectMember.ProjectRole.MEMBER);
                projectMemberRepository.save(member);
                memberCount++;
            }
        }
        log.info("   ✅ Created {} project members", memberCount);

        // 3. Issue Statuses - Ensure defaults exist
        List<IssueStatus> statuses;
        if (issueStatusRepository.count() == 0) {
            log.info("📋 Creating Issue Statuses...");
            String[][] statusData = {
                {"To Do", "1", "#6B7280"},
                {"In Progress", "2", "#3B82F6"},
                {"Review", "3", "#F59E0B"},
                {"Done", "4", "#10B981"}
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

        // 5. Issues - 50 issues
        log.info("📝 Creating Issues...");
        String[] issueTitles = {
            "Implement login", "Fix bug dashboard", "Add API endpoint", "Update docs",
            "Refactor code", "Design UI", "Write tests", "Deploy prod", "Security audit",
            "Performance optimization"
        };
        for (int i = 0; i < 50; i++) {
            Issue issue = new Issue();
            issue.setProject(projects.get(i % projects.size()));
            if (i % 3 == 0 && !sprints.isEmpty()) {
                issue.setSprint(sprints.get(i % sprints.size()));
            }
            issue.setIssueKey(projects.get(i % projects.size()).getKeyProject() + "-" + (i + 1));
            issue.setTitle(issueTitles[i % issueTitles.length] + " #" + (i + 1));
            issue.setDescription("Mô tả chi tiết cho issue " + issue.getTitle());
            issue.setIssueStatus(statuses.get(i % statuses.size()));
            issue.setPriority(Issue.Priority.values()[i % 4]);
            issue.setReporter(pmUser);
            if (i % 2 == 0 && !allUsers.isEmpty()) {
                issue.setAssignee(allUsers.get(i % allUsers.size()));
            }
            issue.setEstimatedHours(new BigDecimal(4 + i % 16));
            issue.setDueDate(LocalDate.now().plusDays(i % 30));
            issueRepository.save(issue);
        }
        log.info("   ✅ Created 50 issues");

        // 6. Issue Comments - 80 comments
        log.info("💬 Creating Issue Comments...");
        List<Issue> issues = issueRepository.findAll();
        for (int i = 0; i < Math.min(80, issues.size() * 2); i++) {
            IssueComment comment = new IssueComment();
            comment.setIssue(issues.get(i % issues.size()));
            comment.setAuthor(allUsers.get(i % Math.min(10, allUsers.size())));
            comment.setContent("Comment #" + (i + 1) + ": " + 
                (i % 3 == 0 ? "Đã hoàn thành task" :
                 i % 3 == 1 ? "Cần review code" : "Có vấn đề cần thảo luận"));
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
        for (int i = 0; i < 100; i++) {
            Message message = new Message();
            message.setChatRoom(chatRooms.get(i % chatRooms.size()));
            message.setSender(allUsers.get(i % Math.min(10, allUsers.size())));
            message.setContent(messageContents[i % messageContents.length]);
            message.setSentAt(LocalDateTime.now().minusHours(100 - i));
            messageRepository.save(message);
        }
        log.info("   ✅ Created 100 messages");

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
            file.setFilename("file_" + UUID.randomUUID().toString().substring(0, 8) + "_" + fileNames[i % fileNames.length]);
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

        // 1. Simple Notifications - 30 notifications
        log.info("📢 Creating Notifications...");
        String[] notifTypes = {"INFO", "SUCCESS", "WARNING", "ERROR"};
        String[] notifTitles = {
            "Chào mừng!", "Cập nhật thành công", "Cảnh báo hệ thống", "Lỗi xảy ra",
            "Tin nhắn mới", "Dự án mới", "Nhiệm vụ được giao", "Deadline sắp tới"
        };
        
        for (int i = 0; i < Math.min(30, allUsers.size() * 3); i++) {
            Notification notif = new Notification();
            notif.setUser(allUsers.get(i % allUsers.size()));
            notif.setType(notifTypes[i % notifTypes.length]);
            notif.setTitle(notifTitles[i % notifTitles.length]);
            notif.setContent("Nội dung thông báo số " + (i + 1));
            notif.setLink("/dashboard");
            notif.setIsRead(i % 5 == 0); // 20% đã đọc
            notificationRepository.save(notif);
        }
        log.info("   ✅ Created 30 notifications");

        // 2. ThongBao - 20 advanced notifications
        log.info("📨 Creating ThongBao...");
        for (int i = 0; i < Math.min(20, allUsers.size() * 2); i++) {
            ThongBao tb = new ThongBao();
            tb.setNguoiNhan(allUsers.get(i % allUsers.size()));
            tb.setTieuDe("Thông báo " + (i + 1));
            tb.setNoiDung("Nội dung thông báo chi tiết số " + (i + 1));
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
