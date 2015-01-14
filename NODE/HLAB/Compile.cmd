@ECHO OFF
cd HLAB\STM8\%1
@ECHO ON
@"%COSMIC%\cxstm8" -i"%COSMIC%\Hstm8" -i"%ST_TOOL%\include" +mods0 +debug -e -pxp -l -pp *.c
