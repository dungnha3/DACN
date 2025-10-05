package DoAn.BE.hr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bang_luong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BangLuong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bangluong_id")
    private Long bangluongId;

    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;

    @Column(name = "thang", nullable = false)
    private Integer thang;

    @Column(name = "nam", nullable = false)
    private Integer nam;

    @Column(name = "luong_co_ban", nullable = false, precision = 15, scale = 2)
    private BigDecimal luongCoBan;

    @Column(name = "phu_cap", precision = 15, scale = 2)
    private BigDecimal phuCap = BigDecimal.ZERO;

    @Column(name = "thuong", precision = 15, scale = 2)
    private BigDecimal thuong = BigDecimal.ZERO;

    @Column(name = "tong_luong", nullable = false, precision = 15, scale = 2)
    private BigDecimal tongLuong;

    @Column(name = "ngay_cong")
    private Integer ngayCong = 0;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        calculateTotalSalary();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateTotalSalary();
    }

    private void calculateTotalSalary() {
        BigDecimal base = luongCoBan != null ? luongCoBan : BigDecimal.ZERO;
        BigDecimal allowance = phuCap != null ? phuCap : BigDecimal.ZERO;
        BigDecimal bonus = thuong != null ? thuong : BigDecimal.ZERO;
        
        this.tongLuong = base.add(allowance).add(bonus);
    }

    public String getPeriod() {
        return String.format("%02d/%d", thang, nam);
    }

    public boolean isValidPeriod() {
        return thang >= 1 && thang <= 12 && nam >= 2020;
    }
}
