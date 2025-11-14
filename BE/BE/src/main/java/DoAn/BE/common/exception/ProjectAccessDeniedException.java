package DoAn.BE.common.exception;

public class ProjectAccessDeniedException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public ProjectAccessDeniedException(String message) {
        super(message);
    }
}
