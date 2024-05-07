# ビルド環境
FROM openjdk:17 AS build
WORKDIR /app
COPY . .
RUN ./gradlew build

# 実行環境
FROM openjdk:17-slim
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
