FROM eclipse-temurin:17

# 作業ディレクトリ
WORKDIR /app

# Maven Wrapper と pom.xml を先にコピー（キャッシュ最適化）
COPY pom.xml mvnw /app/
COPY .mvn /app/.mvn

# 依存関係を先にダウンロード（キャッシュ用）
RUN ./mvnw dependency:go-offline

# ソースコードをコピー
COPY . /app

# Spring Boot 起動
CMD ["./mvnw", "spring-boot:run"]
