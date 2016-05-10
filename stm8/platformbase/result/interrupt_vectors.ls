   1                     ; C Compiler for STM8 (COSMIC Software)
   2                     ; Generator V4.2.8 - 03 Dec 2008
   3                     ; Optimizer V4.2.8 - 03 Dec 2008
2808                     ; 6 void main(){
2810                     	switch	.text
2811  0000               _main:
2815                     ; 7 	PA_DDR = 255;
2817  0000 35ff5002      	mov	_PA_DDR,#255
2818                     ; 8 	PA_CR1 = 255;
2820  0004 35ff5003      	mov	_PA_CR1,#255
2821                     ; 9 	PA_ODR = 255;	
2823  0008 35ff5000      	mov	_PA_ODR,#255
2824  000c               L1002:
2826  000c 20fe          	jra	L1002
2850                     ; 20 @far @interrupt void NonHandledInterrupt (void)
2850                     ; 21 {
2852                     	switch	.text
2853  000e               f_NonHandledInterrupt:
2857                     ; 25 	return;
2860  000e 80            	iret	
2883                     ; 28 @far @interrupt void NonHandledInterruptTRAP (void)
2883                     ; 29 {
2884                     	switch	.text
2885  000f               f_NonHandledInterruptTRAP:
2889                     ; 33 	return;
2892  000f 80            	iret	
2915                     ; 36 @far @interrupt void NonHandledInterruptTLI (void)
2915                     ; 37 {
2916                     	switch	.text
2917  0010               f_NonHandledInterruptTLI:
2921                     ; 41 	return;
2924  0010 80            	iret	
2947                     ; 44 @far @interrupt void NonHandledInterruptAWU (void)
2947                     ; 45 {
2948                     	switch	.text
2949  0011               f_NonHandledInterruptAWU:
2953                     ; 49 	return;
2956  0011 80            	iret	
2979                     ; 52 @far @interrupt void NonHandledInterruptCLK (void)
2979                     ; 53 {
2980                     	switch	.text
2981  0012               f_NonHandledInterruptCLK:
2985                     ; 57 	return;
2988  0012 80            	iret	
3011                     ; 61 @far @interrupt void NonHandledInterruptEXTI (void)
3011                     ; 62 {
3012                     	switch	.text
3013  0013               f_NonHandledInterruptEXTI:
3017                     ; 66 	return;
3020  0013 80            	iret	
3043                     ; 70 @far @interrupt void NonHandledInterruptFLASH (void)
3043                     ; 71 {
3044                     	switch	.text
3045  0014               f_NonHandledInterruptFLASH:
3049                     ; 75 	return;
3052  0014 80            	iret	
3075                     ; 79 @far @interrupt void NonHandledInterruptTIM (void)
3075                     ; 80 {
3076                     	switch	.text
3077  0015               f_NonHandledInterruptTIM:
3081                     ; 84 	return;
3084  0015 80            	iret	
3107                     ; 88 @far @interrupt void NonHandledInterruptADC (void)
3107                     ; 89 {
3108                     	switch	.text
3109  0016               f_NonHandledInterruptADC:
3113                     ; 93 	return;
3116  0016 80            	iret	
3138                     ; 97 @far @interrupt void UART2Interrupt (void)
3138                     ; 98 {
3139                     	switch	.text
3140  0017               f_UART2Interrupt:
3144                     ; 102 	return;
3147  0017 80            	iret	
3169                     ; 107 @far @interrupt void ReservedInterrupt (void)
3169                     ; 108 {
3170                     	switch	.text
3171  0018               f_ReservedInterrupt:
3175                     ; 112 	return;
3178  0018 80            	iret	
3180                     .const:	section	.text
3181  0000               __vectab:
3182  0000 82            	dc.b	130
3184  0001 00            	dc.b	page(__stext)
3185  0002 0000          	dc.w	__stext
3186  0004 82            	dc.b	130
3188  0005 0f            	dc.b	page(f_NonHandledInterruptTRAP)
3189  0006 000f          	dc.w	f_NonHandledInterruptTRAP
3190  0008 82            	dc.b	130
3192  0009 10            	dc.b	page(f_NonHandledInterruptTLI)
3193  000a 0010          	dc.w	f_NonHandledInterruptTLI
3194  000c 82            	dc.b	130
3196  000d 11            	dc.b	page(f_NonHandledInterruptAWU)
3197  000e 0011          	dc.w	f_NonHandledInterruptAWU
3198  0010 82            	dc.b	130
3200  0011 12            	dc.b	page(f_NonHandledInterruptCLK)
3201  0012 0012          	dc.w	f_NonHandledInterruptCLK
3202  0014 82            	dc.b	130
3204  0015 13            	dc.b	page(f_NonHandledInterruptEXTI)
3205  0016 0013          	dc.w	f_NonHandledInterruptEXTI
3206  0018 82            	dc.b	130
3208  0019 13            	dc.b	page(f_NonHandledInterruptEXTI)
3209  001a 0013          	dc.w	f_NonHandledInterruptEXTI
3210  001c 82            	dc.b	130
3212  001d 13            	dc.b	page(f_NonHandledInterruptEXTI)
3213  001e 0013          	dc.w	f_NonHandledInterruptEXTI
3214  0020 82            	dc.b	130
3216  0021 13            	dc.b	page(f_NonHandledInterruptEXTI)
3217  0022 0013          	dc.w	f_NonHandledInterruptEXTI
3218  0024 82            	dc.b	130
3220  0025 13            	dc.b	page(f_NonHandledInterruptEXTI)
3221  0026 0013          	dc.w	f_NonHandledInterruptEXTI
3222  0028 82            	dc.b	130
3224  0029 18            	dc.b	page(f_ReservedInterrupt)
3225  002a 0018          	dc.w	f_ReservedInterrupt
3226  002c 82            	dc.b	130
3228  002d 18            	dc.b	page(f_ReservedInterrupt)
3229  002e 0018          	dc.w	f_ReservedInterrupt
3230  0030 82            	dc.b	130
3232  0031 0e            	dc.b	page(f_NonHandledInterrupt)
3233  0032 000e          	dc.w	f_NonHandledInterrupt
3234  0034 82            	dc.b	130
3236  0035 15            	dc.b	page(f_NonHandledInterruptTIM)
3237  0036 0015          	dc.w	f_NonHandledInterruptTIM
3238  0038 82            	dc.b	130
3240  0039 15            	dc.b	page(f_NonHandledInterruptTIM)
3241  003a 0015          	dc.w	f_NonHandledInterruptTIM
3242  003c 82            	dc.b	130
3244  003d 0e            	dc.b	page(f_NonHandledInterrupt)
3245  003e 000e          	dc.w	f_NonHandledInterrupt
3246  0040 82            	dc.b	130
3248  0041 15            	dc.b	page(f_NonHandledInterruptTIM)
3249  0042 0015          	dc.w	f_NonHandledInterruptTIM
3250  0044 82            	dc.b	130
3252  0045 18            	dc.b	page(f_ReservedInterrupt)
3253  0046 0018          	dc.w	f_ReservedInterrupt
3254  0048 82            	dc.b	130
3256  0049 18            	dc.b	page(f_ReservedInterrupt)
3257  004a 0018          	dc.w	f_ReservedInterrupt
3258  004c 82            	dc.b	130
3260  004d 0e            	dc.b	page(f_NonHandledInterrupt)
3261  004e 000e          	dc.w	f_NonHandledInterrupt
3262  0050 82            	dc.b	130
3264  0051 0e            	dc.b	page(f_NonHandledInterrupt)
3265  0052 000e          	dc.w	f_NonHandledInterrupt
3266  0054 82            	dc.b	130
3268  0055 0e            	dc.b	page(f_NonHandledInterrupt)
3269  0056 000e          	dc.w	f_NonHandledInterrupt
3270  0058 82            	dc.b	130
3272  0059 0e            	dc.b	page(f_NonHandledInterrupt)
3273  005a 000e          	dc.w	f_NonHandledInterrupt
3274  005c 82            	dc.b	130
3276  005d 0e            	dc.b	page(f_NonHandledInterrupt)
3277  005e 000e          	dc.w	f_NonHandledInterrupt
3278  0060 82            	dc.b	130
3280  0061 16            	dc.b	page(f_NonHandledInterruptADC)
3281  0062 0016          	dc.w	f_NonHandledInterruptADC
3282  0064 82            	dc.b	130
3284  0065 0e            	dc.b	page(f_NonHandledInterrupt)
3285  0066 000e          	dc.w	f_NonHandledInterrupt
3286  0068 82            	dc.b	130
3288  0069 14            	dc.b	page(f_NonHandledInterruptFLASH)
3289  006a 0014          	dc.w	f_NonHandledInterruptFLASH
3290  006c 82            	dc.b	130
3292  006d 0e            	dc.b	page(f_NonHandledInterrupt)
3293  006e 000e          	dc.w	f_NonHandledInterrupt
3294  0070 82            	dc.b	130
3296  0071 0e            	dc.b	page(f_NonHandledInterrupt)
3297  0072 000e          	dc.w	f_NonHandledInterrupt
3298  0074 82            	dc.b	130
3300  0075 0e            	dc.b	page(f_NonHandledInterrupt)
3301  0076 000e          	dc.w	f_NonHandledInterrupt
3302  0078 82            	dc.b	130
3304  0079 0e            	dc.b	page(f_NonHandledInterrupt)
3305  007a 000e          	dc.w	f_NonHandledInterrupt
3306  007c 82            	dc.b	130
3308  007d 0e            	dc.b	page(f_NonHandledInterrupt)
3309  007e 000e          	dc.w	f_NonHandledInterrupt
3360                     	xdef	__vectab
3361                     	xref	__stext
3362                     	xdef	f_ReservedInterrupt
3363                     	xdef	f_UART2Interrupt
3364                     	xdef	f_NonHandledInterruptADC
3365                     	xdef	f_NonHandledInterruptTIM
3366                     	xdef	f_NonHandledInterruptFLASH
3367                     	xdef	f_NonHandledInterruptEXTI
3368                     	xdef	f_NonHandledInterruptCLK
3369                     	xdef	f_NonHandledInterruptAWU
3370                     	xdef	f_NonHandledInterruptTLI
3371                     	xdef	f_NonHandledInterruptTRAP
3372                     	xdef	f_NonHandledInterrupt
3373                     	xdef	_main
3392                     	end
