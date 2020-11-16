@echo off
setlocal enableextensions

set FEF_BINPATH=%~dp0\fef.cmd
if exist "%LOCALAPPDATA%\@feflow/cli\client\bin\fef.cmd" (
  "%LOCALAPPDATA%\@feflow/cli\client\bin\fef.cmd" %*
) else (
  "%~dp0\..\client\bin\node.exe" "%~dp0\..\client\bin\run" %*
)
