# Delete the node_modules directory if it exists
Write-Host "Deleting node_modules directory" -ForegroundColor Green
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "node_modules directory deleted." -ForegroundColor Green
} else {
    Write-Host "node_modules directory not found." -ForegroundColor Yellow
}

# Delete any file or directory inside the 'prisma' directory except for 'schema.prisma' if it exists
Write-Host "Deleting prisma migration files" -ForegroundColor Green
if (Test-Path "prisma") {
    Get-ChildItem "prisma" | Where-Object {$_.Name -ne "schema.prisma"} | Remove-Item -Recurse -Force
    Write-Host "prisma migration files deleted." -ForegroundColor Green
}else {
    Write-Host "prisma migration files not found." -ForegroundColor Yellow
}

# Delete the dist directory if it exists
Write-Host "Deleting dist directory" -ForegroundColor Green
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "dist directory deleted." -ForegroundColor Green
} else {
    Write-Host "dist directory not found." -ForegroundColor Yellow
}
