import { Card, Typography, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectContratData } from '../../selectors/userDataSelector'
import ContractFooterSection from './ContractFooter'

const { Text } = Typography


const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 0 20px -30px ;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`

const Label = styled(Text)`
  min-width: 150px;
  font-weight: bold;
  margin-right: 16px;
`

const Value = styled(Text)`
  word-break: break-all;
  color: #6D6D6D !important;
`

const Contract = () => {
    const contractData = useSelector(selectContratData)
    const truncateAbi = (abi: string) => {
        return abi.length > 30 ? `${abi.substring(0, 30)}...` : abi
    }

    return (
        <>
            <StyledCard>
                <DetailRow>
                    <Label>Contract ABI:</Label>
                    <Tooltip title={contractData?.abi}>
                        <Value>{truncateAbi(contractData?.abi || '')}</Value>
                    </Tooltip>
                </DetailRow>

                <DetailRow>
                    <Label>Contract Address:</Label>
                    <Value>{contractData?.address}</Value>
                </DetailRow>

                <DetailRow>
                    <Label>Parameters:</Label>
                    <Value>{contractData?.method_params}</Value>
                </DetailRow>

                <DetailRow>
                    <Label>Method Name:</Label>
                    <Value>{contractData?.method_name}</Value>
                </DetailRow>
            </StyledCard>
            <ContractFooterSection />
        </>
    )
}

export default Contract
