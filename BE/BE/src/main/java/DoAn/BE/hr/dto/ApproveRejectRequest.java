package DoAn.BE.hr.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproveRejectRequest {
    
    @NotNull(message = "ID người duyệt không được để trống")
    private Long nguoiDuyetId;
    
    private String ghiChu;
}
