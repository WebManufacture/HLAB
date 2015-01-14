#include "DeviceConfig.h"
#include "routing.h"

uchar deviceAddr;

@near struct RouteRecord subscribers[maxSubscriptions];

void ProcessMessages(unsigned long iteration){
	
}

void ProcessMessage(struct Message *message)
{
	char i;
	long mask, tmpMask;
	MessageHandler handler;
	mask = *((long*)message);
	for (i = 0; i < maxSubscriptions; i++){
		if (subscribers[i].mask == 0) break;
		tmpMask = subscribers[i].mask & mask;
		if (tmpMask == mask){
			handler = subscribers[i].handler;
			if (handler(message) > 0)	break;
		}
	}
}

signed char SendMessage(struct Message *message){
	return 1;
}

signed char SendMessageChain(struct Message *message[]){
	return 1;
}

void MSubscribeMask(struct MessageMask mask, MessageHandler handler){
	char i;
	for (i = 0; i < maxSubscriptions; i++){
		if (subscribers[i].mask == 0) {
			subscribers[i].mask = *((long*)(&mask));
			subscribers[i].handler = handler;
		}
	}
}

void MSubscribe(uchar da, uchar dt, uchar sa, uchar st, MessageHandler handler){
	char i;
	long mask = da << 24 + dt << 16 + sa << 8 + st;
	for (i = 0; i < maxSubscriptions; i++){
		if (subscribers[i].mask == 0) {
			subscribers[i].mask = mask;
			subscribers[i].handler = handler;
		}
	}
}

void MUnSubscribe(struct MessageMask mask){
	char i, j;
	long searchMask = *((long*)(&mask));
	for (i = 0; i < maxSubscriptions; i++){
		if (subscribers[i].mask == searchMask) {
			if (i >= maxSubscriptions - 1){
				subscribers[i].mask = 0;
				subscribers[i].handler = 0;
			}
			else
			{
				for (j = i + 1; j < maxSubscriptions; j++){
					subscribers[j-1] = subscribers[j];
				}
				subscribers[maxSubscriptions - 1].mask = 0;
				subscribers[maxSubscriptions - 1].handler = 0;
			}
		}
	}
}

void MUnSubscribeHandler(MessageHandler handler){
	char i, j;
	for (i = 0; i < maxSubscriptions; i++){
		if (subscribers[i].handler == handler){
			if (i >= maxSubscriptions - 1){
				subscribers[i].mask = 0;
				subscribers[i].handler = 0;
			}
			else
			{
				for (j = i + 1; j < maxSubscriptions; j++){
					subscribers[j-1] = subscribers[j];
				}
				subscribers[maxSubscriptions - 1].mask = 0;
				subscribers[maxSubscriptions - 1].handler = 0;
			}
		}
	}
}
/*
schar GetFactoryNum(struct Message *message){
	char i;
	long *num;
	message->dstAddr = message->srcAddr;
	message->srcAddr = 00;
	message->dstType = 01;
	num = (long*)(&config.factoryRec);
	for (i = 0; i < 6; i++){
		message->srcType = i+1;
		//message->data = *(num + i);
		ProcessMessage(message);
	}
}
*/

void LoadTable(void)
{
	char i;
	for (i = 0; i < maxSubscriptions; i++){
/*		if (config.routingTable[i].mask > 0){
			subscribers[i] = config.routingTable[i];
		}*/
	}
}

signed char InitRouting(char event, char* data)
{
	LoadTable();
	//SubscribeEvent(EVT_MESSAGE, InitRouting);
	//Subscribe(00, 00, 255, 00, &GetFactoryNum);
	return 0;
}
