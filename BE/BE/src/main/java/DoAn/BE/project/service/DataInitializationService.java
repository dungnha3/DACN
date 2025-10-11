package DoAn.BE.project.service;

import DoAn.BE.project.entity.IssueStatus;
import DoAn.BE.project.repository.IssueStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private IssueStatusRepository issueStatusRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeIssueStatuses();
    }

    private void initializeIssueStatuses() {
        // Kiểm tra xem đã có dữ liệu chưa
        if (issueStatusRepository.count() == 0) {
            // Tạo các status mặc định
            IssueStatus toDo = new IssueStatus("To Do", 1, "#4BADE8");
            IssueStatus inProgress = new IssueStatus("In Progress", 2, "#FFA500");
            IssueStatus review = new IssueStatus("Review", 3, "#9C27B0");
            IssueStatus done = new IssueStatus("Done", 4, "#4CAF50");

            issueStatusRepository.save(toDo);
            issueStatusRepository.save(inProgress);
            issueStatusRepository.save(review);
            issueStatusRepository.save(done);

            System.out.println("✅ Initialized default issue statuses");
        }
    }
}
