@ECHO OFF
cd HLAB\STM8\%1
SET ST_TOOL=C:\STM8\st_toolset
SET COSMIC=C:\STM8\COSMIC
DEL errors\*.* /Q
DEL result\*.* /Q
@ECHO ON
"%COSMIC%\cxstm8" -i"%COSMIC%\Hstm8" -i"%ST_TOOL%\include" +mods0 +debug -e -pxp -l -pp *.c
@ECHO OFF
MOVE *.o result
MOVE *.ls result
MOVE *.err errors
@ECHO ON
"%COSMIC%\clnk" -l"%COSMIC%\Lib" -e"errors\%1.merr" -sl  -o"result\%1.sm8" -m"result\%1.map" "%1.lkf"
@ECHO OFF
"%COSMIC%\cvdwarf" "result\%1.sm8"
"%COSMIC%\chex" -o "result\%1.s19" "result\%1.sm8"