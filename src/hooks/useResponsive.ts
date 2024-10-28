import { useEffect, useState } from "react";

const getScreenType = (width: number): 'xSmall' | 'mobile' | 'tablet' | 'desktop' | 'large' => {
    if (width <= 400) return 'xSmall';
    if (width <= 576) return 'mobile';
    if (width <= 834) return 'tablet';
    if (width <= 1440) return 'desktop';
    return 'large';
};

const useResponsive = () => {
    const [screenType, setScreenType] = useState<ReturnType<typeof getScreenType>>(() =>
        typeof window !== 'undefined' ? getScreenType(window.innerWidth) : 'desktop'
    );

    useEffect(() => {
        const handleResize = () => {
            setScreenType(getScreenType(window.innerWidth));
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            handleResize(); // Call once to set the initial state correctly
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    return {
        isExtraSmallScreen: screenType === 'xSmall',
        isMobileScreen: screenType === 'mobile',
        isTabScreen: screenType === 'tablet',
        isDesktopScreen: screenType === 'desktop',
        isLargeScreen: screenType === 'large',
        screenType, // Added for more flexibility
    };
};

export default useResponsive;