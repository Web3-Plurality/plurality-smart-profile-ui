import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getLocalStorageValueofClient } from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';

const clientId = new URLSearchParams(location.search).get('client_id') || CLIENT_ID;

interface Stepper {
    stepHistory: string[];
    currentStep: string;
    previousStep: string;
}

export interface StepperContextType {
    currentStep: string;
    previousStep: string;
    stepHistory: string[];
    goToStep: (step: string) => void;
    goBack: () => void;
    resetSteps: () => void;
}

export const StepperContext = createContext<StepperContextType | undefined>(undefined);

interface StepperProviderProps {
    children: ReactNode;
}

export const StepperProvider: React.FC<StepperProviderProps> = ({ children }) => {
    const [stepper, setStepper] = useState<Stepper>(() => {
        const existingData = getLocalStorageValueofClient(`clientID-${clientId}`);
        if (existingData && existingData.stepper) {
            return existingData.stepper;
        }
        return {
            stepHistory: ['home'],
            currentStep: 'home',
            previousStep: '',
        };
    });

    useEffect(() => {
        const existingData = getLocalStorageValueofClient(`clientID-${clientId}`)
        const updatedData = {
            ...existingData,
            stepper
        }
        localStorage.setItem(`clientID-${clientId}`, JSON.stringify(updatedData));
    }, [stepper]);

    const goToStep = (step: string) => {
        setStepper((prev) => {
            const existingData = getLocalStorageValueofClient(`clientID-${clientId}`);
            let updatedStepper = prev;

            if (existingData && existingData.stepper) {
                updatedStepper = existingData.stepper;
            }

            const updatedHistory = new Set(updatedStepper.stepHistory);
            updatedHistory.add(step);

            const updatedHistoryList = Array.from(updatedHistory)
            const prevstep = updatedHistoryList[updatedHistoryList.length - 2]

            const newStepper = {
                stepHistory: updatedHistoryList,
                currentStep: step,
                previousStep: prevstep,
            };

            const updatedData = {
                ...existingData,
                stepper: newStepper
            }

            localStorage.setItem(`clientID-${clientId}`, JSON.stringify(updatedData));

            return newStepper;
        });
    };


    const goBack = () => {
        setStepper((prev) => {
            const existingData = getLocalStorageValueofClient(`clientID-${clientId}`);
            let updatedStepper = prev;

            if (existingData && existingData.stepper) {
                updatedStepper = existingData.stepper;
            }
            const updatedHistory = [...updatedStepper.stepHistory];
            updatedHistory.pop();

            const newStepper = {
                stepHistory: updatedHistory,
                currentStep: updatedHistory[updatedHistory.length - 1] || 'home',
                previousStep: updatedStepper.currentStep,
            };

            const updatedData = {
                ...existingData,
                stepper: newStepper
            }

            localStorage.setItem(`clientID-${clientId}`, JSON.stringify(updatedData));

            return newStepper;
        });
    };


    const resetSteps = () => {
        setStepper(() => {
            const existingData = getLocalStorageValueofClient(`clientID-${clientId}`);

            const newStepper = {
                stepHistory: ['home'],
                currentStep: 'home',
                previousStep: '',
            };
            const updatedData = {
                ...existingData,
                stepper: newStepper,
            };

            localStorage.setItem(`clientID-${clientId}`, JSON.stringify(updatedData));

            return newStepper;
        });
    };


    return (
        <StepperContext.Provider value={{
            currentStep: stepper.currentStep,
            previousStep: stepper.previousStep,
            stepHistory: stepper.stepHistory,
            goToStep,
            goBack,
            resetSteps
        }}>
            {children}
        </StepperContext.Provider>
    );
};
