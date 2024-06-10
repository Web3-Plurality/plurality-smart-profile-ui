import tiktokIcon from './../assets//images/tiktok-icon.png'
import instaIcon from './../assets/images/insta-icon.png'
import snapchatIcon from './../assets/images/snapchat-icon.png'
import cubeIcon from './../assets/images/cube-icon.png'
import fIcon from './../assets/images/f-icon.png'
import SIcon from './../assets/images/s-icon.png'
import openseaIcon from './../assets//images/opensea-icon.png'
import oIcon from './../assets/images/o-icon.png'
import metaIcon from './../assets/images/meta-icon.png'
import appleIcon from './../assets/images/apple-icon.png'
import journeyIcon from './../assets/images/journey-icon.png'

import tiktokIconColored from './../assets//images/tiktok-icon-colored.png'
import instaIconColored from './../assets/images/insta-icon-colored.png'
import snapchatIconColored from './../assets/images/snapchat-icon-colored.png'
import cubeIconColored from './../assets/images/cube-icon-colored.png'
import fIconColored from './../assets/images/f-icon-colored.png'
import SIconColored from './../assets/images/s-icon-colored.png'
import openseaIconColored from './../assets//images/opensea-icon-colored.png'
import oIconColored from './../assets/images/o-icon-colored.png'
import metaIconColored from './../assets/images/meta-icon-colored.png'
import appleIconColored from './../assets/images/apple-icon-colored.png'
import journeyIconColored from './../assets/images/journey-icon-colored.png'

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

export const socialConnectButtons = [
    {id: 1, iconName:"tiktok", icon: tiktokIcon, active: false, activeIcon: tiktokIconColored},
    {id: 2, iconName:"insta", icon: instaIcon, active: false, activeIcon: instaIconColored },
    {id: 3, iconName:"snapchat", icon: snapchatIcon, active: false, activeIcon: snapchatIconColored },
    {id: 4, iconName:"cubeIcon", icon: cubeIcon, active: false, activeIcon: cubeIconColored },
    {id: 5, iconName:"fIcon", icon: fIcon, active: false, activeIcon: fIconColored },
    {id: 6, iconName:"sIcon", icon: SIcon, active: false, activeIcon: SIconColored },
    {id: 7, iconName:"opensea", icon: openseaIcon, active: false, activeIcon: openseaIconColored },
    {id: 8, iconName:"oIcon", icon: oIcon, active: false, activeIcon: oIconColored },
    {id: 9, iconName:"meta", icon: metaIcon, active: false, activeIcon: metaIconColored},
    {id: 10, iconName:"apple", icon: appleIcon, active: false, activeIcon: appleIconColored },
    {id: 11, iconName:"midJourney", icon: journeyIcon, active: false, activeIcon: journeyIconColored },
]
