FROM maven:3.9.8-amazoncorretto-21

EXPOSE 8080
EXPOSE 3000
EXPOSE 5000
EXPOSE 50000

COPY . .

RUN  mvn package -ntp -Dmaven.test.skip

ENTRYPOINT ["java","-jar","target/spotme-rest-0.0.1-SNAPSHOT.jar"]




