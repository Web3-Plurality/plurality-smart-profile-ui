import { Card, Typography, Tooltip, Divider } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectContratData } from '../../selectors/userDataSelector';
import ContractFooterSection from './ContractFooter';

const { Text } = Typography;

const StyledCard = styled(Card)`
  max-width: 800px;
  border-radius: 35px;
  margin: 0 20px -30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .ant-card-body{
    padding: 10px 30px;
  }

  .ant-divider{
    margin: 0 !important;
  }
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 0;
`;

const Label = styled(Text)`
font-family: 'Lexend', Courier, monospace;
  min-width: 150px;
  font-weight: bold;
`;

const Value = styled(Text)`
font-family: 'Lexend', Courier, monospace;
  word-break: break-all;
  color: #6d6d6d !important;
`;

const Contract = () => {
  const contractData = useSelector(selectContratData);

  const truncateAbi = (abi: string) => {
    return abi.length > 30 ? `${abi.substring(0, 30)}...` : abi;
  };

  return (
    <>
      <StyledCard>
        <DetailRow>
          <Label>Contract ABI:</Label>
          <Tooltip title={contractData?.abi}>
            <Value>{truncateAbi(contractData?.abi || '')}</Value>
          </Tooltip>
        </DetailRow>
        <Divider />

        <DetailRow>
          <Label>Contract Address:</Label>
          <Value>{contractData?.address}</Value>
        </DetailRow>
        <Divider />

        <DetailRow>
          <Label>Parameters:</Label>
          <Value>{contractData?.method_params}</Value>
        </DetailRow>
        <Divider />

        <DetailRow>
          <Label>Method Name:</Label>
          <Value>{contractData?.method_name}</Value>
        </DetailRow>
      </StyledCard>
      <ContractFooterSection />
    </>
  );
};

export default Contract;
