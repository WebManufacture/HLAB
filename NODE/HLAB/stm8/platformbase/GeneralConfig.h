#define maxEventSubscriptions 10
#define maxModulesCount 10
#include "utils.h"
#include "events.h"

struct FactoryRecord {
	long type;
	long ver;
	long num1;
	long num2;	
	long num3;
	long num4;
};

struct DeviceSettings{	
	unsigned char WorkingMode;
	unsigned char setting2;
	unsigned char setting3;
	unsigned char setting4;
	unsigned char setting5;
	unsigned char setting6;
	unsigned char setting7;
	unsigned char setting8;
};

struct EventSubscription{	
	unsigned char eventNum;
	EventHandler handler;
};

struct CONFIGURATION_STRUCT{	
	struct FactoryRecord factoryRec;
	struct DeviceSettings deviceSettings;
	char* moduleConfigs[maxModulesCount];
	struct EventSubscription events[maxEventSubscriptions];	
};

struct DeviceState{	
	uchar ResetFlag : 1;
	uchar reservedFlag1 : 1;
	uchar reservedFlag2 : 1;
	uchar reservedFlag3 : 1;
	uchar reservedFlag4 : 1;
	uchar reservedFlag5 : 1;
	uchar reservedFlag6 : 1;
	uchar reservedFlag7 : 1;	
};

extern struct DeviceState deviceState;

struct CONFIGURATION_STRUCT* LoadConfiguration(void);
