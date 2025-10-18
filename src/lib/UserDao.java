import java.sql.*;
import java.util.Optional;

public class UserDao {
    public Optional<UserRecord> findByEmail(String email) throws SQLException {
        final String sql = "SELECT id, email, password, first_name, last_name, phone, company, role, is_active FROM users WHERE email = ? LIMIT 1";
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                return Optional.of(mapUser(rs));
            }
        }
    }

    public String createUser(String email, String rawPassword) throws SQLException {
        final String passwordHash = PasswordUtil.hashPassword(rawPassword);
        final String userId = java.util.UUID.randomUUID().toString();
        final String sql = "INSERT INTO users (id, email, password, is_active, role, created_at, updated_at) VALUES (?, ?, ?, 1, 'CUSTOMER', datetime('now'), datetime('now'))";
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ps.setString(2, email);
            ps.setString(3, passwordHash);
            ps.executeUpdate();
            return userId;
        }
    }

    public boolean validateLogin(String email, String rawPassword) throws SQLException {
        final String sql = "SELECT password FROM users WHERE email = ? AND is_active = 1 LIMIT 1";
        try (Connection conn = Database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return false;
                String stored = rs.getString(1);
                return PasswordUtil.verifyPassword(rawPassword, stored);
            }
        }
    }

    private static UserRecord mapUser(ResultSet rs) throws SQLException {
        UserRecord u = new UserRecord();
        u.id = rs.getString("id");
        u.email = rs.getString("email");
        u.passwordHash = rs.getString("password");
        u.firstName = rs.getString("first_name");
        u.lastName = rs.getString("last_name");
        u.phone = rs.getString("phone");
        u.company = rs.getString("company");
        u.role = rs.getString("role");
        u.isActive = rs.getBoolean("is_active");
        return u;
    }

    public static class UserRecord {
        public String id;
        public String email;
        public String passwordHash;
        public String firstName;
        public String lastName;
        public String phone;
        public String company;
        public String role;
        public boolean isActive;
    }
}


