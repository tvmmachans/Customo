import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.time.Duration;
import java.io.IOException;

public class LoginPage extends JFrame implements ActionListener {

    private static final Color COLOR_BACKGROUND = new Color(18, 18, 18); // match app background
    private static final Color COLOR_SURFACE = new Color(28, 28, 28);
    private static final Color COLOR_TEXT = new Color(235, 235, 235);
    private static final Color COLOR_SUBTLE = new Color(160, 160, 160);
    private static final Color COLOR_PRIMARY = new Color(59, 130, 246); // primary blue
    private static final Color COLOR_DESTRUCTIVE = new Color(239, 68, 68);

    private JTextField userField;
    private JPasswordField passField;
    private JCheckBox showPasswordCheck;
    private JButton loginButton;
    private JButton resetButton;
    private char defaultEchoChar;
    // Switched to direct DB validation via UserDao
    // Backend HTTP calls removed
    
    private UserDao userDao = new UserDao();

    public LoginPage() {
        setTitle("Login Page");
        setSize(420, 280);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // Root container styling
        JPanel root = new JPanel(new GridBagLayout());
        root.setBackground(COLOR_BACKGROUND);

        JPanel card = new JPanel(new GridBagLayout());
        card.setBackground(COLOR_SURFACE);
        card.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;

        // Title
        JLabel title = new JLabel("Sign in");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(COLOR_TEXT);
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        card.add(title, gbc);

        // Username
        JLabel userLabel = new JLabel("Username");
        userLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        userLabel.setForeground(COLOR_SUBTLE);
        gbc.gridx = 0; gbc.gridy = 1; gbc.gridwidth = 1;
        card.add(userLabel, gbc);

        userField = new JTextField(16);
        styleTextField(userField);
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2;
        card.add(userField, gbc);

        // Password
        JLabel passLabel = new JLabel("Password");
        passLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        passLabel.setForeground(COLOR_SUBTLE);
        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 1;
        card.add(passLabel, gbc);

        passField = new JPasswordField(16);
        styleTextField(passField);
        defaultEchoChar = passField.getEchoChar();
        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        card.add(passField, gbc);

        // Show password
        showPasswordCheck = new JCheckBox("Show password");
        showPasswordCheck.setBackground(COLOR_SURFACE);
        showPasswordCheck.setForeground(COLOR_SUBTLE);
        showPasswordCheck.setFocusPainted(false);
        showPasswordCheck.addActionListener(ev -> {
            boolean show = showPasswordCheck.isSelected();
            passField.setEchoChar(show ? (char) 0 : defaultEchoChar);
        });
        gbc.gridx = 0; gbc.gridy = 5; gbc.gridwidth = 2;
        card.add(showPasswordCheck, gbc);

        // Buttons
        loginButton = new JButton("Sign in");
        styleButtonPrimary(loginButton);
        loginButton.addActionListener(this);

        resetButton = new JButton("Reset");
        styleButtonDestructive(resetButton);
        resetButton.addActionListener(this);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        buttons.setBackground(COLOR_SURFACE);
        buttons.add(resetButton);
        buttons.add(loginButton);

        gbc.gridx = 0; gbc.gridy = 6; gbc.gridwidth = 2;
        card.add(buttons, gbc);

        // Assemble
        GridBagConstraints rootGbc = new GridBagConstraints();
        rootGbc.gridx = 0; rootGbc.gridy = 0;
        rootGbc.insets = new Insets(16, 16, 16, 16);
        root.add(card, rootGbc);

        setContentPane(root);

        // Keyboard: Enter triggers sign-in (simple, no awkward transitions)
        getRootPane().setDefaultButton(loginButton);

        setVisible(true);
    }

    private void styleTextField(JTextField field) {
        field.setBackground(new Color(38, 38, 38));
        field.setForeground(COLOR_TEXT);
        field.setCaretColor(COLOR_TEXT);
        field.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(64, 64, 64)),
                BorderFactory.createEmptyBorder(8, 10, 8, 10)
        ));
    }

    private void styleButtonPrimary(JButton button) {
        button.setBackground(COLOR_PRIMARY);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorderPainted(false);
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
    }

    private void styleButtonDestructive(JButton button) {
        button.setBackground(COLOR_DESTRUCTIVE);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorderPainted(false);
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        Object src = e.getSource();
        if (src == loginButton) {
            handleSignIn();
        } else if (src == resetButton) {
            userField.setText("");
            passField.setText("");
            userField.requestFocusInWindow();
        }
    }

    private void handleSignIn() {
        String username = userField.getText().trim();
        String password = String.valueOf(passField.getPassword());
        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter both username and password.", "Missing data", JOptionPane.WARNING_MESSAGE);
            return;
        }

        boolean authenticated = false;
        try {
            authenticated = userDao.validateLogin(username, password);
        } catch (SQLException se) {
            System.err.println("Login DB error: " + se.getMessage());
        }
        if (authenticated) {
            JOptionPane.showMessageDialog(this, "Login successful", "Success", JOptionPane.INFORMATION_MESSAGE);
            tryOpenFrontend(username);
            new Dashboard(username);
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, "Invalid credentials.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private static String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    // removed HTTP helpers (using JDBC now)

    private void tryOpenFrontend(String username) {
        try {
            String encodedUser = URLEncoder.encode(username, StandardCharsets.UTF_8.toString());
            // Try common vite ports 5173-5176
            boolean opened = false;
            for (int port = 5173; port <= 5176 && !opened; port++) {
                try {
                    Desktop.getDesktop().browse(new URI("http://localhost:" + port + "/login?username=" + encodedUser));
                    opened = true;
                } catch (Exception inner) {
                    // try next
                }
            }
        } catch (Exception ignored) {}
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(LoginPage::new);
    }
}

class Dashboard extends JFrame {
    public Dashboard(String username) {
        setTitle("Dashboard");
        setSize(420, 220);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JLabel label = new JLabel("Welcome, " + username + "!", SwingConstants.CENTER);
        label.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        add(label);
        setVisible(true);
    }
}