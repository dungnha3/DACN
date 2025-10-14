package DoAn.BE.project.controller;

import DoAn.BE.project.dto.CreateIssueRequest;
import DoAn.BE.project.dto.IssueDTO;
import DoAn.BE.project.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    /**
     * Tạo issue mới
     * POST /api/issues
     */
    @PostMapping
    public ResponseEntity<IssueDTO> createIssue(@Valid @RequestBody CreateIssueRequest request) {
        IssueDTO issue = issueService.createIssue(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(issue);
    }

    /**
     * Lấy issue theo ID
     * GET /api/issues/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable Long id) {
        IssueDTO issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    /**
     * Lấy issues theo project
     * GET /api/issues/project/{projectId}
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<IssueDTO>> getIssuesByProject(@PathVariable Long projectId) {
        List<IssueDTO> issues = issueService.getIssuesByProject(projectId);
        return ResponseEntity.ok(issues);
    }

    /**
     * Lấy issues theo assignee
     * GET /api/issues/assignee/{assigneeId}
     */
    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<IssueDTO>> getIssuesByAssignee(@PathVariable Long assigneeId) {
        List<IssueDTO> issues = issueService.getIssuesByAssignee(assigneeId);
        return ResponseEntity.ok(issues);
    }

    /**
     * Lấy issues theo reporter
     * GET /api/issues/reporter/{reporterId}
     */
    @GetMapping("/reporter/{reporterId}")
    public ResponseEntity<List<IssueDTO>> getIssuesByReporter(@PathVariable Long reporterId) {
        List<IssueDTO> issues = issueService.getIssuesByReporter(reporterId);
        return ResponseEntity.ok(issues);
    }

    /**
     * Cập nhật issue
     * PUT /api/issues/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<IssueDTO> updateIssue(
            @PathVariable Long id,
            @Valid @RequestBody CreateIssueRequest request) {
        IssueDTO issue = issueService.updateIssue(id, request);
        return ResponseEntity.ok(issue);
    }

    /**
     * Xóa issue
     * DELETE /api/issues/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa issue thành công");
        return ResponseEntity.ok(response);
    }

    /**
     * Thay đổi status của issue
     * PATCH /api/issues/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<IssueDTO> changeIssueStatus(
            @PathVariable Long id,
            @RequestParam Integer statusId) {
        IssueDTO issue = issueService.changeIssueStatus(id, statusId);
        return ResponseEntity.ok(issue);
    }

    /**
     * Assign issue cho user
     * PATCH /api/issues/{id}/assign
     */
    @PatchMapping("/{id}/assign")
    public ResponseEntity<IssueDTO> assignIssue(
            @PathVariable Long id,
            @RequestParam Long assigneeId) {
        IssueDTO issue = issueService.assignIssue(id, assigneeId);
        return ResponseEntity.ok(issue);
    }
}
