import { useState } from 'react'
import WidgetLayout from '../components/appLayout'
import SelectLoginType from '../components/SelectLoginType'
import EmailLogin from '../components/EmailLogin'

const Login = () => {
    const [stepHistory, setStepHistory] = useState(['initial'])

    const handleStepper = (val: string) => {
        setStepHistory((prev) => [...prev, val])
    }

    const handleBack = () => {
        setStepHistory((prev) => prev.slice(0, -1))
    }


    const conditionalRendrer = () => {
        const currentStep = stepHistory[stepHistory.length - 1]
        switch (currentStep) {
            case 'initial':
                return <SelectLoginType handleStepper={handleStepper} />
            // To be continued
            case 'email':
                return <EmailLogin />
            default:
                <div>Test div</div>
        }
    }

    return (
        <WidgetLayout
            handleBack={handleBack}
            showBackButton={stepHistory.length > 1}
        >
            {conditionalRendrer()}
        </WidgetLayout>
    )
}

export default Login
