# backend-java

Minimal Spring Boot backend scaffold for Customo.

Features:
- H2 in-memory database for development
- Basic auth endpoints: register, login, me, profile, change-password
- JWT tokens (jjwt)

Run locally:

1. Build: mvn package
2. Run: java -jar target/backend-java-0.0.1-SNAPSHOT.jar

Run tests:

1. mvn test  # runs unit + integration test (integration uses random port)

Docker:

1. Build: docker build -t customo-backend-java .
2. Run: docker run -p 8080:8080 -e JWT_SECRET="your-very-secure-secret" customo-backend-java

Notes:
- This is an initial scaffold. For production use, switch to Postgres (or another RDBMS), set a secure JWT secret (via env var `JWT_SECRET` or `jwt.secret` in properties), and configure connection pooling.
- CI: there is a GitHub Actions workflow `.github/workflows/backend-java-smoke.yml` that builds and runs `mvn test` to validate auth flows.
