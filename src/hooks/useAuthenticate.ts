import { useCallback, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { authenticateWithStytch } from '../services/Lit';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getLocalStorageValue, isProfileConnectPlatform, isRsmPlatform, setLocalStorageValue } from '../utils/Helpers';
import { goToStep, resetSteps } from '../Slice/stepperSlice';
import { message } from 'antd';

export default function useAuthenticate() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  /**
   * Authenticate with Stytch
   */
  const authWithStytch = useCallback(
    async (accessToken: string, userId?: string, method?: string): Promise<void> => {
      setLoading(true);
      setError(false);
      setAuthMethod(undefined);

      try {
        const result: AuthMethod = await authenticateWithStytch(
          accessToken,
          userId,
          method
        );
        setAuthMethod(result);
      } catch (err) {
        setError(true);
        console.log("Error", err)
        handleLogout()
      } finally {
        setLoading(false);
      }
    },
    []
  );

  async function handleLogout() {
    const smartprofileData = getLocalStorageValue("smartProfileData")
    const tool = getLocalStorageValue("tool")
    const clientId = localStorage.getItem('clientId')
    localStorage.clear();
    setLocalStorageValue("smartProfileData", smartprofileData || '')
    setLocalStorageValue("tool", tool || '')
    dispatch(resetSteps())
    dispatch(goToStep("litLogin"))
    let path = window.location.pathname
    if (isRsmPlatform() || isProfileConnectPlatform()) {
      path = `${window.location.pathname}?client_id=${clientId}`
    }
    navigate(path, { replace: true });
    message.error("Something went wrong, please contact the team")
  }


  return {
    authWithStytch,
    setAuthMethod,
    authMethod,
    loading,
    error,
  };
}
