# Script de verification complete MySQL pour Laragon
Write-Host "=== Verification MySQL Laragon ===" -ForegroundColor Cyan

# 1. Verifier le processus
Write-Host "`n1. Processus MySQL:" -ForegroundColor Yellow
$mysqlProc = Get-Process mysqld -ErrorAction SilentlyContinue
if ($mysqlProc) {
    Write-Host "   OK MySQL en cours (PID: $($mysqlProc.Id))" -ForegroundColor Green
} else {
    Write-Host "   X MySQL non demarre" -ForegroundColor Red
}

# 2. Verifier le port
Write-Host "`n2. Port 3306:" -ForegroundColor Yellow
$port = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "   OK Port 3306 ecoute" -ForegroundColor Green
} else {
    Write-Host "   X Port 3306 non actif" -ForegroundColor Red
}

# 3. Tester la connexion MySQL
Write-Host "`n3. Test de connexion:" -ForegroundColor Yellow
$mysqlClient = "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysql.exe"
if (Test-Path $mysqlClient) {
    $testResult = & $mysqlClient -u root -e "SELECT 'OK' as Status;" 2>&1
    if ($testResult -like "*OK*") {
        Write-Host "   OK Connexion MySQL reussie" -ForegroundColor Green
    } else {
        Write-Host "   ? Connexion : $testResult" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ? Client MySQL non trouve" -ForegroundColor Yellow
}

# 4. Verifier la configuration
Write-Host "`n4. Configuration:" -ForegroundColor Yellow
$myIni = "C:\laragon\bin\mysql\mysql-8.0.30-winx64\my.ini"
if (Test-Path $myIni) {
    $config = Get-Content $myIni -Raw
    if ($config -like "*loose-skip-component_reference_cache*") {
        Write-Host "   OK Composant problematique desactive" -ForegroundColor Green
    } else {
        Write-Host "   ! Configuration a mettre a jour" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Resultat ===" -ForegroundColor Cyan
if ($mysqlProc -and $port) {
    Write-Host "MySQL fonctionne correctement!" -ForegroundColor Green
    Write-Host "`nSi Laragon affiche 'Failed', essayez:" -ForegroundColor Yellow
    Write-Host "1. Arretez MySQL depuis Laragon (bouton Stop)" -ForegroundColor White
    Write-Host "2. Redemarrez depuis Laragon (bouton Start)" -ForegroundColor White
    Write-Host "3. Ou utilisez ce script pour demarrer MySQL" -ForegroundColor White
} else {
    Write-Host "MySQL n'est pas actif" -ForegroundColor Red
    Write-Host "`nPour demarrer MySQL, executez:" -ForegroundColor Yellow
    Write-Host ".\start-mysql-service.ps1" -ForegroundColor White
}
