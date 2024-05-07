# ビルド環境
FROM openjdk:17-buster AS build
WORKDIR /app
COPY . .

# 必要なツールをインストール
RUN apt-get update && apt-get install -y \
    findutils \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y findutils
RUN chmod +x gradlew
RUN ./gradlew build --stacktrace
RUN ./gradlew build

# 実行環境
FROM openjdk:17-slim-buster
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
