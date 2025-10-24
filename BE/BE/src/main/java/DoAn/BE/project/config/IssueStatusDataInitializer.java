package DoAn.BE.project.config;

import DoAn.BE.project.entity.IssueStatus;
import DoAn.BE.project.repository.IssueStatusRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IssueStatusDataInitializer {
    
    @Bean
    CommandLineRunner initIssueStatuses(IssueStatusRepository repository) {
        return args -> {
            // Chỉ tạo nếu chưa có dữ liệu
            if (repository.count() == 0) {
                repository.save(new IssueStatus("To Do", 1, "#4BADE8"));
                repository.save(new IssueStatus("In Progress", 2, "#FFA500"));
                repository.save(new IssueStatus("Review", 3, "#9C27B0"));
                repository.save(new IssueStatus("Done", 4, "#4CAF50"));
                
                System.out.println("✅ Đã khởi tạo 4 Issue Statuses mặc định");
            }
        };
    }
}
