# 🔧 How to Install Maven on Windows

## Quick Install Instructions

### Option 1: Manual Download (Easiest)

1. **Download Maven:**
   - Go to: https://maven.apache.org/download.cgi
   - Download: `apache-maven-3.9.6-bin.zip` (or latest version)

2. **Extract the ZIP:**
   - Extract to: `C:\Program Files\Apache\maven`

3. **Add to System PATH:**
   - Press `Win + Pause` to open System Properties
   - Click "Environment Variables"
   - Under "System variables", find `Path` → Edit
   - Add new entry: `C:\Program Files\Apache\maven\bin`
   - Click OK to save

4. **Verify Installation:**
   - Open new PowerShell/Command Prompt
   - Run: `mvn -version`
   - You should see version info

### Option 2: Install via Winget (If Windows 11/10)

Run this in PowerShell (as Administrator):

```powershell
winget install Apache.Maven
```

Then restart your terminal.

### Option 3: Install Chocolatey Package Manager First

**Install Chocolatey:**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Then install Maven:**
```powershell
choco install maven
```

---

## ✅ After Installation

Once Maven is installed:

1. **Close and reopen your terminal**
2. **Navigate to backend:**
   ```bash
   cd backend-java
   ```

3. **Run the backend:**
   ```bash
   mvn spring-boot:run
   ```

4. **The API will be available at:** `http://localhost:8080`

---

## 🎉 Quick Test

Run this to check if it worked:

```powershell
mvn -version
```

You should see something like:
```
Apache Maven 3.9.6
Maven home: C:\Program Files\Apache\maven
...
```

---

## ⚠️ Important Notes

- After adding to PATH, **close and reopen** your terminal
- Make sure Java is installed (download from: https://adoptium.net/)
- The frontend already works without Maven! You only need Maven for backend

---

**Need help?** Just follow Option 1 - it's the most reliable method!

