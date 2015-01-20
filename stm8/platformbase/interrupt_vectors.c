#include "STM8S105C6.h"
/*	BASIC INTERRUPT VECTOR TABLE FOR STM8 devices
 *	Copyright (c) 2007 STMicroelectronics
 */

void main(){
	PA_DDR = 255;
	PA_CR1 = 255;
	PA_ODR = 255;	
	while(1){};
}	
	
typedef void @far (*interrupt_handler_t)(void);

struct interrupt_vector {
	unsigned char interrupt_instruction;
	interrupt_handler_t interrupt_handler;
};

@far @interrupt void NonHandledInterrupt (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}

@far @interrupt void NonHandledInterruptTRAP (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}

@far @interrupt void NonHandledInterruptTLI (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}

@far @interrupt void NonHandledInterruptAWU (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}

@far @interrupt void NonHandledInterruptCLK (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}


@far @interrupt void NonHandledInterruptEXTI (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}


@far @interrupt void NonHandledInterruptFLASH (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}


@far @interrupt void NonHandledInterruptTIM (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}


@far @interrupt void NonHandledInterruptADC (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}


@far @interrupt void UART2Interrupt (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}



@far @interrupt void ReservedInterrupt (void)
{
	/* in order to detect unexpected events during development, 
	   it is recommended to set a breakpoint on the following instruction
	*/
	return;
}

extern void _stext();     /* startup routine */


struct interrupt_vector const _vectab[] = {
	{0x82, (interrupt_handler_t)_stext}, /* reset */
	{0x82, NonHandledInterruptTRAP}, /* trap  */
	{0x82, NonHandledInterruptTLI}, /* irq0  */
	{0x82, NonHandledInterruptAWU}, /* irq1  */
	{0x82, NonHandledInterruptCLK}, /* irq2  */
	{0x82, NonHandledInterruptEXTI}, /* irq3  */
	{0x82, NonHandledInterruptEXTI}, /* irq4  */
	{0x82, NonHandledInterruptEXTI}, /* irq5  */
	{0x82, NonHandledInterruptEXTI}, /* irq6  */
	{0x82, NonHandledInterruptEXTI}, /* irq7  */
	{0x82, ReservedInterrupt}, /* irq8  */
	{0x82, ReservedInterrupt}, /* irq9  */
	{0x82, NonHandledInterrupt}, /* irq10 */
	{0x82, NonHandledInterruptTIM}, /* irq11 */
	{0x82, NonHandledInterruptTIM}, /* irq12 */
	{0x82, (interrupt_handler_t)NonHandledInterrupt}, /* irq13 */
	{0x82, NonHandledInterruptTIM}, /* irq14 */
	{0x82, ReservedInterrupt}, /* irq15 */
	{0x82, ReservedInterrupt}, /* irq16 */
	{0x82, (interrupt_handler_t)NonHandledInterrupt}, /* irq17 */
	{0x82, (interrupt_handler_t)NonHandledInterrupt}, /* irq18 */
	{0x82, NonHandledInterrupt}, /* irq19 I2C */
	{0x82, (interrupt_handler_t)NonHandledInterrupt}, /* irq20 */
	{0x82, (interrupt_handler_t)NonHandledInterrupt}, /* irq21 */
	{0x82, NonHandledInterruptADC}, /* irq22 */
	{0x82, (interrupt_handler_t)NonHandledInterrupt}, /* irq23 */
	{0x82, NonHandledInterruptFLASH}, /* irq24 */
	{0x82, NonHandledInterrupt}, /* irq25 */
	{0x82, NonHandledInterrupt}, /* irq26 */
	{0x82, NonHandledInterrupt}, /* irq27 */
	{0x82, NonHandledInterrupt}, /* irq28 */
	{0x82, NonHandledInterrupt}, /* irq29 */
};
