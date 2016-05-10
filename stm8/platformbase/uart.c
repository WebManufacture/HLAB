#include "generalConfig.h"
#include "deviceConfig.h"
#include "uart.h"
#include "utils.h"

struct UartState{
	unsigned char phase;
	unsigned char size;
	unsigned char index;
	unsigned char crcCode;
} urState, uwState;

char *readDataBuf, *writeDataBuf;

#ifdef USE_ROUTING 
	#include "routing.h"
	char receiveBuffer[sizeof (struct Message)];
	char sendBuffer[sizeof (struct Message)];
	struct Message* messageBuf;
	signed char __evt_idle_checkUartMessages(char evt, char* data);
#else
	char receiveBuffer[DEFAULT_PACKET_SIZE];
	char sendBuffer[DEFAULT_PACKET_SIZE];
#endif

#ifdef USE_EVENTS
	#include "events.h"
	
	signed char __evt_interrupt_uartFilter(char evt, char* data);
	
	signed char __evt_init_uart(char evt, char* data){
		uint vector = (uint)DeviceConfig.moduleConfigs[0];
		InitUART((struct UartConfiguration*)(vector));
		
		#ifdef USE_ROUTING
		ESubscribe(EVT_IDLE, __evt_idle_checkUartMessages);			
		#endif		
		
		#ifdef USE_EVENTS
		ESubscribe(EVT_INTERRUPT, __evt_interrupt_uartFilter);
		#endif
		
		return 0;
	}
	
#endif

char InitUART(struct UartConfiguration* cfg){
	uint speed = cfg->speed;
	UART_CR1 = 0; //PARITY ODD + 9Bit (8d+1p)
	UART_CR2 = bit5 + bit3 + bit2; //  RXIE + RX + TX
	UART_CR3 = 0; //1 STOP
	UART_CR4 = 0;
	UART_CR5 = 0;
	
	//0x0B08 - 115200 16 MHz
	//0x0368 - 9600 16 MHz
	//0x0101 - 921600 16
	
	if (speed == 0) speed = 0x0368;

	UART_BRR2 = speed >> 8;
	UART_BRR1 = speed;

	readDataBuf = (char*)&receiveBuffer;

	
	#ifdef USE_ROUTING 		
		messageBuf = (struct Message*)readDataBuf;
	#endif

	#ifdef USE_MESSAGES
		urState.size = sizeof (struct Message);
	#else		
		urState.size = DEFAULT_PACKET_SIZE;
	#endif

	return 1;
}


char CheckUart(void){
	return urState.phase == 06 ? urState.size : 0;
}

char* GetUartData(void){
	if (urState.phase >= 6){
		return readDataBuf;
	}
	else{
		return 0;
	}
}

void ClearUart(void){
	urState.phase = 0;
}

void WaitSend(void){
	while(uwState.phase > 0 && uwState.phase < 3){
		
	}
}

void UartSendData(char* data, uchar size){
	WaitSend();
	uwState.phase = 0;
	uwState.index = 0;
	uwState.size = size;
	#ifdef UART_TX_CRC_VALUE
	uwState.crcCode = UART_TX_CRC_VALUE;
	#endif	
	writeDataBuf = data;
	UART_CR2 |= bit7;//(TIEN) TXE interrupt	
}
	
void UartSendMessage(uchar da, uchar dt, uchar sa, uchar st, char* data, uchar size){
	char i;
	size += 4;
	sendBuffer[0] = da;
	sendBuffer[1] = dt;
	sendBuffer[2] = sa;
	sendBuffer[3] = st;
	for (i = 4; i < size; i++){
		sendBuffer[i] = data[i-4];
	}
	UartSendData((char*)&sendBuffer, size);
}

#ifdef USE_ROUTING
	#include "Routing.h"
	#include "Interrupts.h"
		
	struct Message receiveBuf;

	void UartSendMessageStruct(struct Message* message){
		char i;
		for (i = 0; i < sizeof(struct Message); i++){
			sendBuffer[i] = ((char*)message)[i];
		}
		UartSendData((char*)&sendBuffer, sizeof(struct Message));
	}
	
	void UartSendSized(struct Message* message, uchar size){
		char i;
		size += 4;
		for (i = 0; i < size; i++){
			sendBuffer[i] = ((char*)message)[i];
		}
		UartSendData((char*)&sendBuffer, size);
	}
	
	struct Message* GetUartMessage(void){
		if (urState.phase == 06){
			return messageBuf;
		}
		else{
			return 0;
		}
	}
		
	signed char __evt_idle_checkUartMessages(char evt, char* data){
		struct Message* msg;
		if (CheckUart()){
			msg = GetUartMessage();
			if (msg->dstAddr != 00 && msg->dstAddr != DeviceAddr){
				ClearUart();
				return;
			}
			if (SendMessage(msg)){
				ClearUart();
			}
		}
	}	
	
#endif



void UART_RX_handler(void){
	unsigned char val;
	unsigned int index;
	_asm("SIM");
	res(UART_SR,5);
	val = UART_DR;
	switch (urState.phase){
		case 3: 
			urState.phase = val == 3 ? 6 : 0;
		break;
		case 2:
			if (urState.index >= urState.size){
				urState.phase = val == 3 ? 6 : (val == urState.crcCode ? 3 : 0);
			}
			else{
				receiveBuffer[urState.index] = val;
				urState.crcCode ^= val;
				urState.index++;
			}
		break;
		case 1:
			if (val > 0){
				urState.phase = 2;
				urState.size = val;				
			}
			else{
				urState.phase = 0;
				urState.size = 0;
			}
			urState.index = 0;
		break;
		case 0:
			if (val == 1 || val == 2){
				#ifdef UART_RX_CRC_VALUE
				urState.crcCode = UART_RX_CRC_VALUE;
				#else
				urState.crcCode = 222;
				#endif
				urState.phase = val;
			}
			urState.index = 0;
		break;
	}
	_asm("RIM");
}

void UART_TX_handler(void){
	unsigned char val;
	unsigned char wv;
	_asm("SIM");
	if (uwState.index >= uwState.size){
		if (uwState.phase < 6){
			#ifdef UART_TX_CRC_VALUE
				if (uwState.phase < 3){
					UART_DR = uwState.crcCode;
					uwState.phase = 3;
				}
				else{
					UART_DR = 03;//EOT
					uwState.phase = 6;
				}
			#else
				UART_DR = 03;//EOT
				uwState.phase = 6;
			#endif
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
			uwState.crcCode ^= val;
		}		
		if (uwState.phase == 1){
			UART_DR = uwState.size;
			uwState.phase = 2;
		}
		if (uwState.phase == 0){
			#ifdef UART_TX_UNSIZED_PACKETS
			UART_DR = 2;//SOH
			uwState.phase = 2;
			#else
			UART_DR = 1;//SOH
			uwState.phase = 1;
			#endif
			#ifdef UART_TX_CRC_VALUE
				uwState.crcCode = UART_TX_CRC_VALUE;
			#endif
		}
	}
	_asm("RIM");
}


@interrupt void UART_RX_IRQHandler(void){
	UART_RX_handler();
}

@interrupt void UART_TX_IRQHandler(void){
	UART_TX_handler();
}


#ifdef USE_EVENTS
	#include "interrupts.h"

	signed char __evt_interrupt_uartFilter(char evt, char* data){
		if (data[0] == EVT_INTERRUPT_UART2_RX){
			UART_RX_handler();
		}
		if (data[0] == EVT_INTERRUPT_UART2_TX){
			UART_TX_handler();
		}
	}
#endif