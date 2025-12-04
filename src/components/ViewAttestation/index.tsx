import { message } from "antd"
import styled from "styled-components"
import { CLIENT_ID } from "../../utils/EnvConfig"
import { getLocalStorageValueofClient } from "../../utils/Helpers"

const AttestationWrapper = styled.div`
  padding: 30px;
  border-radius: 25px;
  text-align: center;
  font-family: "Lexend", sans-serif;
  max-width: 600px;
  width: 100%;

  @media (max-width: 400px) {
    padding: 20px;
  }
`;

const AttestationCard = styled.div`
  padding: 20px;
  border-radius: 15px;
  background: #f9f9f9;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff;
  text-align: left;

  @media (max-width: 400px) {
    padding: 15px;
  }
`;

const AttestationTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #4c4c4c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;

  @media (max-width: 400px) {
    font-size: 16px;
  }
`;

const AttestationField = styled.div`
  margin-bottom: 15px;
`;

const AttestationLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 6px;

  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const AttestationValue = styled.code`
  display: block;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  font-size: 12px;
  color: #333;
  word-break: break-all;
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 400px) {
    font-size: 11px;
    padding: 8px;
  }
`;

const ExplorerLink = styled.a`
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background: #f9f9f9;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff;
  border-radius: 20px;
  font-size: 14px;
  color: #4c4c4c;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.05);
  }

  @media (max-width: 400px) {
    font-size: 13px;
    padding: 8px 16px;
  }
`;

const NoAttestationMessage = styled.div`
  padding: 30px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const ViewAttestation = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData: parsedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const onchainAttestationUID = parsedUserOrbisData?.data?.smartProfile?.onchainAttestationUID
    const privateAttestationUID = parsedUserOrbisData?.data?.smartProfile?.privateAttestationUID
    const attestationChain = parsedUserOrbisData?.data?.smartProfile?.attestationChain
    const attestationTxHash = parsedUserOrbisData?.data?.smartProfile?.attestationTxHash
    const attestationTimestamp = parsedUserOrbisData?.data?.smartProfile?.attestationTimestamp

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        message.success(`${label} copied to clipboard!`)
    }

    if (!onchainAttestationUID) {
        return (
            <AttestationWrapper>
                <AttestationCard>
                    <NoAttestationMessage>
                        No on-chain attestation found for this profile.
                    </NoAttestationMessage>
                </AttestationCard>
            </AttestationWrapper>
        )
    }

    return (
        <AttestationWrapper>
            <AttestationCard>
                <AttestationTitle>
                    🔒 Your On-chain Attestation
                </AttestationTitle>

                <AttestationField>
                    <AttestationLabel>Public Attestation UID</AttestationLabel>
                    <AttestationValue
                        onClick={() => copyToClipboard(onchainAttestationUID, 'Public UID')}
                        title="Click to copy"
                    >
                        {onchainAttestationUID}
                    </AttestationValue>
                </AttestationField>

                <AttestationField>
                    <AttestationLabel>Private Attestation UID</AttestationLabel>
                    <AttestationValue
                        onClick={() => copyToClipboard(privateAttestationUID, 'Private UID')}
                        title="Click to copy"
                    >
                        {privateAttestationUID}
                    </AttestationValue>
                </AttestationField>

                <AttestationField>
                    <AttestationLabel>Blockchain</AttestationLabel>
                    <AttestationValue>
                        {attestationChain || 'sapphire'} testnet
                    </AttestationValue>
                </AttestationField>

                <AttestationField>
                    <AttestationLabel>Created</AttestationLabel>
                    <AttestationValue>
                        {attestationTimestamp
                            ? new Date(Number(attestationTimestamp) * 1000).toLocaleString()
                            : 'N/A'
                        }
                    </AttestationValue>
                </AttestationField>

                {attestationTxHash && (
                    <ExplorerLink
                        href={`https://testnet.explorer.sapphire.oasis.io/tx/${attestationTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔗 View on Sapphire Explorer
                    </ExplorerLink>
                )}
            </AttestationCard>
        </AttestationWrapper>
    )
}

export default ViewAttestation
