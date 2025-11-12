package DoAn.BE.project.controller;

import DoAn.BE.project.dto.CreateIssueRequest;
import DoAn.BE.project.dto.IssueDTO;
import DoAn.BE.project.dto.UpdateIssueRequest;
import DoAn.BE.project.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
    
    private final IssueService issueService;
    
    @PostMapping
    public ResponseEntity<IssueDTO> createIssue(
            @Valid @RequestBody CreateIssueRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        IssueDTO issue = issueService.createIssue(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(issue);
    }
    
    @GetMapping("/{issueId}")
    public ResponseEntity<IssueDTO> getIssue(
            @PathVariable Long issueId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        IssueDTO issue = issueService.getIssueById(issueId, userId);
        return ResponseEntity.ok(issue);
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<IssueDTO>> getProjectIssues(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<IssueDTO> issues = issueService.getProjectIssues(projectId, userId);
        return ResponseEntity.ok(issues);
    }
    
    @GetMapping("/project/{projectId}/backlog")
    public ResponseEntity<List<IssueDTO>> getProjectBacklog(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<IssueDTO> issues = issueService.getProjectBacklog(projectId, userId);
        return ResponseEntity.ok(issues);
    }
    
    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<IssueDTO>> getSprintIssues(
            @PathVariable Long sprintId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<IssueDTO> issues = issueService.getSprintIssues(sprintId, userId);
        return ResponseEntity.ok(issues);
    }
    
    @GetMapping("/my-issues")
    public ResponseEntity<List<IssueDTO>> getMyIssues(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<IssueDTO> issues = issueService.getMyIssues(userId);
        return ResponseEntity.ok(issues);
    }
    
    @GetMapping("/my-reported")
    public ResponseEntity<List<IssueDTO>> getMyReportedIssues(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<IssueDTO> issues = issueService.getMyReportedIssues(userId);
        return ResponseEntity.ok(issues);
    }
    
    @PutMapping("/{issueId}")
    public ResponseEntity<IssueDTO> updateIssue(
            @PathVariable Long issueId,
            @Valid @RequestBody UpdateIssueRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        IssueDTO issue = issueService.updateIssue(issueId, request, userId);
        return ResponseEntity.ok(issue);
    }
    
    @DeleteMapping("/{issueId}")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable Long issueId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        issueService.deleteIssue(issueId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{issueId}/assign/{assigneeId}")
    public ResponseEntity<IssueDTO> assignIssue(
            @PathVariable Long issueId,
            @PathVariable Long assigneeId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        IssueDTO issue = issueService.assignIssue(issueId, assigneeId, userId);
        return ResponseEntity.ok(issue);
    }
    
    @PatchMapping("/{issueId}/status/{statusId}")
    public ResponseEntity<IssueDTO> changeIssueStatus(
            @PathVariable Long issueId,
            @PathVariable Integer statusId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        IssueDTO issue = issueService.changeIssueStatus(issueId, statusId, userId);
        return ResponseEntity.ok(issue);
    }
}
