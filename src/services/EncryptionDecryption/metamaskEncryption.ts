import { encrypt } from '@metamask/eth-sig-util'

export const metamaskEncryptData = (
    publicKey: string,
    message: string,
    version: string = 'x25519-xsalsa20-poly1305'
) => {
    const encryptedData = encrypt({
        publicKey,
        data: message,
        version
    });
    return encryptedData
}