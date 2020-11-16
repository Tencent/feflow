@echo off
setlocal enableextensions

if not "%FEF_REDIRECTED%"=="1" if exist "%LOCALAPPDATA%\fef\client\bin\fef.cmd" (
  set FEF_REDIRECTED=1
  "%LOCALAPPDATA%\fef\client\bin\fef.cmd" %*
  goto:EOF
)

if not defined FEF_BINPATH set FEF_BINPATH="%~dp0fef.cmd"
if exist "%~dp0..\bin\node.exe" (
  "%~dp0..\bin\node.exe" "%~dp0..\bin\run" %*
) else if exist "%LOCALAPPDATA%\oclif\node\node-10.13.0.exe" (
  "%LOCALAPPDATA%\oclif\node\node-10.13.0.exe" "%~dp0..\bin\run" %*
) else (
  node "%~dp0..\bin\run" %*
)
