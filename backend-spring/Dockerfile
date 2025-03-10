FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy Maven wrapper and project files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Expose the port
EXPOSE 4000

# Run the app directly
CMD ["./mvnw", "spring-boot:run"]