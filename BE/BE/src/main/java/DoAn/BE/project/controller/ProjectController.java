package DoAn.BE.project.controller;

import DoAn.BE.project.dto.CreateProjectRequest;
import DoAn.BE.project.dto.ProjectDTO;
import DoAn.BE.project.entity.Project;
import DoAn.BE.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * Tạo project mới
     * POST /api/projects
     */
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectRequest request) {
        // TODO: Get current user from JWT token
        Long currentUserId = 1L; // Placeholder for testing
        
        ProjectDTO project = projectService.createProject(request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    /**
     * Lấy project theo ID
     * GET /api/projects/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Lấy tất cả projects
     * GET /api/projects
     */
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * Lấy projects theo user
     * GET /api/projects/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUser(@PathVariable Long userId) {
        List<ProjectDTO> projects = projectService.getProjectsByUser(userId);
        return ResponseEntity.ok(projects);
    }

    /**
     * Lấy projects đang active
     * GET /api/projects/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<ProjectDTO>> getActiveProjects() {
        List<ProjectDTO> projects = projectService.getActiveProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * Cập nhật project
     * PUT /api/projects/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectDTO project = projectService.updateProject(id, request);
        return ResponseEntity.ok(project);
    }

    /**
     * Xóa project (soft delete)
     * DELETE /api/projects/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa project thành công");
        return ResponseEntity.ok(response);
    }

    /**
     * Kích hoạt project
     * PATCH /api/projects/{id}/activate
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ProjectDTO> activateProject(@PathVariable Long id) {
        ProjectDTO project = projectService.activateProject(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Thay đổi trạng thái project
     * PATCH /api/projects/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectDTO> changeProjectStatus(
            @PathVariable Long id,
            @RequestParam Project.ProjectStatus status) {
        ProjectDTO project = projectService.changeProjectStatus(id, status);
        return ResponseEntity.ok(project);
    }

    /**
     * Tìm kiếm projects
     * GET /api/projects/search?keyword=xxx
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjects(@RequestParam String keyword) {
        List<ProjectDTO> projects = projectService.searchProjects(keyword);
        return ResponseEntity.ok(projects);
    }
}
