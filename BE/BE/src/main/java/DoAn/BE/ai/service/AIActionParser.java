package DoAn.BE.ai.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import DoAn.BE.ai.dto.AIActionDTO;
import DoAn.BE.ai.dto.AIActionDTO.ActionStatus;
import DoAn.BE.ai.dto.AIActionDTO.ActionType;
import lombok.extern.slf4j.Slf4j;

/**
 * Service phân tích response từ AI để trích xuất các action
 * Tìm các pattern như "tạo dự án", "tạo task", etc.
 */
@Service
@Slf4j
public class AIActionParser {
    
    // Patterns để detect intent tạo project
    private static final Pattern CREATE_PROJECT_PATTERN = Pattern.compile(
            "(?i)(tạo|create|khởi tạo|thêm)\\s*(dự án|project|prj)\\s*[\"']?([^\"'\\n]+)[\"']?",
            Pattern.UNICODE_CASE
    );
    
    // Patterns để detect intent tạo task
    private static final Pattern CREATE_TASK_PATTERN = Pattern.compile(
            "(?i)(tạo|create|thêm|add)\\s*(task|tác vụ|công việc|issue|việc)\\s*[\"']?([^\"'\\n]+)[\"']?",
            Pattern.UNICODE_CASE
    );
    
    // Pattern để detect intent tạo sprint
    private static final Pattern CREATE_SPRINT_PATTERN = Pattern.compile(
            "(?i)(tạo|create|khởi tạo|bắt đầu)\\s*(sprint)\\s*[\"']?([^\"'\\n]*)[\"']?",
            Pattern.UNICODE_CASE
    );
    
    // Pattern để detect danh sách tasks (bullet points)
    private static final Pattern TASK_LIST_PATTERN = Pattern.compile(
            "(?m)^\\s*[-*•]\\s*(.+)$"
    );
    
    /**
     * Phân tích message từ user để detect action intent
     */
    public List<AIActionDTO> parseUserMessage(String message, Long projectId) {
        List<AIActionDTO> actions = new ArrayList<>();
        
        // Check for project creation intent
        Matcher projectMatcher = CREATE_PROJECT_PATTERN.matcher(message);
        if (projectMatcher.find()) {
            String projectName = projectMatcher.group(3).trim();
            actions.add(createProjectAction(projectName, message));
        }
        
        // Check for task creation intent
        Matcher taskMatcher = CREATE_TASK_PATTERN.matcher(message);
        if (taskMatcher.find() && projectId != null) {
            String taskTitle = taskMatcher.group(3).trim();
            actions.add(createTaskAction(taskTitle, projectId, message));
        }
        
        // Check for sprint creation intent
        Matcher sprintMatcher = CREATE_SPRINT_PATTERN.matcher(message);
        if (sprintMatcher.find() && projectId != null) {
            String sprintName = sprintMatcher.group(3).trim();
            if (sprintName.isEmpty()) {
                sprintName = "Sprint mới";
            }
            actions.add(createSprintAction(sprintName, projectId));
        }
        
        return actions;
    }
    
    /**
     * Phân tích response từ AI để tìm các actions được gợi ý
     * AI có thể trả về JSON actions trong response
     */
    public List<AIActionDTO> parseAIResponse(String aiResponse, Long projectId) {
        List<AIActionDTO> actions = new ArrayList<>();
        
        // Tìm JSON action blocks trong response
        Pattern jsonPattern = Pattern.compile("```json\\s*\\{[^}]+\"actionType\"[^}]+\\}\\s*```", Pattern.DOTALL);
        Matcher jsonMatcher = jsonPattern.matcher(aiResponse);
        
        while (jsonMatcher.find()) {
            try {
                String jsonBlock = jsonMatcher.group()
                        .replace("```json", "")
                        .replace("```", "")
                        .trim();
                AIActionDTO action = parseJsonAction(jsonBlock, projectId);
                if (action != null) {
                    actions.add(action);
                }
            } catch (Exception e) {
                log.warn("Failed to parse AI action JSON: {}", e.getMessage());
            }
        }
        
        // Fallback: parse task list from response
        if (actions.isEmpty() && projectId != null) {
            List<String> taskTitles = extractTaskListFromResponse(aiResponse);
            if (!taskTitles.isEmpty()) {
                actions.add(createMultipleTasksAction(taskTitles, projectId));
            }
        }
        
        return actions;
    }
    
    /**
     * Kiểm tra user message có yêu cầu tạo mới không
     */
    public boolean isCreateRequest(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("tạo") || 
               lowerMessage.contains("create") ||
               lowerMessage.contains("thêm") ||
               lowerMessage.contains("add") ||
               lowerMessage.contains("khởi tạo");
    }
    
    /**
     * Kiểm tra user message có yêu cầu liên quan đến project
     */
    public boolean isProjectRelated(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("dự án") || 
               lowerMessage.contains("project") ||
               lowerMessage.contains("prj");
    }
    
    /**
     * Kiểm tra user message có yêu cầu liên quan đến task
     */
    public boolean isTaskRelated(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("task") || 
               lowerMessage.contains("tác vụ") ||
               lowerMessage.contains("công việc") ||
               lowerMessage.contains("issue") ||
               lowerMessage.contains("việc");
    }
    
