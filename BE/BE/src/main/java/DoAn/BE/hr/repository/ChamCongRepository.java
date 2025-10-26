package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.ChamCong;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChamCongRepository extends JpaRepository<ChamCong, Long> {
    
    // Tìm theo nhân viên
    List<ChamCong> findByNhanVien_NhanvienIdOrderByNgayChamDesc(Long nhanvienId);
    
    // Tìm theo khoảng thời gian
    List<ChamCong> findByNgayChamBetween(LocalDate start, LocalDate end);
    
    // Tìm theo nhân viên và khoảng thời gian
    List<ChamCong> findByNhanVien_NhanvienIdAndNgayChamBetween(Long nhanvienId, LocalDate start, LocalDate end);
    
    // Đếm số ngày công (trạng thái hợp lệ)
    @Query("SELECT COUNT(cc) FROM ChamCong cc WHERE cc.nhanVien.nhanvienId = :nhanvienId " +
           "AND cc.ngayCham BETWEEN :startDate AND :endDate " +
           "AND cc.trangThai IN ('DU_GIO', 'DI_TRE', 'VE_SOM')")
    int countWorkingDaysByNhanVienAndMonth(@Param("nhanvienId") Long nhanvienId, 
                                           @Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    // Tính tổng giờ làm việc
    @Query("SELECT COALESCE(SUM(cc.soGioLam), 0) FROM ChamCong cc WHERE cc.nhanVien.nhanvienId = :nhanvienId " +
           "AND cc.ngayCham BETWEEN :startDate AND :endDate")
    BigDecimal sumWorkingHoursByNhanVienAndMonth(@Param("nhanvienId") Long nhanvienId, 
                                                  @Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);
    
    // Đếm số ngày đi trễ (dựa vào gioVao > 08:00)
    @Query("SELECT COUNT(cc) FROM ChamCong cc WHERE cc.nhanVien.nhanvienId = :nhanvienId " +
           "AND cc.ngayCham BETWEEN :startDate AND :endDate " +
           "AND HOUR(cc.gioVao) * 60 + MINUTE(cc.gioVao) > 480")
    long countLateDaysByNhanVienAndMonth(@Param("nhanvienId") Long nhanvienId, 
                                         @Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
    
    // Đếm số ngày về sớm (dựa vào gioRa < 17:00)
    @Query("SELECT COUNT(cc) FROM ChamCong cc WHERE cc.nhanVien.nhanvienId = :nhanvienId " +
           "AND cc.ngayCham BETWEEN :startDate AND :endDate " +
           "AND cc.gioRa IS NOT NULL " +
           "AND HOUR(cc.gioRa) * 60 + MINUTE(cc.gioRa) < 1020")
    long countEarlyLeaveDaysByNhanVienAndMonth(@Param("nhanvienId") Long nhanvienId, 
                                               @Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);
}


