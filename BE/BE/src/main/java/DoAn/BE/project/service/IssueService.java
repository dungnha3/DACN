package DoAn.BE.project.service;

import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.project.dto.CreateIssueRequest;
import DoAn.BE.project.dto.IssueDTO;
import DoAn.BE.project.entity.Issue;
import DoAn.BE.project.entity.IssueStatus;
import DoAn.BE.project.entity.Project;
import DoAn.BE.project.mapper.IssueMapper;
import DoAn.BE.project.repository.IssueRepository;
import DoAn.BE.project.repository.IssueStatusRepository;
import DoAn.BE.project.repository.ProjectRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueStatusRepository issueStatusRepository;

    @Autowired
    private IssueMapper issueMapper;

    /**
     * Tạo issue mới
     */
    public IssueDTO createIssue(CreateIssueRequest request) {
        // Lấy project
        Project project = projectRepository.findById(request.getProjectId())
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));

        // Lấy reporter
        User reporter = userRepository.findById(request.getReporterId())
            .orElseThrow(() -> new EntityNotFoundException("Reporter không tồn tại"));

        // Lấy assignee nếu có
        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("Assignee không tồn tại"));
        }

        // Lấy status mặc định (To Do)
        IssueStatus status = issueStatusRepository.findById(1)
            .orElseThrow(() -> new EntityNotFoundException("Issue status không tồn tại"));

        // Tạo issue key
        String issueKey = generateIssueKey(project);

        // Tạo issue
        Issue issue = new Issue();
        issue.setProject(project);
        issue.setIssueKey(issueKey);
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setIssueStatus(status);
        issue.setPriority(request.getPriority());
        issue.setReporter(reporter);
        issue.setAssignee(assignee);
        issue.setEstimatedHours(request.getEstimatedHours());
        issue.setDueDate(request.getDueDate());

        Issue savedIssue = issueRepository.save(issue);
        return issueMapper.toDTO(savedIssue);
    }

    /**
     * Lấy issue theo ID
     */
    public IssueDTO getIssueById(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new EntityNotFoundException("Issue không tồn tại"));
        return issueMapper.toDTO(issue);
    }

    /**
     * Lấy issues theo project
     */
    public List<IssueDTO> getIssuesByProject(Long projectId) {
        List<Issue> issues = issueRepository.findByProject_ProjectId(projectId);
        return issueMapper.toDTOList(issues);
    }

    /**
     * Lấy issues theo assignee
     */
    public List<IssueDTO> getIssuesByAssignee(Long assigneeId) {
        List<Issue> issues = issueRepository.findByAssignee_UserId(assigneeId);
        return issueMapper.toDTOList(issues);
    }

    /**
     * Lấy issues theo reporter
     */
    public List<IssueDTO> getIssuesByReporter(Long reporterId) {
        List<Issue> issues = issueRepository.findByReporter_UserId(reporterId);
        return issueMapper.toDTOList(issues);
    }

    /**
     * Cập nhật issue
     */
    public IssueDTO updateIssue(Long issueId, CreateIssueRequest request) {
        Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new EntityNotFoundException("Issue không tồn tại"));

        // Cập nhật thông tin
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setEstimatedHours(request.getEstimatedHours());
        issue.setDueDate(request.getDueDate());
        issue.setPriority(request.getPriority());

        // Cập nhật assignee
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("Assignee không tồn tại"));
            issue.setAssignee(assignee);
        }

        // Cập nhật status
        if (request.getStatusId() != null) {
            IssueStatus status = issueStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new EntityNotFoundException("Issue status không tồn tại"));
            issue.setIssueStatus(status);
        }

        Issue savedIssue = issueRepository.save(issue);
        return issueMapper.toDTO(savedIssue);
    }

    /**
     * Xóa issue
     */
    public void deleteIssue(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new EntityNotFoundException("Issue không tồn tại"));
        issueRepository.delete(issue);
    }

    /**
     * Thay đổi status của issue
     */
    public IssueDTO changeIssueStatus(Long issueId, Integer statusId) {
        Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new EntityNotFoundException("Issue không tồn tại"));

        IssueStatus status = issueStatusRepository.findById(statusId)
            .orElseThrow(() -> new EntityNotFoundException("Issue status không tồn tại"));

        issue.setIssueStatus(status);
        Issue savedIssue = issueRepository.save(issue);
        return issueMapper.toDTO(savedIssue);
    }

    /**
     * Assign issue cho user
     */
    public IssueDTO assignIssue(Long issueId, Long assigneeId) {
        Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new EntityNotFoundException("Issue không tồn tại"));

        User assignee = userRepository.findById(assigneeId)
            .orElseThrow(() -> new EntityNotFoundException("Assignee không tồn tại"));

        issue.setAssignee(assignee);
        Issue savedIssue = issueRepository.save(issue);
        return issueMapper.toDTO(savedIssue);
    }

    /**
     * Tạo issue key tự động
     */
    private String generateIssueKey(Project project) {
        String projectKey = project.getKeyProject();
        List<Issue> projectIssues = issueRepository.findByProject_ProjectId(project.getProjectId());
        int nextNumber = projectIssues.size() + 1;
        return projectKey + "-" + String.format("%03d", nextNumber);
    }
}
