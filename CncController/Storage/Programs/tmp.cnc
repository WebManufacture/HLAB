#tmp.cnc
#M x y - relative 
#M x y z
#M x y z S3000 - speed
#X x
#Y y
#Z z 
#X r+30m  r-relative m - millimeters
# r+400 = r+1m - 1 millimeter
#G x y - absolute
#G r-200 r+300 1m - go to -200 +300 z to 1
#G x y z 
#G x y S3999
#S - stop
#P - pause
#L from to step - loop
#LF - loop end
#X [counter] - counter 

M 24 +488
M 24 -299
S