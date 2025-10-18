# PowerShell script to set up Java SQLite environment
Write-Host "Setting up Java SQLite environment..." -ForegroundColor Green

# Create lib directory if it doesn't exist
if (!(Test-Path "lib")) {
    New-Item -ItemType Directory -Path "lib"
}

# Download SQLite JDBC driver
$sqliteUrl = "https://repo1.maven.org/maven2/org/xerial/sqlite-jdbc/3.44.1.0/sqlite-jdbc-3.44.1.0.jar"
$sqliteJar = "lib/sqlite-jdbc.jar"

if (!(Test-Path $sqliteJar)) {
    Write-Host "Downloading SQLite JDBC driver..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $sqliteUrl -OutFile $sqliteJar
        Write-Host "SQLite JDBC driver downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download SQLite JDBC driver: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please download manually from: $sqliteUrl" -ForegroundColor Yellow
    }
} else {
    Write-Host "SQLite JDBC driver already exists." -ForegroundColor Green
}

# Create a simple batch file to compile and run Java files with SQLite
$batchContent = @"
@echo off
echo Compiling Java files with SQLite JDBC...
javac -cp "lib/sqlite-jdbc.jar" src/lib/*.java src/pages/*.java
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b 1
)
echo Compilation successful!
echo.
echo To run LoginPage: java -cp "src;lib/sqlite-jdbc.jar" LoginPage
echo To run SignUpPage: java -cp "src;lib/sqlite-jdbc.jar" SignUpPage
pause
"@

$batchContent | Out-File -FilePath "compile-java.bat" -Encoding ASCII
Write-Host "Created compile-java.bat for easy compilation." -ForegroundColor Green

Write-Host "Setup complete! You can now:" -ForegroundColor Green
Write-Host "1. Run 'compile-java.bat' to compile Java files" -ForegroundColor Cyan
Write-Host "2. Run 'java -cp \"src;lib/sqlite-jdbc.jar\" LoginPage' to test login" -ForegroundColor Cyan
Write-Host "3. Run 'java -cp \"src;lib/sqlite-jdbc.jar\" SignUpPage' to test signup" -ForegroundColor Cyan
