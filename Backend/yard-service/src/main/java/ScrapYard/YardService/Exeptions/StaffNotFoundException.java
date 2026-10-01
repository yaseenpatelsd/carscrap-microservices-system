package ScrapYard.YardService.Exeptions;

public class StaffNotFoundException extends RuntimeException{
    public StaffNotFoundException(String message){
        super(message);
    }
}
