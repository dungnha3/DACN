package DoAn.BE.project.controller;

import DoAn.BE.project.dto.ProjectMemberDTO;
import DoAn.BE.project.entity.ProjectMember;
import DoAn.BE.project.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project-members")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    /**
     * Thêm member vào project
     * POST /api/project-members
     */
    @PostMapping
    public ResponseEntity<ProjectMemberDTO> addMemberToProject(
            @RequestParam Long projectId,
            @RequestParam Long userId,
            @RequestParam ProjectMember.ProjectRole role) {
        ProjectMemberDTO member = projectMemberService.addMemberToProject(projectId, userId, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    /**
     * Lấy danh sách members của project
     * GET /api/project-members/project/{projectId}
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(@PathVariable Long projectId) {
        List<ProjectMemberDTO> members = projectMemberService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    /**
     * Lấy projects của user
     * GET /api/project-members/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectMemberDTO>> getUserProjects(@PathVariable Long userId) {
        List<ProjectMemberDTO> members = projectMemberService.getUserProjects(userId);
        return ResponseEntity.ok(members);
    }

    /**
     * Cập nhật role của member
     * PUT /api/project-members/{projectId}/{userId}
     */
    @PutMapping("/{projectId}/{userId}")
    public ResponseEntity<ProjectMemberDTO> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestParam ProjectMember.ProjectRole role) {
        ProjectMemberDTO member = projectMemberService.updateMemberRole(projectId, userId, role);
        return ResponseEntity.ok(member);
    }

    /**
     * Xóa member khỏi project
     * DELETE /api/project-members/{projectId}/{userId}
     */
    @DeleteMapping("/{projectId}/{userId}")
    public ResponseEntity<Map<String, String>> removeMemberFromProject(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        projectMemberService.removeMemberFromProject(projectId, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa member khỏi project thành công");
        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra user có phải member của project không
     * GET /api/project-members/check/{projectId}/{userId}
     */
    @GetMapping("/check/{projectId}/{userId}")
    public ResponseEntity<Map<String, Boolean>> isProjectMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        boolean isMember = projectMemberService.isProjectMember(projectId, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isMember", isMember);
        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra user có quyền quản lý project không
     * GET /api/project-members/can-manage/{projectId}/{userId}
     */
    @GetMapping("/can-manage/{projectId}/{userId}")
    public ResponseEntity<Map<String, Boolean>> canManageProject(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        boolean canManage = projectMemberService.canManageProject(projectId, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("canManage", canManage);
        return ResponseEntity.ok(response);
    }
}
