#define maxEvents 10


#define EVT_RESET 0
#define EVT_INIT 1
#define EVT_IDLE 2
#define EVT_MESSAGE_IN 3
#define EVT_MESSAGE_OUT 4

#ifndef EVENTS_MODULE

#define EVENTS_MODULE 1
typedef signed char (*EventHandler)(char event, char* data);

#endif

#define ESubscribe SubscribeEvent

signed char FireEvent(char event, char* data);
void SubscribeEvent(char event, EventHandler handler);