    // ==================== Private Helper Methods ====================
    
    private AIActionDTO createProjectAction(String name, String fullMessage) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        
        // Try to extract description from message
        String description = extractDescription(fullMessage, name);
        if (description != null) {
            data.put("description", description);
        }
        
        return AIActionDTO.builder()
                .actionType(ActionType.CREATE_PROJECT)
                .status(ActionStatus.PENDING)
                .data(data)
                .message(String.format("Bạn muốn tạo dự án \"%s\"?", name))
                .build();
    }
    
    private AIActionDTO createTaskAction(String title, Long projectId, String fullMessage) {
        Map<String, Object> data = new HashMap<>();
        data.put("title", title);
        data.put("projectId", projectId);
        
        // Try to extract priority
        String priority = extractPriority(fullMessage);
        if (priority != null) {
            data.put("priority", priority);
        }
        
        return AIActionDTO.builder()
                .actionType(ActionType.CREATE_ISSUE)
                .status(ActionStatus.PENDING)
                .data(data)
                .message(String.format("Bạn muốn tạo task \"%s\"?", title))
                .build();
    }
    
    private AIActionDTO createSprintAction(String name, Long projectId) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        data.put("projectId", projectId);
        data.put("durationDays", 14); // Default 2 weeks
        
        return AIActionDTO.builder()
                .actionType(ActionType.CREATE_SPRINT)
                .status(ActionStatus.PENDING)
                .data(data)
                .message(String.format("Bạn muốn tạo sprint \"%s\"?", name))
                .build();
    }
    
    private AIActionDTO createMultipleTasksAction(List<String> taskTitles, Long projectId) {
        Map<String, Object> data = new HashMap<>();
        data.put("projectId", projectId);
        
        List<Map<String, Object>> issues = new ArrayList<>();
        for (String title : taskTitles) {
            Map<String, Object> issue = new HashMap<>();
            issue.put("title", title);
            issue.put("priority", "MEDIUM");
            issues.add(issue);
        }
        data.put("issues", issues);
        
        return AIActionDTO.builder()
                .actionType(ActionType.CREATE_MULTIPLE_ISSUES)
                .status(ActionStatus.PENDING)
                .data(data)
                .message(String.format("Tạo %d tasks từ gợi ý của AI?", taskTitles.size()))
                .build();
    }
    
    private List<String> extractTaskListFromResponse(String response) {
        List<String> tasks = new ArrayList<>();
        Matcher matcher = TASK_LIST_PATTERN.matcher(response);
        
        while (matcher.find()) {
            String task = matcher.group(1).trim();
            // Filter out non-task items
            if (task.length() > 5 && task.length() < 200 && 
                !task.toLowerCase().startsWith("lưu ý") &&
                !task.toLowerCase().startsWith("note")) {
                tasks.add(task);
            }
        }
        
        return tasks;
    }
    
    private String extractDescription(String message, String name) {
        // Simple extraction: get text after project name
        int nameIndex = message.indexOf(name);
        if (nameIndex >= 0 && nameIndex + name.length() < message.length()) {
            String remaining = message.substring(nameIndex + name.length()).trim();
            if (remaining.length() > 10) {
                return remaining;
            }
        }
        return null;
    }
    
    private String extractPriority(String message) {
        String lowerMessage = message.toLowerCase();
        if (lowerMessage.contains("khẩn cấp") || lowerMessage.contains("critical") || lowerMessage.contains("gấp")) {
            return "CRITICAL";
        } else if (lowerMessage.contains("cao") || lowerMessage.contains("high") || lowerMessage.contains("quan trọng")) {
            return "HIGH";
        } else if (lowerMessage.contains("thấp") || lowerMessage.contains("low")) {
            return "LOW";
        }
        return "MEDIUM";
    }
    
    @SuppressWarnings("unchecked")
    private AIActionDTO parseJsonAction(String json, Long projectId) {
        // Simple JSON parsing without external library
        // In production, use Jackson ObjectMapper
        try {
            ActionType actionType = ActionType.NONE;
            Map<String, Object> data = new HashMap<>();
            
            if (json.contains("CREATE_PROJECT")) {
                actionType = ActionType.CREATE_PROJECT;
            } else if (json.contains("CREATE_ISSUE") || json.contains("CREATE_TASK")) {
                actionType = ActionType.CREATE_ISSUE;
                data.put("projectId", projectId);
            } else if (json.contains("CREATE_SPRINT")) {
                actionType = ActionType.CREATE_SPRINT;
                data.put("projectId", projectId);
            }
            
            // Extract name/title from JSON
            Pattern namePattern = Pattern.compile("\"(?:name|title)\"\\s*:\\s*\"([^\"]+)\"");
            Matcher nameMatcher = namePattern.matcher(json);
            if (nameMatcher.find()) {
                String fieldName = actionType == ActionType.CREATE_ISSUE ? "title" : "name";
                data.put(fieldName, nameMatcher.group(1));
            }
            
            if (actionType != ActionType.NONE) {
                return AIActionDTO.builder()
                        .actionType(actionType)
                        .status(ActionStatus.PENDING)
                        .data(data)
                        .build();
            }
        } catch (Exception e) {
            log.warn("Failed to parse action JSON: {}", e.getMessage());
        }
        return null;
    }
}
