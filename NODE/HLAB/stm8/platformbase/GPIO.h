#include "Consts.h";

struct Port{
	unsigned char Out;
	unsigned char In;
	unsigned char DDR;
	unsigned char CR1;
	unsigned char CR2;
};

@near struct Pins{
	unsigned char out0 : 1;
	unsigned char out1 : 1;
	unsigned char out2 : 1;
	unsigned char out3 : 1;
	unsigned char out4 : 1;
	unsigned char out5 : 1;
	unsigned char out6 : 1;
	unsigned char out7 : 1;
	unsigned char in0 : 1;
	unsigned char in1 : 1;
	unsigned char in2 : 1;
	unsigned char in3 : 1;
	unsigned char in4 : 1;
	unsigned char in5 : 1;
	unsigned char in6 : 1;
	unsigned char in7 : 1;
	unsigned char ddr0 : 1;
	unsigned char ddr1 : 1;
	unsigned char ddr2 : 1;
	unsigned char ddr3 : 1;
	unsigned char ddr4 : 1;
	unsigned char ddr5 : 1;
	unsigned char ddr6 : 1;
	unsigned char ddr7 : 1;	
	unsigned char pup0 : 1;
	unsigned char pup1 : 1;
	unsigned char pup2 : 1;
	unsigned char pup3 : 1;
	unsigned char pup4 : 1;
	unsigned char pup5 : 1;
	unsigned char pup6 : 1;
	unsigned char pup7 : 1;
	unsigned char esp0 : 1;
	unsigned char esp1 : 1;
	unsigned char esp2 : 1;
	unsigned char esp3 : 1;
	unsigned char esp4 : 1;
	unsigned char esp5 : 1;
	unsigned char esp6 : 1;
	unsigned char esp7 : 1;
};

volatile struct Port PA @PA_ODR;
volatile struct Port PB @PB_ODR;
volatile struct Port PC @PC_ODR;
volatile struct Port PD @PD_ODR;

volatile struct Pins PpA @PA_ODR;
volatile struct Pins PpB @PB_ODR;
volatile struct Pins PpC @PC_ODR;
volatile struct Pins PpD @PD_ODR; 