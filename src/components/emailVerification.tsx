/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import useAuthenticate, { AuthResult } from '../hooks/useAuthenticate';
import { useStepper } from '../hooks/useStepper';

import Loader from './Loader';
import { PayloadDataType } from '../types';
import { ErrorMessages } from '../utils/Constants';
import {
  redirectUserOnLogout,
  setLocalStorageValue,
} from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';
import { storeAuth } from '../services/auth';

interface EmailLoginProps {
  finalPayload: PayloadDataType;
  metamaskAuthError: boolean;
  walletAddress: string;
  handleMetamaskAuthError: (val: boolean) => void;
}

const EmailVerification = ({
  metamaskAuthError,
  walletAddress,
  handleMetamaskAuthError,
}: EmailLoginProps) => {
  const navigate = useNavigate();
  const { goToStep } = useStepper();

  const queryParams = new URLSearchParams(location.search);
  const appClientId = queryParams.get('client_id');
  const clientId = appClientId || CLIENT_ID;

  const handleNavigation = () => {
    const redirectPath = redirectUserOnLogout(clientId, appClientId);
    navigate(redirectPath, { replace: true });
  };

  const {
    authResult,
    authWithMetaMask,
    loading: authLoading,
    error: authError,
  } = useAuthenticate();

  const handleAuthSuccess = (result: AuthResult) => {
    handleNavigation();

    // Store auth data
    storeAuth(clientId, result.address, result.token);

    // Update localStorage with auth info
    const existingDataString = localStorage.getItem(`clientID-${clientId}`);
    let existingData = existingDataString ? JSON.parse(existingDataString) : {};

    existingData = {
      ...existingData,
      token: result.token,
      walletAddress: result.address,
      userId: result.user?.id,
    };

    setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(existingData));

    // Navigate to success
    goToStep('success');
  };

  useEffect(() => {
    const authenticate = async () => {
      // Only MetaMask authentication is supported
      if (walletAddress) {
        if (metamaskAuthError) return;
        const result = await authWithMetaMask(handleMetamaskAuthError);
        if (result) {
          handleAuthSuccess(result);
        }
      }
    };

    authenticate();
  }, [metamaskAuthError, walletAddress]);

  // Handle successful authentication from authResult state
  useEffect(() => {
    if (authResult && !authLoading) {
      handleAuthSuccess(authResult);
    }
  }, [authResult, authLoading]);

  if (authLoading) {
    return <Loader message={'Authenticating with MetaMask...'} />;
  }

  if (authError) {
    goToStep('home');
    message.error(ErrorMessages.GENERAL_ERROR);
    return null;
  }

  return null;
};

export default EmailVerification;
