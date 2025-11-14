package DoAn.BE.common.exception;

public class StorageFileNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public StorageFileNotFoundException(String message) {
        super(message);
    }
}
