!include MUI2.nsh

!define Version '0.20.8'
Name "@feflow/cli"
CRCCheck On
InstallDirRegKey HKCU "Software\@feflow/cli" ""

!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

OutFile "installer.exe"
VIProductVersion "${VERSION}.0"
VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductName" "@feflow/cli"
VIAddVersionKey /LANG=${LANG_ENGLISH} "Comments" "undefined"
VIAddVersionKey /LANG=${LANG_ENGLISH} "CompanyName" "undefined"
VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalCopyright" "2020"
VIAddVersionKey /LANG=${LANG_ENGLISH} "FileDescription" "A front-end flow tool."
VIAddVersionKey /LANG=${LANG_ENGLISH} "FileVersion" "${VERSION}.0"
VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductVersion" "${VERSION}.0"

InstallDir "$PROGRAMFILES\@feflow/cli"

Section "@feflow/cli CLI ${VERSION}"
  SetOutPath $INSTDIR
  File /r bin
  File /r client
  ExpandEnvStrings $0 "%COMSPEC%"

  WriteRegStr HKCU "Software\@feflow/cli" "" $INSTDIR
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\@feflow/cli" \
                   "DisplayName" "@feflow/cli"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\@feflow/cli" \
                   "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\@feflow/cli" \
                   "Publisher" "undefined"
SectionEnd

Section "Set PATH to @feflow/cli"
  Push "$INSTDIR\bin"
  Call AddToPath
SectionEnd

Section "Add %LOCALAPPDATA%\@feflow/cli to Windows Defender exclusions (highly recommended for performance!)"
  ExecShell "" '"$0"' "/C powershell -ExecutionPolicy Bypass -Command $\"& {Add-MpPreference -ExclusionPath $\"$LOCALAPPDATA\@feflow/cli$\"}$\" -FFFeatureOff" SW_HIDE
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"
  RMDir /r "$LOCALAPPDATA\@feflow/cli"
  DeleteRegKey /ifempty HKCU "Software\@feflow/cli"
SectionEnd

!define Environ 'HKCU "Environment"'
Function AddToPath
  Exch $0
  Push $1
  Push $2
  Push $3
  Push $4

  ; NSIS ReadRegStr returns empty string on string overflow
  ; Native calls are used here to check actual length of PATH

  ; $4 = RegOpenKey(HKEY_CURRENT_USER, "Environment", &$3)
  System::Call "advapi32::RegOpenKey(i 0x80000001, t'Environment', *i.r3) i.r4"
  IntCmp $4 0 0 done done
  ; $4 = RegQueryValueEx($3, "PATH", (DWORD*)0, (DWORD*)0, &$1, ($2=NSIS_MAX_STRLEN, &$2))
  ; RegCloseKey($3)
  System::Call "advapi32::RegQueryValueEx(i $3, t'PATH', i 0, i 0, t.r1, *i ${NSIS_MAX_STRLEN} r2) i.r4"
  System::Call "advapi32::RegCloseKey(i $3)"

  IntCmp $4 234 0 +4 +4 ; $4 == ERROR_MORE_DATA
    DetailPrint "AddToPath: original length $2 > ${NSIS_MAX_STRLEN}"
    MessageBox MB_OK "PATH not updated, original length $2 > ${NSIS_MAX_STRLEN}"
    Goto done

  IntCmp $4 0 +5 ; $4 != NO_ERROR
    IntCmp $4 2 +3 ; $4 != ERROR_FILE_NOT_FOUND
      DetailPrint "AddToPath: unexpected error code $4"
      Goto done
    StrCpy $1 ""

  ; Check if already in PATH
  Push "$1;"
  Push "$0;"
  Call StrStr
  Pop $2
  StrCmp $2 "" 0 done
  Push "$1;"
  Push "$0\;"
  Call StrStr
  Pop $2
  StrCmp $2 "" 0 done

  ; Prevent NSIS string overflow
  StrLen $2 $0
  StrLen $3 $1
  IntOp $2 $2 + $3
  IntOp $2 $2 + 2 ; $2 = strlen(dir) + strlen(PATH) + sizeof(";")
  IntCmp $2 ${NSIS_MAX_STRLEN} +4 +4 0
    DetailPrint "AddToPath: new length $2 > ${NSIS_MAX_STRLEN}"
    MessageBox MB_OK "PATH not updated, new length $2 > ${NSIS_MAX_STRLEN}."
    Goto done

  ; Append dir to PATH
  DetailPrint "Add to PATH: $0"
  StrCpy $2 $1 1 -1
  StrCmp $2 ";" 0 +2
    StrCpy $1 $1 -1 ; remove trailing ';'
  StrCmp $1 "" +2   ; no leading ';'
    StrCpy $0 "$1;$0"
  WriteRegExpandStr ${Environ} "PATH" $0
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000

done:
  Pop $4
  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

; StrStr - find substring in a string
;
; Usage:
;   Push "this is some string"
;   Push "some"
;   Call StrStr
;   Pop $0 ; "some string"

Function StrStr
  Exch $R1 ; $R1=substring, stack=[old$R1,string,...]
  Exch     ;                stack=[string,old$R1,...]
  Exch $R2 ; $R2=string,    stack=[old$R2,old$R1,...]
  Push $R3
  Push $R4
  Push $R5
  StrLen $R3 $R1
  StrCpy $R4 0
  ; $R1=substring, $R2=string, $R3=strlen(substring)
  ; $R4=count, $R5=tmp
  loop:
    StrCpy $R5 $R2 $R3 $R4
    StrCmp $R5 $R1 done
    StrCmp $R5 "" done
    IntOp $R4 $R4 + 1
    Goto loop
done:
  StrCpy $R1 $R2 "" $R4
  Pop $R5
  Pop $R4
  Pop $R3
  Pop $R2
  Exch $R1 ; $R1=old$R1, stack=[result,...]
FunctionEnd
