import classNames from 'classnames'
import styled from 'styled-components'
import { getDescription, getLocalStorageValueofClient, getTitleText } from '../../utils/Helpers'
import { useStepper } from '../../hooks/useStepper'
import { CLIENT_ID } from '../../utils/EnvConfig'
import useResponsive from '../../hooks/useResponsive'

const WidgetHeaderWrapper = styled.div<{ isIframe: boolean, currentStep: string, mobileHeaderText: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${({ isIframe, currentStep, mobileHeaderText }) => (isIframe && (currentStep === 'litLogin' || currentStep === 'otp') ? '30%'
    : isIframe && (currentStep === 'dashboard' || currentStep === 'home' || currentStep === 'wallet') ? '12%' : (mobileHeaderText && !isIframe && (currentStep === 'litLogin' || currentStep === 'otp')) ? '20%': mobileHeaderText && !isIframe && (currentStep === 'success')? '30%' : '')};

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



    &.topSpacingIframeConsent{
      margin-top: -100px;
      margin-bottom: -25px;
    }

    &.topSpacingIframeSigning{
      margin-top: 70px;
    }

    &.topSpacingMedium{
      margin-top: -180px;
    }

    &.topSpacingMediumIframe{
      margin-top: 0px;
    }

    &.profileSetup {
      margin-bottom: -30px;
       margin-top: -40px;
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
      max-width: 235px !important;
      font-size: 12px !important;
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
  const { currentStep } = useStepper()
  const title = getTitleText(currentStep)
  const description = getDescription(currentStep)
  const isIframe = window.self !== window.top;

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  const {isExtraSmallScreen, isMobileScreen } = useResponsive();

  const mobileHeaderText = isMobileScreen || isExtraSmallScreen;

  const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
  const { platforms: socailIcons } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
  const socilasLength = socailIcons?.length

  return (
    <WidgetHeaderWrapper id="w-header" isIframe={isIframe} currentStep={currentStep} mobileHeaderText={mobileHeaderText}>
      <h1 className={
        classNames({
          isdescription: description,
          success: currentStep === "success",
          profileSetup: currentStep === "profileSetup",
          topSpacingMedium: (!isIframe && currentStep === 'socialConnect' && socilasLength < 5),
          topSpacingMediumIframe: (isIframe && currentStep === 'socialConnect' && socilasLength < 5),
          topSpacing: currentStep === 'socialConnect' && !isIframe,
          topSpacingIframe: currentStep === 'socialConnect' && isIframe,
          topSpacingIframeProfile: currentStep === 'profileSettings' && isIframe,
          topSpacingIframeConsent: currentStep === 'consent' && isIframe,
          topSpacingIframeSigning: currentStep === 'signing' && isIframe
        }
        )}
      >
        {title}
      </h1>
      {description && (
        <p className={classNames({ successDescription: currentStep === "success", mobileDesktopDescription: mobileHeaderText && !isIframe })}>
          {description}
        </p>
      )}
    </WidgetHeaderWrapper>
  )
}

WidgetHeader.defaultProps = defaultProps