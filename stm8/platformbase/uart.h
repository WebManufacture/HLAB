#define UART_NONE_PARITY 0
#define UART_ODD_PARITY 1
#define UART_EVEN_PARITY 2

#define UART_PACKET_NO 0
#define UART_PACKET_SIMPLE 1
#define UART_PACKET_SIZED 2

#define UART_DATABITS_7 0
#define UART_DATABITS_8 1
#define UART_DATABITS_9 2

struct UartConfiguration{
	unsigned int speed;
	unsigned char parity : 2;
	unsigned char stopBits : 2;
	unsigned char dataBits : 2;
	unsigned char packetType : 2;
};

char InitUART(struct UartConfiguration* config);
char CheckUart(void);
char* GetUartMessage(void);
void ClearUart(void);

#define UartSend UartSendMessage

#ifndef UartMessage
struct UartMessage{
	char addr;
	char command;
	char data[MESSAGE_SIZE];
};

typedef struct UartMessage UartMessage;
#endif

void UartSendMessage(UartMessage message);
void UartSendSized(UartMessage message, unsigned char size);
void UartSendData(char* data, unsigned char size );
