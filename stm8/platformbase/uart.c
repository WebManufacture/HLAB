#include "deviceConfig.h"
#include "uart.h"
#include "utils.h"
#include "generalConfig.h"

UartMessage receiveBuf;

struct UartState{
	unsigned char phase;
	unsigned char size;
	unsigned char index;
} urState, uwState;

char *readDataBuf, *writeDataBuf;

char InitUART(struct UartConfiguration* config){
	uint speed = config->speed;
	UART_CR1 = 0; //PARITY ODD + 9Bit (8d+1p)
	UART_CR2 = bit5 + bit3 + bit2; // RX + TX + RXIE
	UART_CR3 = 0; //1 STOP
	UART_CR4 = 0;
	UART_CR5 = 0;
	
	//0x0B08 - 115200 16 MHz
	//0x0368 - 9600 16 MHz

	UART_BRR2 = speed >> 8;
	UART_BRR1 = speed;
	
	readDataBuf = (char*)&receiveBuf;
	//writeDataBuf = (char*)&sendBuf;
	
	urState.size = sizeof (UartMessage);
	
	#ifdef USE_MESSAGING
		
		
		
		
	#endif
	
	return 1;
}


char CheckUart(void){
	return urState.phase == 03 ? urState.size : 0;
}

char* GetUartMessage(void){
	urState.phase = 0;
	return readDataBuf;
}

void ClearUart(void){
	urState.phase = 0;
}

void WaitSend(void){
	while(uwState.phase > 0 && uwState.phase < 3){
		
	}
}

void UartSendMessage(UartMessage message){
	WaitSend();
	uwState.phase = 0;
	uwState.index = 0;
	uwState.size = sizeof(UartMessage);
	writeDataBuf = (char*)&message;
	UART_CR2 |= bit7;//(TIEN) TXE interrupt	
}

void UartSendData(char* data, uchar size){
	WaitSend();
	uwState.phase = 0;
	uwState.index = 0;
	uwState.size = size;
	writeDataBuf = data;
	UART_CR2 |= bit7;//(TIEN) TXE interrupt	
}

void UartSendSized(UartMessage message, uchar size){
	WaitSend();
	uwState.phase = 0;
	uwState.index = 0;
	uwState.size = size;
	writeDataBuf = (char*)&message;
	UART_CR2 |= bit7;//(TIEN) TXE interrupt	
}

#ifdef USE_MESSAGING
	#include "Routing.h"
		
	signed char checkUartMessages(char evt, char* data){
		if (CheckUart()){
			if (SendMessage((struct Message*)data)){
				ClearUart();
			}
		}
	}	

	signed char sendUartMessage(struct Message* msg){
		return 1;
	}

	volatile signed char InitUartHandler(char evt, char* data){
		char* configStruct;
		struct CONFIGURATION_STRUCT* config = (struct CONFIGURATION_STRUCT*)data;
		//configStruct = config->moduleConfigs[0];
		struct UartConfiguration* uartConfig = (struct UartConfiguration*)(config->moduleConfigs[0]);
		InitUART(uartConfig);
		ESubscribe(EVT_IDLE, checkUartMessages);
		UartSendData((char*)config, sizeof (struct FactoryRecord));
		MSubscribe(0xF0, 00, 00, 00, sendUartMessage);
		return 0;
	}
#endif

#ifdef USE_EVENTS
	#include "events.h"

	signed char checkUartMessages(char evt, char* data){
		if (CheckUart()){
			if (FireEvent(EVT_MESSAGE_IN, data)){
				ClearUart();
			}
		}
	}	
	
	signed char sendUartMessage(char evt, char* data){
		UartSendData(data, sizeof (UartMessage));
		return 1;
	}
	
	signed char InitUartHandler(char evt, char* data){
		char* configStruct;
		struct CONFIGURATION_STRUCT* config = (struct CONFIGURATION_STRUCT*)data;
		//configStruct = config->moduleConfigs[0];
		struct UartConfiguration* uartConfig = (struct UartConfiguration*)(config->moduleConfigs[0]);
		InitUART(uartConfig);
		ESubscribe(EVT_IDLE, checkUartMessages);
		ESubscribe(EVT_MESSAGE_OUT, sendUartMessage);
		UartSendData((char*)config, sizeof (struct FactoryRecord));		
		return 0;
	}
	
#endif

UART_RX_IRQHandler{
	unsigned char val;
	unsigned int index;
	_asm("SIM");
	res(UART_SR,5);
	val = UART_DR;
	if (urState.phase < 3){
		if (urState.phase == 2){
			if (urState.index >= urState.size){
					urState.phase = val == 03 ? 3 : 0;
					_asm("RIM");
					return;
			}
			else{
				readDataBuf[urState.index] = val;
				urState.index++;
			}
		}
		if (urState.phase == 1){
			if (val > 0){
				urState.phase = 2;
				urState.size = val;				
			}
			else{
				urState.phase = 0;
				urState.size = 0;
			}
			urState.index = 0;
		}
		if (urState.phase == 0){
			if (val == 1 || val == 2){
				urState.phase = val;
			}
			urState.index = 0;
		}
	}
	_asm("RIM");
}

UART_TX_IRQHandler{
	unsigned char val;
	unsigned char wv;
	_asm("SIM");
	if (uwState.index >= uwState.size){
		if (uwState.phase < 3){
			UART_DR = 04;//EOT
			uwState.phase = 3;
		}
		else{
			UART_CR2 = UART_CR2 & ~bit7; //UART TX OFF
		}		
	}
	else{
		if (uwState.phase == 2){
			val = writeDataBuf[uwState.index];
			UART_DR = val;
			uwState.index++;
		}		
		if (uwState.phase == 1){
			UART_DR = uwState.size;
			uwState.phase = 2;
		}
		if (uwState.phase == 0){
			UART_DR = 01;//SOH
			uwState.phase = 1;
		}
	}
	_asm("RIM");
}