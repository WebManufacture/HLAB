#include "Macro.h"

#ifndef CONSTS_MODULE

#define CONSTS_MODULE 1

struct Digits{
	unsigned char dig1 : 1;
	unsigned char dig2 : 1;
	unsigned char dig4 : 1;
	unsigned char dig8 : 1;
	unsigned char dig16 : 1;
	unsigned char dig32 : 1;
	unsigned char dig64 : 1;
	unsigned char dig128 : 1;
};

struct Flags{
	unsigned char b0 : 1;
	unsigned char b1 : 1;
	unsigned char b2 : 1;
	unsigned char b3 : 1;
	unsigned char b4 : 1;
	unsigned char b5 : 1;
	unsigned char b6 : 1;
	unsigned char b7 : 1;
};

#endif

