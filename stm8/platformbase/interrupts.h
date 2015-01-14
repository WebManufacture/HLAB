#define INTERRUPT @far @interrupt
#define INTERRUPT_HANDLER(a,b) @far @interrupt void a(void)
#define INTERRUPT_HANDLER_TRAP(a) @far @interrupt void a(void)
 
void _stext(void); /* RESET startup routine */
INTERRUPT void NonHandledInterrupt(void);


INTERRUPT void TRAP_IRQHandler(void); /* TRAP */
INTERRUPT void TLI_IRQHandler(void); /* TLI */
INTERRUPT void AWU_IRQHandler(void); /* AWU */
INTERRUPT void CLK_IRQHandler(void); /* CLOCK */
INTERRUPT void EXTI_PORTA_IRQHandler(void); /* EXTI PORTA */
INTERRUPT void EXTI_PORTB_IRQHandler(void); /* EXTI PORTB */
INTERRUPT void EXTI_PORTC_IRQHandler(void); /* EXTI PORTC */
INTERRUPT void EXTI_PORTD_IRQHandler(void); /* EXTI PORTD */
INTERRUPT void EXTI_PORTE_IRQHandler(void); /* EXTI PORTE */
INTERRUPT void EXTI_PORTF_IRQHandler(void); /* EXTI PORTF */
INTERRUPT void EXTI_PORTG_IRQHandler(void); /* EXTI PORTF */
INTERRUPT void EXTI_PORTI_IRQHandler(void); /* EXTI PORTF */

INTERRUPT void CAN_RX_IRQHandler(void); /* CAN RX */
INTERRUPT void CAN_TX_IRQHandler(void); /* CAN TX/ER/SC */

INTERRUPT void SPI_IRQHandler(void); /* SPI */

INTERRUPT void TIM1_CAP_COM_IRQHandler(void); /* TIM1 CAP/COM */
INTERRUPT void TIM1_UPD_OVF_TRG_BRK_IRQHandler(void); /* TIM1 UPD/OVF/TRG/BRK */
 INTERRUPT void TIM2_UPD_OVF_BRK_IRQHandler(void); /* TIM2 UPD/OVF/BRK */
 INTERRUPT void TIM2_CAP_COM_IRQHandler(void); /* TIM2 CAP/COM */
 INTERRUPT void TIM3_UPD_OVF_BRK_IRQHandler(void); /* TIM3 UPD/OVF/BRK */
 INTERRUPT void TIM3_CAP_COM_IRQHandler(void); /* TIM3 CAP/COM */
 INTERRUPT void TIM4_UPD_OVF_IRQHandler(void); /* TIM4 UPD/OVF */ 
 INTERRUPT void TIM5_UPD_OVF_BRK_TRG_IRQHandler(void); /* TIM5 UPD/OVF/BRK/TRG */
 INTERRUPT void TIM5_CAP_COM_IRQHandler(void); /* TIM5 CAP/COM */
 INTERRUPT void TIM6_UPD_OVF_TRG_IRQHandler(void); /* TIM6 UPD/OVF/TRG */
 
 INTERRUPT void I2C_IRQHandler(void); /* I2C */
 
 INTERRUPT void UART1_TX_IRQHandler(void); /* UART1 TX */
 INTERRUPT void UART1_RX_IRQHandler(void); /* UART1 RX */
 INTERRUPT void UART2_RX_IRQHandler(void); /* UART2 RX */
 INTERRUPT void UART2_TX_IRQHandler(void); /* UART2 TX */
 INTERRUPT void UART3_RX_IRQHandler(void); /* UART3 RX */
 INTERRUPT void UART3_TX_IRQHandler(void); /* UART3 TX */
 
 INTERRUPT void ADC2_IRQHandler(void); /* ADC2 */
 INTERRUPT void ADC1_IRQHandler(void); /* ADC1 */
 INTERRUPT void EEPROM_EEC_IRQHandler(void); /* EEPROM ECC CORRECTION */

/******************* (C) COPYRIGHT 2011 STMicroelectronics *****END OF FILE****/
