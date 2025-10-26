# backend-java

Minimal Spring Boot backend scaffold for Customo.

Features:
- H2 in-memory database for development
- Basic auth endpoints: register, login, me, profile, change-password
- JWT tokens (jjwt)

Run locally:

1. Build: mvn package
2. Run: java -jar target/backend-java-0.0.1-SNAPSHOT.jar

Docker:
  docker build -t customo-backend-java .

Notes:
- This is an initial scaffold. For production use, switch to Postgres (or another RDBMS), set a secure JWT secret, and configure connection pooling.
