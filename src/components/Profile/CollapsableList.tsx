import React, { useState } from 'react';
import { Collapse, Radio, RadioChangeEvent } from 'antd'; // Import Ant Design's Radio component
import styled from 'styled-components';
import { CaretRightOutlined } from '@ant-design/icons';
import { ProfileItems } from './ProfileItems';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../../utils/Helpers';

const StyledDivider = styled.div<{ $visible: boolean }>`
  height: 1px;
  background-color: rgba(5, 5, 5, 0.06);
  margin: 0;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const BottomDivider = styled(StyledDivider)`
  margin-bottom: 10px;
`;

const StyledCollapse = styled(Collapse)`
  width: 400px;
  margin: 0 auto;
  background: transparent;
  padding: 0 20px;

  .ant-collapse-item {
    position: relative;
    border: none !important;
  }

  .ant-collapse-header {
    cursor: pointer;
    background-color: transparent;
    font-family: 'Lexend', sans-serif;
    color: #4F4F4F !important;
    padding: 10px;
  }

  .ant-collapse-item-active .ant-collapse-header {
    background-color: #DDDDDD;
  }

  .ant-collapse-content {
    border: none !important;
    p {
      margin-top: 0;
    }
  }

  .ant-collapse-content-box {
    background: rgba(221, 221, 221, 0.20);
    color: #666;
    padding: 20px;
    max-height: 1000px;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    padding: 0 !important;
  }

  .ant-collapse-item-active .ant-collapse-content-box {
    max-height: 1000px;
  }

  @media (max-width:430px) {
    max-width: 360px;
  }

  @media (max-width:390px) {
    max-width: 300px;
  }
`;

const OtherDataWrapper = styled.div`
  height: 272px;
  width: 370px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  display: flex;
  align-items: center;
  overflow-y: auto;
  padding: 10px;
  white-space: pre-wrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  ::-webkit-scrollbar {
    width: 8px !important;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888 !important;
    border-radius: 10px !important;
    border: 2px solid #ffffff !important;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555 !important;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 10px !important;
  }
`;

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper-checked {
    background-color: #6d6d6d !important;
    color: white !important;
  }

  .ant-radio-button-wrapper {
    border: 1px solid #6d6d6d !important;
    color: #6d6d6d;
  }

  .ant-radio-button-wrapper:hover {
    border-color: #6d6d6d !important;
  }
`;

const CollapsableList = ({
  isOtherDataVisible,
  handleOtherDataVisibility,
}: {
  isOtherDataVisible: boolean;
  handleOtherDataVisibility: () => void;
}) => {
  const defaultActiveKey = ['1'];
  const [activeKey, setActiveKey] = useState<string[]>(defaultActiveKey);

  const items = ProfileItems(activeKey);

  const handleChange = (key: string | string[]) => {
    if (key == '4') {
      handleOtherDataVisibility();
    } else {
      setActiveKey(Array.isArray(key) ? key : [key]);
    }
  };

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`);
  const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);

  const extendedPublicData = smartProfileData?.data?.smartProfile?.extendedPublicData;
  const extendedPrivateData = smartProfileData?.data?.smartProfile?.privateData?.extendedPrivateData;

  const isPublicData = Object.keys(extendedPublicData || {}).length > 0;
  const isPrivateData = Object.keys(extendedPrivateData || {}).length > 0;

  const [showPublicData, setShowPublicData] = useState(true);

  const handleRadioChange = (e: RadioChangeEvent) => {
    setShowPublicData(e.target.value);
  };

  return (
    <>
      {isOtherDataVisible ? (
        <OtherDataWrapper>
          <StyledRadioGroup value={showPublicData} onChange={handleRadioChange} style={{ marginBottom: '10px' }}>
            <Radio.Button value={true}>Public Data</Radio.Button>
            <Radio.Button value={false}>Private Data</Radio.Button>
          </StyledRadioGroup>
          <pre>
            {showPublicData
              ? isPublicData
                ? JSON.stringify(extendedPublicData, null, 2)
                : 'No Public data is available'
              : isPrivateData
                ? JSON.stringify(extendedPrivateData, null, 2)
                : 'No Private data is available'}
          </pre>
        </OtherDataWrapper>
      ) : (
        <StyledCollapse
          bordered={false}
          defaultActiveKey={defaultActiveKey}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          expandIconPosition="end"
          accordion
          onChange={handleChange}
        >
          {items.map((item) => (
            <React.Fragment key={item.key}>
              <Collapse.Panel header={item.label} key={item.key}>
                {item.children}
              </Collapse.Panel>
              <BottomDivider $visible={item.bottomDivider} />
            </React.Fragment>
          ))}
        </StyledCollapse>
      )}
    </>
  );
};

export default CollapsableList;
