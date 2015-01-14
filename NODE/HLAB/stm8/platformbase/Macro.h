#define bit0 1
#define bit1 2
#define bit2 4
#define bit3 8
#define bit4 16
#define bit5 32
#define bit6 64 
#define bit7 128

/*
typedef unsigned char uchar;
typedef signed char schar;
typedef unsigned int uint;
typedef signed int sint;
typedef unsigned long ulong;
typedef signed long slong;
*/

#define schar signed char
#define uchar unsigned char
#define sint signed int
#define uint unsigned int
#define slong signed long
#define ulong unsigned long

#define NULL 0

#define TIM_CR_bit_CEN 0
#define TIM_CR_bit_ARPE 7
#define TIM_CCER1_bit_CCE2 4
#define TIM_CCER1_bit_CCP2 5
#define TIM_CCER1_bit_CCE1 0
#define TIM_CCER1_bit_CCP1 1
#define TIM_CCER2_bit_CCE3 0
#define TIM_CCER2_bit_CCP3 1
#define TIM_CCMR_bit_OCPE 3
#define TIM_CCMR_bit_OCM4 6
#define TIM_CCMR_bit_OCM2 5
#define TIM_CCMR_bit_OCM1 4
#define TIM4_CR1_bit_OPM 3	
#define PD_CR1_bit_C10 0
#define PD_CR2_bit_C20 0

#define set(addr, num) addr |= bit##num;
#define res(addr, num) addr &= 255-bit##num;

