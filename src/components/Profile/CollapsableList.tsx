import React, { useState } from 'react';
import { Collapse } from 'antd';
import styled from 'styled-components';
import { CaretRightOutlined } from '@ant-design/icons';
import { ProfileItems } from './ProfileItems';

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

const CollapsableList: React.FC = () => {
  const defaultActiveKey = ['1'];
  const [activeKey, setActiveKey] = useState<string[]>(defaultActiveKey);

  const items = ProfileItems(activeKey);

  const handleChange = (key: string | string[]) => {
    setActiveKey(Array.isArray(key) ? key : [key]);
  };

  return (
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
          <BottomDivider
            $visible={item.bottomDivider}
          />
        </React.Fragment>
      ))}
    </StyledCollapse>
  );
};

export default CollapsableList;
