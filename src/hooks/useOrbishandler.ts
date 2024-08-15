import { useState } from 'react';
import { useStep } from '../context/StepContext';

export const useOrbisHandler = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { handleStepper } = useStep();

    const sumbitDataToOrbis = () => {
        try {
            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
                handleStepper('socialConfirmation')
            }, 2000)
        } catch (err) {
            console.log("Error")
        }
    }


    return {
        sumbitDataToOrbis,
        isLoading
    }
};