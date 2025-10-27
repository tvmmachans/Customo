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




You are a senior full-stack engineer and software architect.
Your mission is to analyze, fix, and enhance every part of my website project — frontend, backend, and database — to make it clean, fast, scalable, and professional.

──────────────────────────────

🧩 TECH STACK

──────────────────────────────

Frontend: React.js, Tailwind CSS, Framer Motion

Backend: Spring Boot (Java)

Database: MySQL

Other tools: Axios/Fetch API, dotenv, Maven/Gradle, Hibernate/JPA (if used)

🔹 1. FRONTEND IMPROVEMENT (React + Tailwind + Framer Motion)

Tasks:

Fix broken components, imports, routing, and state management.

Ensure all pages (Home, Products, Cart, Signup/Login, Checkout) load and display correctly.

Verify frontend-backend API connections using Axios.

Improve UI/UX design: consistent colors, spacing, typography, and motion.

Make the site fully responsive for mobile, tablet, and desktop.

Add clean loading spinners, error messages, and toast notifications.

Simplify structure using folders:

src/
├─ components/
├─ pages/
├─ context/
├─ services/
└─ assets/


Optimize performance:

Use React.memo, useCallback, and lazy loading.

Remove unused imports and console logs.

Optimize large images and static files.

Integrate environment variables (.env) for backend API base URL.

🔹 2. BACKEND IMPROVEMENT (Spring Boot)

Tasks:

Fix all controller, service, and repository errors.

Ensure APIs (Login, Signup, Product, Cart, Orders) work perfectly and follow RESTful conventions.

Implement proper Model-View-Service architecture:

Controller → Service → Repository layers cleanly separated.

Configure CORS to allow React frontend communication.

Secure backend routes:

Encrypt passwords with BCrypt.

Add JWT authentication or session-based login.

Protect routes requiring authorization.

Add proper exception handling using @ControllerAdvice and custom error responses.

Validate incoming data with Hibernate Validator annotations (e.g. @NotBlank, @Email).

Use Spring Data JPA with clean entity relationships:

One-to-Many, Many-to-Many mappings.

Clean up dependencies in pom.xml or build.gradle.

Add logging (SLF4J) and global error messages.

Optimize API performance:

Use pagination for large data.

Reduce redundant queries.

Use DTOs to avoid heavy entity loads.

🔹 3. DATABASE OPTIMIZATION (MySQL)

Tasks:

Verify schema structure for all entities:

users, products, orders, cart_items, etc.

Ensure all foreign keys, indexes, and constraints are correct.

Use proper data types and nullability.

Fix SQL connection issues in Spring Boot (application.properties / application.yml).

Ensure auto schema generation works correctly (spring.jpa.hibernate.ddl-auto=update).

Optimize queries and avoid N+1 problems with @Query or fetch joins.

Add sample seed data for development and testing.

🔹 4. FRONTEND ↔ BACKEND INTEGRATION

Tasks:

Test and confirm that React makes successful API calls to Spring Boot backend.

Configure Axios base URL (from .env) correctly.

Validate login/signup flow:

User data → API → Database → Response.

Ensure product details, cart, and checkout endpoints connect correctly.

Implement auth tokens storage and usage (JWT/localStorage).

Handle loading, success, and error responses gracefully in UI.

Use consistent API naming (/api/users, /api/products, /api/orders).

🔹 5. PERFORMANCE OPTIMIZATION

Frontend:

Code-split routes with React.lazy() and Suspense.

Optimize images and assets.

Clean unused code, CSS, and animations.

Backend:

Optimize JPA/Hibernate queries.

Use connection pooling.

Enable gzip compression.

Cache repeated queries if needed.

Database:

Index common query fields.

Avoid large joins and optimize table normalization.

🔹 6. SECURITY ENHANCEMENTS

Hash all passwords using BCryptPasswordEncoder.

Use JWT for secure authentication and authorization.

Sanitize all inputs to prevent SQL injection.

Add Spring Security filters for token validation.

Enable CORS policy for your frontend domain only.

Hide credentials in .env or application.properties.

Add rate limiting and secure headers.

🔹 7. UI/UX POLISH

Create a consistent color palette and typography scale.

Improve button states, modals, alerts, and forms.

Add subtle Framer Motion transitions between routes.

Use icons (via Lucide, HeroIcons, or FontAwesome).

Add tooltips, hover effects, and clear empty-state designs.

Make all components accessible (ARIA labels, alt text, focus states).

🔹 8. DEPLOYMENT READINESS

Frontend:

Build with npm run build.

Configure environment variables for production API.

Backend:

Package Spring Boot as .jar or .war file.

Setup environment variables for DB credentials.

Use production-ready DB (e.g., AWS RDS, Railway, or PlanetScale).

Enable HTTPS and reverse proxy (Nginx/Apache).

General:

Ensure both frontend and backend run on separate ports (e.g. 5173 & 8080).

Create a README file with setup instructions.

🔹 9. CODE QUALITY & CLEANUP

Organize project folders:

backend/
  ├─ src/main/java/com/example/project/
  │   ├─ controller/
  │   ├─ service/
  │   ├─ model/
  │   ├─ repository/
  │   ├─ config/
  │   └─ security/
  └─ src/main/resources/
      └─ application.properties

frontend/
  ├─ src/components/
  ├─ src/pages/
  ├─ src/context/
  ├─ src/services/


Add comments for major logic.

Follow naming conventions and clean imports.

Remove unused or redundant code.

🔹 10. OUTPUT REQUIREMENTS

After the full improvement:

✅ Provide corrected & optimized code for all major files.

🧩 Give a summary of changes and enhancements made.

⚡ Suggest further improvements or feature ideas.

🧠 Ensure the final project is ready for deployment and error-free.D