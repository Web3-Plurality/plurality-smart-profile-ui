import { Divider } from "antd"
import styled from "styled-components"
import { WalletTabsKeys } from "../../../utils/Constants"

const TabsContainer = styled.div<{ defaultMargin: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  position: relative;
  margin-bottom: -1px;
  margin-top:  ${({ defaultMargin }) => defaultMargin};
`

const Tab = styled.div`
  cursor: pointer;
  padding: 10px 20px;
  font-size: 15px;
  color: #9B9B9B;
  text-align: center;
  position: relative;
  user-select: none;
  transition: color 0.3s;

  &:hover {
    color: #545454;
  }

  &.active {
    color: #545454;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) skewX(-15deg);
      width: 60%;
      height: 3.2px;
      background-color: #545454;
      z-index: 1;
    }
  }
`;



const StyledDivider = styled(Divider)`
  margin: 0;
`

interface Tabs {
  key: number,
  name: string,
  label: string
}

const WalletTabs = ({ activeTab, tabMargin, handleTabClick }: { activeTab: string, tabMargin: string, handleTabClick: (val: string) => void }) => {
  return (
    <div>
      <TabsContainer defaultMargin={tabMargin}>
        {WalletTabsKeys.map((tab: Tabs) => (
          <Tab
            key={tab.key}
            className={activeTab === tab.name ? 'active' : ''}
            onClick={() => handleTabClick(tab.name)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>
      <StyledDivider />
    </div>
  )
}

export default WalletTabs
