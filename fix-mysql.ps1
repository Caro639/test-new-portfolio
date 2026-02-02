# Script pour diagnostiquer et réparer MySQL dans Laragon
Write-Host "=== Diagnostic MySQL Laragon ===" -ForegroundColor Cyan

# 1. Vérifier les processus MySQL
Write-Host "`n1. Vérification des processus MySQL..." -ForegroundColor Yellow
$mysqlProcesses = Get-Process mysqld -ErrorAction SilentlyContinue
if ($mysqlProcesses) {
    Write-Host "Processus MySQL trouvés:" -ForegroundColor Red
    $mysqlProcesses | Format-Table Id, ProcessName, StartTime -AutoSize
    
    $response = Read-Host "Voulez-vous arrêter ces processus? (O/N)"
    if ($response -eq 'O' -or $response -eq 'o') {
        $mysqlProcesses | Stop-Process -Force
        Write-Host "Processus arrêtés" -ForegroundColor Green
    }
} else {
    Write-Host "Aucun processus MySQL actif" -ForegroundColor Green
}

# 2. Vérifier le port 3306
Write-Host "`n2. Vérification du port 3306..." -ForegroundColor Yellow
$port3306 = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($port3306) {
    Write-Host "Le port 3306 est utilisé par le processus:" -ForegroundColor Red
    $process = Get-Process -Id $port3306.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "  PID: $($process.Id) - $($process.ProcessName)" -ForegroundColor Red
    }
} else {
    Write-Host "Le port 3306 est libre" -ForegroundColor Green
}

# 3. Vérifier les fichiers de verrouillage
Write-Host "`n3. Vérification des fichiers de verrouillage..." -ForegroundColor Yellow
$mysqlDataPath = "C:\laragon\data\mysql"
if (Test-Path $mysqlDataPath) {
    $lockFiles = Get-ChildItem -Path $mysqlDataPath -Filter "*.lock" -Recurse -ErrorAction SilentlyContinue
    if ($lockFiles) {
        Write-Host "Fichiers de verrouillage trouvés:" -ForegroundColor Red
        $lockFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        
        $response = Read-Host "Voulez-vous supprimer ces fichiers? (O/N)"
        if ($response -eq 'O' -or $response -eq 'o') {
            $lockFiles | Remove-Item -Force
            Write-Host "Fichiers supprimés" -ForegroundColor Green
        }
    } else {
        Write-Host "Aucun fichier de verrouillage trouvé" -ForegroundColor Green
    }
} else {
    Write-Host "Dossier MySQL data non trouvé: $mysqlDataPath" -ForegroundColor Red
}

# 4. Recommandations
Write-Host "`n=== Recommandations ===" -ForegroundColor Cyan
Write-Host "1. Redémarrez Laragon après avoir exécuté ce script"
Write-Host "2. Si le problème persiste, ajoutez ces dossiers aux exclusions de votre antivirus:"
Write-Host "   - C:\laragon\data\mysql\"
Write-Host "   - C:\laragon\bin\mysql\"
Write-Host "3. Vérifiez qu'aucune autre instance de MySQL n'est installée (XAMPP, WAMP, etc.)"

Write-Host "`nScript terminé!" -ForegroundColor Green
