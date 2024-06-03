export const getTitleText = (prevSteps: string[]) => {
    const currentStep = prevSteps[prevSteps.length - 1];
    const previousStep = prevSteps[prevSteps.length - 2];

    switch (currentStep) {
        case 'initial':
            return 'Login To Your Account';
        case 'login':
            if (previousStep === 'register') {
                return 'Register Your Account';
            } else {
                return 'Enter Your Email';
            }
        case 'register':
            return 'Register Your Account';
        case 'otp':
            return 'Register Your Account';
        case 'success':
            return 'Welcome to Your Metaverse Profile!';
        default:
            return '';
    }
};


export const getDescription = (prevSteps: string[]) => {
    const currentStep = prevSteps[prevSteps.length - 1];
    const previousStep = prevSteps[prevSteps.length - 2];
    switch (currentStep) {
        case 'login':
            if (previousStep === 'register') {
                return 'A verification code will be sent to your emaill';
            } else {
                return '';
            }
        case 'otp':
            return 'Enter the 5 digit code sent to your email';
        case 'success':
            return 'Earn points by connecting your social profiles and metaverse platforms.';
        default:
            return '';
    }
};
