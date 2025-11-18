package DoAn.BE.hr.config;

import DoAn.BE.hr.entity.NghiPhep;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.repository.NghiPhepRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * Khởi tạo dữ liệu mẫu cho Nghỉ Phép
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class NghiPhepDataInitializer {

    @Bean
    CommandLineRunner initNghiPhepData(
            NghiPhepRepository nghiPhepRepository,
            NhanVienRepository nhanVienRepository,
            UserRepository userRepository) {
        return args -> {
            // Chỉ chạy nếu chưa có dữ liệu
            if (nghiPhepRepository.count() > 0) {
                log.info("📋 Đã có dữ liệu Nghỉ Phép, bỏ qua khởi tạo");
                return;
            }

            log.info("🌱 Bắt đầu khởi tạo dữ liệu mẫu cho Nghỉ Phép...");

            // Lấy danh sách nhân viên
            List<NhanVien> nhanViens = nhanVienRepository.findAll();
            if (nhanViens.isEmpty()) {
                log.warn("⚠️ Không có nhân viên nào trong hệ thống, bỏ qua khởi tạo Nghỉ Phép");
                return;
            }

            // Lấy user HR để làm người duyệt
            User hrApprover = userRepository.findByUsername("hr").orElse(null);
            
            Random random = new Random();
            int count = 0;

            // Tạo 20-30 đơn nghỉ phép với các trạng thái khác nhau
            for (int i = 0; i < Math.min(25, nhanViens.size() * 3); i++) {
                NhanVien nhanVien = nhanViens.get(random.nextInt(nhanViens.size()));
                
                NghiPhep nghiPhep = createSampleNghiPhep(nhanVien, hrApprover, i, random);
                if (nghiPhep != null) {
                    nghiPhepRepository.save(nghiPhep);
                }
                count++;
            }

            log.info("✅ Đã tạo {} đơn Nghỉ Phép mẫu", count);
        };
    }

    private NghiPhep createSampleNghiPhep(NhanVien nhanVien, User hrApprover, int index, Random random) {
        NghiPhep nghiPhep = new NghiPhep();
        nghiPhep.setNhanVien(nhanVien);
        
        // Xác định trạng thái (40% chờ duyệt, 45% đã duyệt, 15% từ chối)
        int statusRandom = random.nextInt(100);
        NghiPhep.TrangThaiNghiPhep trangThai;
        if (statusRandom < 40) {
            trangThai = NghiPhep.TrangThaiNghiPhep.CHO_DUYET;
        } else if (statusRandom < 85) {
            trangThai = NghiPhep.TrangThaiNghiPhep.DA_DUYET;
        } else {
            trangThai = NghiPhep.TrangThaiNghiPhep.TU_CHOI;
        }
        nghiPhep.setTrangThai(trangThai);
        
        // Xác định loại phép
        NghiPhep.LoaiPhep[] loaiPheps = NghiPhep.LoaiPhep.values();
        nghiPhep.setLoaiPhep(loaiPheps[random.nextInt(loaiPheps.length)]);
        
        // Tạo ngày nghỉ (trong vòng 6 tháng gần đây và 3 tháng tới)
        LocalDate baseDate = LocalDate.now().minusMonths(6).plusDays(index * 7);
        int daysOffset = random.nextInt(270); // 9 months
        LocalDate ngayBatDau = baseDate.plusDays(daysOffset);
        
        // Số ngày nghỉ từ 1-5 ngày (thường), hoặc 7-14 ngày (hiếm)
        int soNgayNghi = random.nextInt(100) < 80 ? 
            (1 + random.nextInt(5)) : // 80% trường hợp: 1-5 ngày
            (7 + random.nextInt(8));  // 20% trường hợp: 7-14 ngày
        
        LocalDate ngayKetThuc = ngayBatDau.plusDays(soNgayNghi - 1);
        
        nghiPhep.setNgayBatDau(ngayBatDau);
        nghiPhep.setNgayKetThuc(ngayKetThuc);
        nghiPhep.setSoNgay(soNgayNghi);
        
        // Lý do nghỉ
        nghiPhep.setLyDo(generateLeaveReason(nghiPhep.getLoaiPhep(), random));
        
        // Nếu đã duyệt hoặc từ chối, set người duyệt và thời gian
        if (trangThai != NghiPhep.TrangThaiNghiPhep.CHO_DUYET && hrApprover != null) {
            nghiPhep.setNguoiDuyet(hrApprover);
            nghiPhep.setNgayDuyet(LocalDateTime.now().minusDays(random.nextInt(30)));
            
            if (trangThai == NghiPhep.TrangThaiNghiPhep.DA_DUYET) {
                nghiPhep.setGhiChuDuyet(generateApprovalNote(random));
            } else {
                nghiPhep.setGhiChuDuyet(generateRejectionNote(random));
            }
        }
        
        // Set created time
        nghiPhep.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
        
        return nghiPhep;
    }

    private String generateLeaveReason(NghiPhep.LoaiPhep loaiPhep, Random random) {
        return switch (loaiPhep) {
            case PHEP_NAM -> {
                String[] reasons = {
                    "Nghỉ phép năm theo kế hoạch",
                    "Về quê thăm gia đình",
                    "Du lịch cùng gia đình",
                    "Nghỉ phép bù thêm",
                    "Giải quyết công việc cá nhân",
                    "Nghỉ dưỡng sức",
                    "Tham gia sự kiện gia đình"
                };
                yield reasons[random.nextInt(reasons.length)];
            }
            case OM -> {
                String[] reasons = {
                    "Bị sốt, đau đầu cần nghỉ ngơi",
                    "Đau dạ dày, khó tiêu",
                    "Cảm cúm, sốt cao",
                    "Đi khám bệnh và điều trị",
                    "Tai nạn nhẹ cần nghỉ dưỡng",
                    "Đau lưng, không thể làm việc",
                    "Bị dị ứng, cần theo dõi"
                };
                yield reasons[random.nextInt(reasons.length)];
            }
            case KO_LUONG -> {
                String[] reasons = {
                    "Có việc gia đình đột xuất",
                    "Giải quyết thủ tục hành chính",
                    "Tham gia khóa học nâng cao",
                    "Lo việc tang lễ họ hàng",
                    "Đưa con đi khám bệnh",
                    "Sửa nhà cửa khẩn cấp"
                };
                yield reasons[random.nextInt(reasons.length)];
            }
            case KHAC -> {
                String[] reasons = {
                    "Nghỉ thai sản",
                    "Nghỉ chăm sóc con nhỏ",
                    "Tham gia đám cưới",
                    "Hoàn thiện thủ tục pháp lý",
                    "Tham gia khóa đào tạo bắt buộc"
                };
                yield reasons[random.nextInt(reasons.length)];
            }
        };
    }

    private String generateApprovalNote(Random random) {
        String[] notes = {
            "Đã duyệt, chúc bạn có kỳ nghỉ vui vẻ",
            "Phê duyệt. Nhớ bàn giao công việc trước khi nghỉ",
            "Đồng ý. Sức khỏe là vốn quý",
            "Đã phê duyệt đơn nghỉ phép",
            "OK, chúc mau khỏe",
            "Approved",
            null // Một số đơn không có ghi chú
        };
        return notes[random.nextInt(notes.length)];
    }

    private String generateRejectionNote(Random random) {
        String[] notes = {
            "Từ chối vì trùng thời gian cao điểm công việc",
            "Không đủ số ngày phép năm còn lại",
            "Cần có nhiều người trong nhóm trong thời gian này",
            "Vui lòng chọn thời gian khác, đã có quá nhiều người nghỉ cùng lúc",
            "Dự án quan trọng cần sự có mặt của bạn",
            "Không phê duyệt vì lý do chưa rõ ràng"
        };
        return notes[random.nextInt(notes.length)];
    }
}
