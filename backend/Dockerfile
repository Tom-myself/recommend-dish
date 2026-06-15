FROM eclipse-temurin:17

# 作業ディレクトリ
WORKDIR /app

# Maven Wrapper と pom.xml を先にコピー（キャッシュ最適化）
COPY pom.xml mvnw /app/
COPY .mvn /app/.mvn
RUN chmod +x /app/mvnw

# 依存関係を先にダウンロード（キャッシュ用）
RUN ./mvnw dependency:go-offline

# ソースコードをコピー
COPY . /app

# COPY . で mvnw が上書きされるため、再度実行権限を付与
RUN chmod +x /app/mvnw

# Spring Boot 起動
CMD ["./mvnw", "spring-boot:run"]
