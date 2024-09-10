//encryption&decryption
import { encrypt } from '@metamask/eth-sig-util'
import { AccessControlConditions, SessionSigsMap } from '@lit-protocol/types';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { litNodeClient } from './lit';

export const getAccessControlConditions = async (): Promise<AccessControlConditions> => {
  const currentPkp = localStorage.getItem('pkpKey')

  // Lit encrption & decrption
  const accessControlConditions: AccessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum", // todo: this needs to be ethereum otherwise throws an error! Need to see
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: currentPkp ? JSON.parse(currentPkp).ethAddress : ''
      },
    },
  ];
  return accessControlConditions;
};


export const litEncryptData = async (message: string):
  Promise<{ ciphertext: string; dataToEncryptHash: string } | undefined> => {
  try {
    await litNodeClient.connect();
    const accessControlConditions = await getAccessControlConditions();
    // Encrypt the message

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        dataToEncrypt: message,
        // chain: 'ethereum',
        // sessionSigs: sessionSigs
      },
      litNodeClient,
    );

    // Return the ciphertext and dataToEncryptHash
    return {
      ciphertext,
      dataToEncryptHash,
    }
  } catch (err) {
    // alert(err);
    console.error(err);
  }
}

export const litDecryptData = async (sessionSigs: SessionSigsMap, ciphertext: string, dataToEncryptHash: string) => {
  try {
    await litNodeClient.connect();
    const accessControlConditions = await getAccessControlConditions();

    // Decrypt the message
    const decryptedMessage = await LitJsSdk.decryptToString(
      {
        accessControlConditions,
        ciphertext: ciphertext,
        dataToEncryptHash: dataToEncryptHash,
        chain: 'ethereum',
        sessionSigs: sessionSigs
      },
      litNodeClient,
    );
    // Return the decrypted message
    return {
      decryptedMessage
    };
  } catch (err) {
    //alert(err);
    console.error(err);
  }
}


// Metamask encrption & decryption
export const metamaskEncryptData = (publicKey: string, message: string, version: string = 'x25519-xsalsa20-poly1305') => {
  const encryptedData = encrypt({
    publicKey: publicKey ?? "",
    data: message,
    version: version
  });
  return encryptedData
}

export const metamaskDecryptData = async (encryptedData: string) => {
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const decrypt = await window.ethereum.request({
    method: 'eth_decrypt',
    params: [`0x${Buffer.from(encryptedData, "utf8").toString("hex")}`, accounts[0]],
  });
  return decrypt
}
