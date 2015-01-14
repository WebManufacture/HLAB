#include "DeviceConfig.h"

void UnblockEEPROM(void){
	char dataState;
	dataState = FLASH_IAPSR;
	dataState &= bit3;
	if (dataState == 0){
		FLASH_DUKR = 0xAE;
		FLASH_DUKR = 0x56;
	}
}

void UnblockFLASH(void){
	char dataState;
	dataState = FLASH_IAPSR;
	dataState &= bit3;
	if (dataState == 0){
		FLASH_PUKR = 0x56;
		FLASH_PUKR = 0xAE;
	}
}

void Delay(long waitCalc){
	long i;
	for (i = waitCalc; i > 0; i--){
		_asm("nop");
	}
}

void Reset(void){
	WWDG_CR = bit7;
}


