import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class Database {
    private static final String DEFAULT_URL = "jdbc:sqlite:customo.db";
    private static final String DEFAULT_USER = "";
    private static final String DEFAULT_PASS = "";

    private Database() {}

    public static Connection getConnection() throws SQLException {
        String url = getenvOrDefault("DB_JDBC_URL", DEFAULT_URL);
        String user = getenvOrDefault("DB_USER", DEFAULT_USER);
        String pass = getenvOrDefault("DB_PASSWORD", DEFAULT_PASS);
        
        // For SQLite, we don't need user/password
        if (url.startsWith("jdbc:sqlite:")) {
            return DriverManager.getConnection(url);
        }
        return DriverManager.getConnection(url, user, pass);
    }

    private static String getenvOrDefault(String key, String def) {
        String v = System.getenv(key);
        return v != null && !v.isEmpty() ? v : def;
    }
}
