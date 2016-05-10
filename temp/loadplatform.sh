echo $1
echo $2
curl http://home.web-manufacture.net/stm/$2 > flash.s19
sudo stm8flash -c stlinkv2 -p $1 -w flash.s19
