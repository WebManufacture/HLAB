#include "Events.h"
#include "Utils.h"
#define maxSubscriptions 10


#define USE_ROUTING 1

struct Message{	
	unsigned int dstAddr;
	unsigned char dstType;
	unsigned int srcAddr;
	unsigned char srcType;
	unsigned char data[MESSAGE_SIZE];
};


struct MessageMask{	
	unsigned char dstAddr;
	unsigned char dstType;	
	unsigned char srcAddr;
	unsigned char srcType;
};

typedef schar (*MessageHandler)(struct Message *message);

struct RouteRecord{	
	unsigned long mask;
	MessageHandler handler;
};

signed char InitRouting(char event, char* data);

void ProcessMessages(unsigned long iteration);
signed char SendMessage(struct Message *message);
signed char SendMessageChain(struct Message *message[]);

void MSubscribe(uchar da, uchar dt, uchar sa, uchar st, MessageHandler handler);
void MSubscribeMask(struct MessageMask mask, MessageHandler handler);
void MUnSubscribe(struct MessageMask mask);
void MUnSubscribeHandler(MessageHandler handler);

