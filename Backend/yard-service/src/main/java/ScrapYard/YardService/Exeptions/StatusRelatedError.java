package ScrapYard.YardService.Exeptions;

public class StatusRelatedError extends RuntimeException{
    public StatusRelatedError(String message){
        super(message);
    }
}
