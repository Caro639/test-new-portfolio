# Script de nettoyage MySQL pour Laragon
Write-Host "=== Nettoyage MySQL Binlogs ===" -ForegroundColor Cyan

$dataPath = "C:\laragon\data\mysql-8"
$binlogIndex = Join-Path $dataPath "binlog.index"

if (Test-Path $binlogIndex) {
    Write-Host "`nLecture du fichier binlog.index..." -ForegroundColor Yellow
    $binlogFiles = Get-Content $binlogIndex
    
    Write-Host "Fichiers references dans l'index:" -ForegroundColor Yellow
    $missingFiles = @()
    $existingFiles = @()
    
    foreach ($binlogPath in $binlogFiles) {
        $cleanPath = $binlogPath.Trim().TrimStart('.\')
        $fullPath = Join-Path $dataPath $cleanPath
        
        if (Test-Path $fullPath) {
            $existingFiles += $binlogPath
            Write-Host "  OK $cleanPath" -ForegroundColor Green
        } else {
            $missingFiles += $binlogPath
            Write-Host "  X $cleanPath (manquant)" -ForegroundColor Red
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-Host "`n$($missingFiles.Count) fichier(s) manquant(s) detecte(s)" -ForegroundColor Red
        Write-Host "Reconstruction du fichier binlog.index..." -ForegroundColor Yellow
        
        # Sauvegarder l'ancien index
        $backupPath = "$binlogIndex.backup"
        Copy-Item $binlogIndex $backupPath
        Write-Host "Sauvegarde creee: $backupPath" -ForegroundColor Cyan
        
        # Recreer l'index avec seulement les fichiers existants
        if ($existingFiles.Count -gt 0) {
            $existingFiles | Set-Content $binlogIndex
            Write-Host "OK Fichier binlog.index mis a jour ($($existingFiles.Count) fichiers)" -ForegroundColor Green
        } else {
            # Si aucun binlog n'existe, vider l'index
            "" | Set-Content $binlogIndex
            Write-Host "OK Fichier binlog.index vide (aucun binlog existant)" -ForegroundColor Green
        }
    } else {
        Write-Host "`nOK Tous les binlogs references existent" -ForegroundColor Green
    }
} else {
    Write-Host "Fichier binlog.index non trouvé dans: $dataPath" -ForegroundColor Red
}

Write-Host "`n=== Recommandations ===" -ForegroundColor Cyan
Write-Host "1. Arrêtez MySQL (Ctrl+C dans la console actuelle)"
Write-Host "2. Redémarrez MySQL via Laragon normalement"
Write-Host "3. Les erreurs de binlog ne devraient plus apparaître"
Write-Host "`nScript terminé!" -ForegroundColor Green
