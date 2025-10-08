import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class SignUpPage extends JFrame {
    private JTextField emailField;
    private JPasswordField passField;
    private JPasswordField confirmField;
    private JButton createButton;

    public SignUpPage() {
        setTitle("Sign Up");
        setSize(420, 320);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        JPanel root = new JPanel(new GridBagLayout());
        root.setBackground(new Color(18, 18, 18));
        JPanel card = new JPanel(new GridBagLayout());
        card.setBackground(new Color(28, 28, 28));
        card.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;

        JLabel title = new JLabel("Create account");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(Color.WHITE);
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        card.add(title, gbc);

        JLabel emailLabel = new JLabel("Email");
        emailLabel.setForeground(new Color(180, 180, 180));
        gbc.gridx = 0; gbc.gridy = 1; gbc.gridwidth = 1;
        card.add(emailLabel, gbc);

        emailField = new JTextField(18);
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2;
        card.add(emailField, gbc);

        JLabel passLabel = new JLabel("Password");
        passLabel.setForeground(new Color(180, 180, 180));
        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 1;
        card.add(passLabel, gbc);

        passField = new JPasswordField(18);
        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        card.add(passField, gbc);

        JLabel confirmLabel = new JLabel("Confirm password");
        confirmLabel.setForeground(new Color(180, 180, 180));
        gbc.gridx = 0; gbc.gridy = 5; gbc.gridwidth = 1;
        card.add(confirmLabel, gbc);

        confirmField = new JPasswordField(18);
        gbc.gridx = 0; gbc.gridy = 6; gbc.gridwidth = 2;
        card.add(confirmField, gbc);

        createButton = new JButton("Create account");
        createButton.setBackground(new Color(59, 130, 246));
        createButton.setForeground(Color.WHITE);
        createButton.setFocusPainted(false);
        createButton.addActionListener(e -> submit());
        gbc.gridx = 0; gbc.gridy = 7; gbc.gridwidth = 2;
        card.add(createButton, gbc);

        GridBagConstraints rootGbc = new GridBagConstraints();
        rootGbc.gridx = 0; rootGbc.gridy = 0; rootGbc.insets = new Insets(16, 16, 16, 16);
        root.add(card, rootGbc);
        setContentPane(root);
        getRootPane().setDefaultButton(createButton);
        setVisible(true);
    }

    private void submit() {
        String email = emailField.getText().trim();
        String p1 = new String(passField.getPassword());
        String p2 = new String(confirmField.getPassword());
        if (email.isEmpty() || p1.isEmpty() || p2.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields", "Missing data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        if (!p1.equals(p2)) {
            JOptionPane.showMessageDialog(this, "Passwords do not match", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JOptionPane.showMessageDialog(this, "Account created!", "Success", JOptionPane.INFORMATION_MESSAGE);
        try {
            String enc = URLEncoder.encode(email, StandardCharsets.UTF_8.toString());
            boolean opened = false;
            for (int port = 5173; port <= 5176 && !opened; port++) {
                try {
                    Desktop.getDesktop().browse(new URI("http://localhost:" + port + "/signup?email=" + enc));
                    opened = true;
                } catch (Exception ignore) {}
            }
        } catch (Exception ignore) {}
        dispose();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(SignUpPage::new);
    }
}


