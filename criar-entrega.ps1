[CmdletBinding()]
param(
    [string]$OutputPath = (Join-Path $PSScriptRoot 'VITTA-entrega.zip')
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$validationScript = Join-Path $projectRoot 'validar-entrega.ps1'

& $validationScript
if ($LASTEXITCODE -ne 0) {
    throw 'A entrega não foi gerada porque a validação encontrou erros.'
}

$resolvedOutput = [IO.Path]::GetFullPath($OutputPath)
$temporaryBase = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$temporaryRoot = Join-Path $temporaryBase ("vitta-entrega-" + [Guid]::NewGuid().ToString('N'))
$stagedProject = Join-Path $temporaryRoot 'VITTA'

if (-not $temporaryRoot.StartsWith($temporaryBase, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Diretório temporário inválido: $temporaryRoot"
}

try {
    New-Item -ItemType Directory -Path $stagedProject -Force | Out-Null

    $excludedDirectories = @(
        'node_modules', 'dist', '.expo', '.git', '.agents', '.claude', '.windsurf',
        'generated', '.next', 'coverage', '.npm-cache', 'node_modules.incomplete'
    )
    $excludedFiles = @('.env', '.env.docker', 'VITTA-entrega.zip')

    $robocopyArguments = @(
        $projectRoot,
        $stagedProject,
        '/E',
        '/R:1',
        '/W:1',
        '/NFL',
        '/NDL',
        '/NJH',
        '/NJS',
        '/NP',
        '/XD'
    ) + $excludedDirectories + @('/XF') + $excludedFiles

    & robocopy @robocopyArguments | Out-Null
    if ($LASTEXITCODE -ge 8) {
        throw "Falha ao preparar os arquivos da entrega (robocopy $LASTEXITCODE)."
    }

    if (Test-Path -LiteralPath $resolvedOutput -PathType Leaf) {
        Remove-Item -LiteralPath $resolvedOutput -Force
    }

    Compress-Archive -LiteralPath $stagedProject -DestinationPath $resolvedOutput -CompressionLevel Optimal

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = [IO.Compression.ZipFile]::OpenRead($resolvedOutput)
    try {
        $invalidEntries = @($archive.Entries | Where-Object {
            $_.FullName -match '(^|/)node_modules/' -or
            $_.FullName -match '(^|/)\.env$' -or
            $_.FullName -match '(^|/)\.env\.docker$' -or
            $_.FullName -match '(^|/)\.git/'
        })
        if ($invalidEntries.Count -gt 0) {
            throw 'O ZIP contém arquivos proibidos e deve ser descartado.'
        }
    }
    finally {
        $archive.Dispose()
    }

    Write-Host "Entrega criada com sucesso: $resolvedOutput" -ForegroundColor Green
}
finally {
    if (Test-Path -LiteralPath $temporaryRoot -PathType Container) {
        $verifiedTemporaryRoot = [IO.Path]::GetFullPath($temporaryRoot)
        if ($verifiedTemporaryRoot.StartsWith($temporaryBase, [StringComparison]::OrdinalIgnoreCase) -and
            $verifiedTemporaryRoot -ne $temporaryBase) {
            Remove-Item -LiteralPath $verifiedTemporaryRoot -Recurse -Force
        }
    }
}
