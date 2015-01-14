#include "Consts.h"
#include "gpio.h"

volatile struct Port PE @PE_ODR;
volatile struct Port PF @PF_ODR;
volatile struct Pins PpE @PE_ODR;
volatile struct Pins PpF @PF_ODR;

#define UART_CR1 UART2_CR1
#define UART_CR2 UART2_CR2
#define UART_CR3 UART2_CR3
#define UART_CR4 UART2_CR4
#define UART_CR5 UART2_CR5
#define UART_BRR2 UART2_BRR2
#define UART_BRR1 UART2_BRR1
#define UART_SR UART2_SR
#define UART_DR UART2_DR            

#define UART_RX_IRQHandler @far @interrupt void UART2_RX_IRQHandler(void)
#define UART_TX_IRQHandler @far @interrupt void UART2_TX_IRQHandler(void)
