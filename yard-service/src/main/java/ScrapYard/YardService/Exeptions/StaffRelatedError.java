package ScrapYard.YardService.Exeptions;

public class StaffRelatedError extends RuntimeException{
    public StaffRelatedError(String message){
        super(message);
    }
}
