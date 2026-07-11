# Farm Twin AI — Backend

Spring Boot 3 API gateway. Validates incoming requests and proxies them to
the ML microservice.

## Run locally

```bash
mvn spring-boot:run
```

Runs on port `8080`. Configure the ML service URL via `ML_SERVICE_URL`
(defaults to `http://localhost:8000`), e.g.:

```bash
ML_SERVICE_URL=http://localhost:8000 mvn spring-boot:run
```

## Structure

```
src/main/java/com/farmtwin/
├── FarmTwinApplication.java
├── controller/    One REST controller per feature (+ health check)
├── service/       MLClientService — WebClient proxy to the ML service
├── dto/           Request records with Jakarta Bean Validation
└── config/        CORS config, WebClient bean
```

## Notes

- Uses an in-memory H2 database (`spring.datasource.url` in
  `application.yml`) as a placeholder for persistence — swap for
  Postgres/MySQL when you add farm profiles, sensor history, etc.
- Responses are currently passed through from the ML service as raw
  `Map` objects for simplicity. For stricter typing, add matching
  response DTOs in `dto/` and deserialize in `MLClientService`.
