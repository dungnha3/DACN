package DoAn.BE.hr.entity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cham_cong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChamCong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chamcong_id")
    private Long chamcongId;

    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;

    @Column(name = "ngay_cham", nullable = false)
    private LocalDate ngayCham;

    @Column(name = "gio_vao")
    private LocalTime gioVao;

    @Column(name = "gio_ra")
    private LocalTime gioRa;

    @Column(name = "so_gio_lam", precision = 5, scale = 2)
    private BigDecimal soGioLam = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", length = 30)
    private TrangThaiChamCong trangThai;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        calculateWorkingHours();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateWorkingHours();
    }

    private void calculateWorkingHours() {
        if (gioVao != null && gioRa != null) {
            long minutes = java.time.Duration.between(gioVao, gioRa).toMinutes();
            this.soGioLam = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        }
    }

    public boolean isLate() {
        // Giả sử giờ làm việc bắt đầu lúc 8:00
        return gioVao != null && gioVao.isAfter(LocalTime.of(8, 0));
    }

    public boolean isEarlyLeave() {
        // Giả sử giờ làm việc kết thúc lúc 17:00
        return gioRa != null && gioRa.isBefore(LocalTime.of(17, 0));
    }

    public enum TrangThaiChamCong {
        DI_TRE,
        VE_SOM,
        DU_GIO,
        NGHI_PHEP,
        NGHI_KHONG_PHEP
    }
}
