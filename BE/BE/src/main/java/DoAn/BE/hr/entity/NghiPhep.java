package DoAn.BE.hr.entity;

import DoAn.BE.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nghi_phep")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NghiPhep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nghiphep_id")
    private Long nghiphepId;

    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_phep", nullable = false, length = 50)
    private LoaiPhep loaiPhep;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;

    @Column(name = "so_ngay", nullable = false)
    private Integer soNgay;

    @Column(name = "ly_do", length = 500, columnDefinition = "NVARCHAR(500)")
    private String lyDo;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", length = 30)
    private TrangThaiNghiPhep trangThai = TrangThaiNghiPhep.CHO_DUYET;

    @ManyToOne
    @JoinColumn(name = "nguoi_duyet_id")
    private User nguoiDuyet;

    @Column(name = "ngay_duyet")
    private LocalDateTime ngayDuyet;

    @Column(name = "ghi_chu_duyet", length = 500, columnDefinition = "NVARCHAR(500)")
    private String ghiChuDuyet;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        calculateDays();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateDays();
    }

    private void calculateDays() {
        if (ngayBatDau != null && ngayKetThuc != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(ngayBatDau, ngayKetThuc) + 1;
            this.soNgay = (int) days;
        }
    }

    public void approve(User approver, String note) {
        this.trangThai = TrangThaiNghiPhep.DA_DUYET;
        this.nguoiDuyet = approver;
        this.ngayDuyet = LocalDateTime.now();
        this.ghiChuDuyet = note;
    }

    public void reject(User approver, String note) {
        this.trangThai = TrangThaiNghiPhep.TU_CHOI;
        this.nguoiDuyet = approver;
        this.ngayDuyet = LocalDateTime.now();
        this.ghiChuDuyet = note;
    }

    public boolean isPending() {
        return trangThai == TrangThaiNghiPhep.CHO_DUYET;
    }

    public boolean isApproved() {
        return trangThai == TrangThaiNghiPhep.DA_DUYET;
    }

    public boolean isRejected() {
        return trangThai == TrangThaiNghiPhep.TU_CHOI;
    }

    public enum LoaiPhep {
        PHEP_NAM,
        OM,
        KO_LUONG,
        KHAC
    }

    public enum TrangThaiNghiPhep {
        CHO_DUYET,
        DA_DUYET,
        TU_CHOI
    }
}
