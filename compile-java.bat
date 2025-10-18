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
