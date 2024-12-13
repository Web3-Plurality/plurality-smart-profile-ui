import { useContext } from "react";
import { StepperContext, StepperContextType } from "../contexts/stepper";

export const useStepper = (): StepperContextType => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error("useStepper must be used within a StepperProvider");
    }
    return context;
};
