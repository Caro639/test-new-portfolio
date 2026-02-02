# Script pour demarrer MySQL depuis Laragon
Write-Host "=== Demarrage MySQL Laragon ===" -ForegroundColor Cyan

# Chemin vers mysqld
$mysqlPath = "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqld.exe"
$mysqlIni = "C:\laragon\bin\mysql\mysql-8.0.30-winx64\my.ini"

# Verifier que MySQL n'est pas deja en cours
$existing = Get-Process mysqld -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "MySQL est deja en cours d'execution (PID: $($existing.Id))" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous redemarrer MySQL? (O/N)"
    if ($response -eq 'O' -or $response -eq 'o') {
        Write-Host "Arret de MySQL..." -ForegroundColor Yellow
        $existing | Stop-Process -Force
        Start-Sleep -Seconds 3
    } else {
        Write-Host "Annulation" -ForegroundColor Red
        exit
    }
}

# Demarrer MySQL en arriere-plan
Write-Host "Demarrage de MySQL..." -ForegroundColor Yellow
$process = Start-Process -FilePath $mysqlPath -ArgumentList "--defaults-file=`"$mysqlIni`"" -WindowStyle Hidden -PassThru

Write-Host "Attente du demarrage..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verifier que MySQL est bien demarre
$mysqlProc = Get-Process mysqld -ErrorAction SilentlyContinue
if ($mysqlProc) {
    Write-Host "OK MySQL demarre avec succes!" -ForegroundColor Green
    Write-Host "PID: $($mysqlProc.Id)" -ForegroundColor Cyan
    
    # Tester la connexion
    Write-Host "`nTest de connexion au port 3306..." -ForegroundColor Yellow
    $connection = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
    
    if ($connection.TcpTestSucceeded) {
        Write-Host "OK MySQL est accessible sur le port 3306!" -ForegroundColor Green
    } else {
        Write-Host "Attention: MySQL demarre mais le port 3306 n'est pas accessible" -ForegroundColor Red
    }
} else {
    Write-Host "ERREUR: MySQL n'a pas demarre correctement" -ForegroundColor Red
    Write-Host "Verifiez les logs dans: C:\laragon\data\mysql-8\" -ForegroundColor Yellow
}

Write-Host "`nScript termine!" -ForegroundColor Green
