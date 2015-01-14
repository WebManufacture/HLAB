@ECHO OFF
cd HLAB\STM8\%1
SET ST_TOOL=C:\Program Files (x86)\STMicroelectronics\st_toolset
SET COSMIC=C:\Program Files (x86)\COSMIC\CXSTM8_16K
@ECHO ON
@"%COSMIC%\clnk" -l"%COSMIC%\Lib" -e"errors\%1.merr" -sl  -o"result\%1.sm8" -m"result\%1.map" "%1.lkf"
@ECHO OFF
"%COSMIC%\cvdwarf" "result\%1.sm8"
"%COSMIC%\chex" -o "result\%1.s19" "result\%1.sm8"
