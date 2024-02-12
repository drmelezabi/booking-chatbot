# Delete the node_modules directory if it exists
Write-Host "Deleting node_modules directory" -ForegroundColor Green
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "node_modules directory deleted." -ForegroundColor Green
}
else {
    Write-Host "node_modules directory not found." -ForegroundColor Yellow
}

# Delete the dist directory if it exists
Write-Host "Deleting dist directory" -ForegroundColor Green
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "dist directory deleted." -ForegroundColor Green
}
else {
    Write-Host "dist directory not found." -ForegroundColor Yellow
}
