@ECHO OFF
cd HLAB\STM8\%1
SET ST_TOOL=C:\Program Files (x86)\STMicroelectronics\st_toolset
SET COSMIC=C:\Program Files (x86)\COSMIC\CXSTM8_16K
@ECHO ON
@"%COSMIC%\cxstm8" -i"%COSMIC%\Hstm8" -i"%ST_TOOL%\include" +mods0 +debug -e -pxp -l -pp *.c
