#include "GeneralConfig.h"

volatile struct CONFIGURATION_STRUCT config @0x4000;

struct DeviceState deviceState;

struct CONFIGURATION_STRUCT* LoadConfiguration(void)
{
	char i = 0;
	#ifdef USE_EVENTS	
	struct EventSubscription es;
	//deviceConfig.factoryRec = config.factoryRec;
	//deviceConfig.deviceSettings = config.deviceSettings;
	for (i = 0; i < maxEventSubscriptions; i++){
		es = config.events[i];
		SubscribeEvent(es.eventNum, es.handler);	
	}		
	#endif
	return &config;
}

