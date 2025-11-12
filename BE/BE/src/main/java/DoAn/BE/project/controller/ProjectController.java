package DoAn.BE.project.controller;

import DoAn.BE.project.dto.*;
import DoAn.BE.project.entity.ProjectMember.ProjectRole;
import DoAn.BE.project.service.ProjectService;
import DoAn.BE.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }
    
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(
            @Valid @RequestBody CreateProjectRequest request) {
        User currentUser = getCurrentUser();
        ProjectDTO project = projectService.createProject(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }
    
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProject(
            @PathVariable Long projectId) {
        User currentUser = getCurrentUser();
        ProjectDTO project = projectService.getProjectById(projectId, currentUser);
        return ResponseEntity.ok(project);
    }
    
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        User currentUser = getCurrentUser();
        List<ProjectDTO> projects = projectService.getAllProjects(currentUser);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectDTO>> getMyProjects() {
        User currentUser = getCurrentUser();
        List<ProjectDTO> projects = projectService.getMyProjects(currentUser);
        return ResponseEntity.ok(projects);
    }
    
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody UpdateProjectRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        ProjectDTO project = projectService.updateProject(projectId, request, userId);
        return ResponseEntity.ok(project);
    }
    
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        projectService.deleteProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
    
    // Member management endpoints
    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberDTO> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddMemberRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        ProjectMemberDTO member = projectService.addMember(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }
    
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<ProjectMemberDTO> members = projectService.getProjectMembers(projectId, userId);
        return ResponseEntity.ok(members);
    }
    
    @DeleteMapping("/{projectId}/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long memberId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        projectService.removeMember(projectId, memberId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{projectId}/members/{memberId}/role")
    public ResponseEntity<ProjectMemberDTO> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long memberId,
            @RequestParam ProjectRole role,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        ProjectMemberDTO member = projectService.updateMemberRole(projectId, memberId, role, userId);
        return ResponseEntity.ok(member);
    }
}
