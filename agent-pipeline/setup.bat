@echo off
:: Initialises the BA -> Dev -> QA agent pipeline in any project.
:: Run from the project root: path\to\setup.bat

setlocal

set PROJECT_ROOT=%CD%
set SCRIPT_DIR=%~dp0

echo Setting up agent pipeline in: %PROJECT_ROOT%

:: Create directory structure
if not exist "%PROJECT_ROOT%\.claude\agents" mkdir "%PROJECT_ROOT%\.claude\agents"
if not exist "%PROJECT_ROOT%\bugs"            mkdir "%PROJECT_ROOT%\bugs"
if not exist "%PROJECT_ROOT%\features"        mkdir "%PROJECT_ROOT%\features"
if not exist "%PROJECT_ROOT%\docs"            mkdir "%PROJECT_ROOT%\docs"

:: Copy agent definitions
copy /Y "%SCRIPT_DIR%.claude\agents\business-analyst.md" "%PROJECT_ROOT%\.claude\agents\" >nul
copy /Y "%SCRIPT_DIR%.claude\agents\developer.md"        "%PROJECT_ROOT%\.claude\agents\" >nul
copy /Y "%SCRIPT_DIR%.claude\agents\tester.md"           "%PROJECT_ROOT%\.claude\agents\" >nul

:: Copy pipeline config template (only if one doesn't already exist)
if not exist "%PROJECT_ROOT%\PIPELINE.md" (
    copy /Y "%SCRIPT_DIR%PIPELINE.md" "%PROJECT_ROOT%\PIPELINE.md" >nul
    echo Created PIPELINE.md -- edit it to configure the pipeline for your project.
) else (
    echo PIPELINE.md already exists -- skipping.
)

:: Create gitkeep files
type nul > "%PROJECT_ROOT%\bugs\.gitkeep"
type nul > "%PROJECT_ROOT%\features\.gitkeep"
type nul > "%PROJECT_ROOT%\docs\.gitkeep"

echo.
echo Done. Next steps:
echo   1. Edit PIPELINE.md with your project name, stack, and entry files.
echo   2. Open Claude Code in the project root.
echo   3. Use /business-analyst, /developer, or /tester to run an agent.
echo.
echo Pipeline flow:
echo   /business-analyst  --^>  writes features/FEAT-NNN.md
echo   /developer         --^>  reads features/ and bugs/, implements/fixes
echo   /tester            --^>  verifies features/, writes bugs/BUG-NNN.md

endlocal
