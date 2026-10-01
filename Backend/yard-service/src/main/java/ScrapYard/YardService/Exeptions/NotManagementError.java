package ScrapYard.YardService.Exeptions;

public class NotManagementError extends RuntimeException{
    public NotManagementError(String message){
        super(message);
    }
}
