[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($engine -eq $null) {
    Write-Host "No OCR engine"
    exit 1
}
Write-Host "OCR Engine language: $($engine.RecognizerLanguage.LanguageTag)"
