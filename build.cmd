cd D:\NODE\HLAB\STM8\%1
D:

SET ST_TOOL=C:\STM8\st_toolset
SET COSMIC=C:\STM8\COSMIC

DEL result\*.* /Q /F
"%COSMIC%\cxstm8" -i"%COSMIC%\Hstm8" -i"%ST_TOOL%\include" +mods0 +debug -e -pxp -l -pp *.c
MOVE *.o result
MOVE *.ls result
MOVE *.err errors
"%COSMIC%\clnk" -l"%COSMIC%\Lib" -e"errors\%1.merr" -sl  -o"result\%1.sm8" -m"result\%1.map" "%1.lkf"
"%COSMIC%\cvdwarf" "result\%1.sm8"
"%COSMIC%\chex" -o "result\%1.s19" "result\%1.sm8"