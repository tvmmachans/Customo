import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ProductDao {
    public void upsert(Product p) throws SQLException {
        final String sql = "REPLACE INTO products (id, name, description, price, original_price, category, images, specifications, features, in_stock, stock_count, rating, review_count, badge, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, p.id);
            ps.setString(2, p.name);
            ps.setString(3, p.description);
            ps.setDouble(4, p.price);
            if (p.originalPrice == null) ps.setNull(5, Types.DOUBLE); else ps.setDouble(5, p.originalPrice);
            ps.setString(6, p.category);
            ps.setString(7, p.images);
            if (p.specificationsJson == null) ps.setNull(8, Types.LONGNVARCHAR); else ps.setString(8, p.specificationsJson);
            ps.setString(9, p.features);
            ps.setBoolean(10, p.inStock);
            ps.setInt(11, p.stockCount);
            ps.setDouble(12, p.rating);
            ps.setInt(13, p.reviewCount);
            if (p.badge == null) ps.setNull(14, Types.VARCHAR); else ps.setString(14, p.badge);
            ps.setBoolean(15, p.isActive);
            ps.executeUpdate();
        }
    }

    public Optional<Product> findById(String id) throws SQLException {
        final String sql = "SELECT id, name, description, price, original_price, category, images, specifications, features, in_stock, stock_count, rating, review_count, badge, is_active FROM products WHERE id = ?";
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                return Optional.of(map(rs));
            }
        }
    }

    public List<Product> listActive() throws SQLException {
        final String sql = "SELECT id, name, description, price, original_price, category, images, specifications, features, in_stock, stock_count, rating, review_count, badge, is_active FROM products WHERE is_active = 1";
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            try (ResultSet rs = ps.executeQuery()) {
                List<Product> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    private static Product map(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.id = rs.getString("id");
        p.name = rs.getString("name");
        p.description = rs.getString("description");
        p.price = rs.getDouble("price");
        double op = rs.getDouble("original_price"); p.originalPrice = rs.wasNull() ? null : op;
        p.category = rs.getString("category");
        p.images = rs.getString("images");
        p.specificationsJson = rs.getString("specifications");
        p.features = rs.getString("features");
        p.inStock = rs.getBoolean("in_stock");
        p.stockCount = rs.getInt("stock_count");
        p.rating = rs.getDouble("rating");
        p.reviewCount = rs.getInt("review_count");
        p.badge = rs.getString("badge");
        p.isActive = rs.getBoolean("is_active");
        return p;
    }

    public static class Product {
        public String id;
        public String name;
        public String description;
        public Double price;
        public Double originalPrice;
        public String category;
        public String images;
        public String specificationsJson;
        public String features;
        public boolean inStock;
        public int stockCount;
        public double rating;
        public int reviewCount;
        public String badge;
        public boolean isActive;
    }
}


