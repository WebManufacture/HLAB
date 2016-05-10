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