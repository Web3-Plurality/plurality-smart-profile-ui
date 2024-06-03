import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StepContextType {
    stepHistory: string[];
    handleStepper: (val: string) => void;
    handleBack: () => void;
}

// Create context with the StepContextType or undefined initially
const StepContext = createContext<StepContextType | undefined>(undefined);

const StepProvider = ({ children }: { children: ReactNode }) => {
    const [stepHistory, setStepHistory] = useState<string[]>(() => {
        const savedSteps = localStorage.getItem('stepHistory');
        return savedSteps ? JSON.parse(savedSteps) : ['initial'];
    });

    useEffect(() => {
        localStorage.setItem('stepHistory', JSON.stringify(stepHistory));
    }, [stepHistory]);

    const handleStepper = (val: string) => {
        setStepHistory((prev) => [...prev, val]);
    };

    const handleBack = () => {
        setStepHistory((prev) => prev.slice(0, -1));
    };

    return (
        <StepContext.Provider value={{ stepHistory, handleStepper, handleBack }}>
            {children}
        </StepContext.Provider>
    );
};

// Custom hook to use the step context
const useStep = (): StepContextType => {
    const context = useContext(StepContext);
    if (context === undefined) {
        throw new Error('useStep must be used within a StepProvider');
    }
    return context;
};

export { StepProvider, useStep };
