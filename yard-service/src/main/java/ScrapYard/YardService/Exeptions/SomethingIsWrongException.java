package ScrapYard.YardService.Exeptions;

public class SomethingIsWrongException extends RuntimeException{
    public SomethingIsWrongException(String message){
        super(message);
    }
}
