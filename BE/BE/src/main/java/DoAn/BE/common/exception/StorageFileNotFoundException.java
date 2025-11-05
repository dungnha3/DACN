package DoAn.BE.common.exception;

public class StorageFileNotFoundException extends RuntimeException {
    public StorageFileNotFoundException(String message) {
        super(message);
    }
}
