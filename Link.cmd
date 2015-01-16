"%COSMIC%\clnk" -l"%COSMIC%\Lib" -e"errors\%2.merr" -sl  -o"result\%2.sm8" -m"result\%2.map" "%2.lkf"
"%COSMIC%\cvdwarf" "result\%2.sm8"
"%COSMIC%\chex" -o "result\%2.s19" "result\%2.sm8"
