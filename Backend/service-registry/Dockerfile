FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY target/service-registry-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
RUN apt-get update && apt-get install -y curl