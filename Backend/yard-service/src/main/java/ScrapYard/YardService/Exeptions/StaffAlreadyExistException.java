package ScrapYard.YardService.Exeptions;


public class StaffAlreadyExistException extends RuntimeException{
    public StaffAlreadyExistException(String message){
        super(message);
    }
}
