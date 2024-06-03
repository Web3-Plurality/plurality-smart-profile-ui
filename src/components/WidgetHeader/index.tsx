import classNames from 'classnames'
import './styles.css'

interface WidgetHeaderProps {
    title: string,
    currentStep: boolean,
    description?: string
}

const defaultProps = {
    description: ''
}

const WidgetHeader = ({ title, currentStep, description }: WidgetHeaderProps) => {
    return (
        <div className="widget-header">
            <h1 className={classNames({ isdescription: description, success: currentStep })}>{title}</h1>
            {description && <p className={classNames({ successDescription: currentStep })}>{description}</p>}
        </div >
    )
}

WidgetHeader.defaultProps = defaultProps
export default WidgetHeader
