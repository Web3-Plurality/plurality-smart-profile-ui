import { useState } from 'react'
import { RouteMapper } from './utils'
import { BASE_URL } from './constants'
import axios from 'axios'
import { metamaskEncryptData, metamaskDecryptData } from './crypto'
import { insert, select, connectOrbisDidPkh } from './orbis';
import { litEncryptData, litDecryptData } from './crypto'
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey'

export const useRegisterEvent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [app, setApp] = useState('')
    const [cipher, setCipher] = useState('')
    const [cipherHash, setCipherHash] = useState('')

    const { getPublicKey } = useMetamaskPublicKey()

    const registerEvent = async (appName: string) => {
        try {
            const evtSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/register-event`, { withCredentials: true });
            evtSource.onmessage = function (event) {
                const { message, app, id, auth } = JSON.parse(event?.data);
                setMessage(message);
                setApp(app);
                console.log('Message: ', event.data)
                if (message === "received") {
                    fetchUserInfo(app, auth)
                } else {
                    socialConnect(id, appName)
                }
            };

            evtSource.onerror = function (err) {
                console.error('EventSource failed:', err);
                setError('EventSource failed'); // Ensure you're setting the error correctly
                evtSource.close();
            };

            return () => {
                evtSource.close();
            };
        } catch (error) {
            console.error('Error setting up EventSource:', error);
        }
    };


    const socialConnect = (id: string, appName: string) => {
        const AppRoute = RouteMapper(appName)
        const newWindow = window.open(`/auth-start?sse_id=${id}&route=${AppRoute}`, `oauth-${appName}`, 'width=500,height=600');
        if (!newWindow) {
            alert('Failed to open window. It might be blocked by a popup blocker.');
        }
    }

    const ecryptData = async (dataToEncrypt: string) => {
        let encryptionResult: string;
        const sessionSigs = localStorage.getItem("signature")
        if (sessionSigs) {
            console.log("Using Lit encryption")
            const result = await litEncryptData(dataToEncrypt)
            if (result) {
                setCipher(result?.ciphertext)
                setCipherHash(result?.dataToEncryptHash)
            }
            encryptionResult = JSON.stringify(result)
            console.log("Dataa: ", encryptionResult)
        } else {
            console.log("Using metamask encryption")
            const publickey = await getPublicKey()
            console.log("the public key is:", publickey)
            const result = metamaskEncryptData(publickey, dataToEncrypt)
            if (result) setCipher(result?.ciphertext)
            encryptionResult = JSON.stringify(result)
            console.log("Dataa: ", encryptionResult)
        }

        /// TO DO: sepearte logic
        await connectOrbisDidPkh();
        await insert(encryptionResult);
    }

    const decryptData = async () => {
        let decryptionResult;
        const sessionSigs = JSON.parse(localStorage.getItem("signature") ?? '')
        if (sessionSigs) {
            console.log("Using Lit decryption")
            const result = await litDecryptData(sessionSigs, cipher, cipherHash)
            if (result && typeof result === 'object') {
                decryptionResult = JSON.parse(result.decryptedMessage);
                console.log("Dataa: ", decryptionResult);
            } else {
                throw new Error("Invalid result from Lit decryption");
            }
        } else {
            console.log("Using metamask decryption")
            const result = await metamaskDecryptData(cipher)
            decryptionResult = JSON.parse(result)
            console.log("Dataa: ", decryptionResult)
        }
        return decryptionResult
    }

    const fetchUserInfo = async (appName: string, auth: string) => {
        const AppRoute = RouteMapper(appName)
        const infoUrl = `${BASE_URL}${AppRoute}/info`
        try {
            setIsLoading(true)
            const response = await axios.get(infoUrl, {
                headers: {
                    'x-token-id': auth
                }
            })
            console.log(response.data)
            //// dont encrypt here
            // ecryptData(JSON.stringify(response.data))

        } catch (err) {
            setError('Error')
            decryptData()
        } finally {
            setIsLoading(false)
        }
    }

    //   // TODO replace this with the data we get from BE
    //   const dataToEncrypt = "this is my msg"
    //   console.log("the msg to encypt is", dataToEncrypt)
    //   const sessionSigs = JSON.parse(localStorage.getItem("signature") ?? '')
    //   // TODO why this sessionSigs is always undefined even if I log in via Lit???
    //   if (sessionSigs) {
    //       console.log("Using Lit encrption:", sessionSigs)

    //       const encryptionResult = await litEncryptData(sessionSigs, dataToEncrypt)
    //       if (encryptionResult) {
    //           const { ciphertext, dataToEncryptHash } = encryptionResult
    //           console.log("the ciphertext is", ciphertext)
    //           const decrptedText = await litDecryptData(sessionSigs, ciphertext, dataToEncryptHash)
    //           console.log("decrpted text:", decrptedText)

    //           // connect to orbis
    //           await connectOrbisDidPkh();
    //           // push ciphertext to Obris
    //           // TODO we need to think abut how to put ciphertext and dataToEncrptHash into orbis
    //           await insert(JSON.stringify(ciphertext));
    //       }

    //   } else {
    //       console.log("Using metamask encrtion")

    //       const publickey = await getPublicKey()
    //       console.log("the public key is:", publickey)
    //       const ciphertext = metamaskEncryptData(publickey, dataToEncrypt)
    //       console.log("the ciphertext is", ciphertext)
    //       const decrptedText = await metamaskDecryptData(ciphertext)
    //       console.log("decrpted text:", decrptedText)

    //       // connect to orbis
    //       await connectOrbisDidPkh();
    //       // push ciphertext to Obris
    //       await insert(JSON.stringify(ciphertext));
    //   }

    //   // we can see that the ciphertext is been posted
    //   const allrows = await select();
    //   // verifiy it from console
    //   console.log(allrows)


    return {
        message,
        app,
        isLoading,
        error,
        registerEvent,
    }

}


