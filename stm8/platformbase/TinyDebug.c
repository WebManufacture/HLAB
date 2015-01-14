#include "deviceConfig.h"
#include "utils.h"
#include "generalConfig.h"

//EVENT LOOP
void INIT(void)
{	
	struct CONFIGURATION_STRUCT* config = LoadConfiguration();	
//	FireEvent(EVT_INIT, (char*)config);
}

main()
{	
	unsigned long iteration = 0;
	INIT();
	while (!deviceState.ResetFlag){
		//iteration++;
		//ProcessMessages(iteration);
	//	FireEvent(EVT_IDLE, NULL);
	}
	//FireEvent(EVT_RESET, NULL);
	Reset();
}