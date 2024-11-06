import classNames from 'classnames'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectCurrentStep } from '../../selectors/stepperSelector'
import { getDescription, getTitleText } from '../../utils/Helpers'

const WidgetHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.toggleShow {
    display: none;
  }

  h1 {
    font-size: 30px;
    text-align: center;

    &.success {
      max-width: 80%;
    }

    &.isdescription {
      margin: 0;
    }

    &.topSpacing {
      margin-top: -30px;
    }

    &.topSpacingIframe{
      margin-top: -20px;
    }

    &.topSpacingIframeProfile{
      margin-top: 5px;
    }

    @media (max-width: 834px) {
      font-size: 23px !important;
      display: flex;

    }

    @media (max-width: 575.98px) {
      font-size: 28px !important;
      display: flex;

      img {
        margin-left: 10px;
      }
    }
    @media (max-width: 410px) {
      font-size: 22px !important;
    }

    @media (max-width: 360px) {
      font-size: 18px !important;
    }
  }

  p {
    font-size: 18px;
    margin: 0.3rem 0 1.5rem 0;
    text-align: center;

    &.successDescription {
      max-width: 80% !important;
      margin-top: 3rem !important;
    }

    @media (max-width: 440px) {
      font-size: 16px !important;
    }

    @media (max-width: 400px) {
      font-size: 14px !important;
    }
  }
`

const defaultProps = {
  description: ''
}

export default function WidgetHeader() {
  const currentStep = useSelector(selectCurrentStep)
  const title = getTitleText(currentStep)
  const description = getDescription(currentStep)
  const isIframe = window.self !== window.top;

  return (
    <WidgetHeaderWrapper id="w-header">
      <h1 className={
        classNames({
          isdescription: description,
          success: currentStep === "success",
          topSpacing: currentStep === 'socialConnect' && !isIframe,
          topSpacingIframe: currentStep === 'socialConnect' && isIframe,
          topSpacingIframeProfile: currentStep === 'profileSettings' && isIframe
        }
        )}
      >
        {title}
      </h1>
      {description && (
        <p className={classNames({ successDescription: currentStep === "success" })}>
          {description}
        </p>
      )}
    </WidgetHeaderWrapper>
  )
}

WidgetHeader.defaultProps = defaultProps