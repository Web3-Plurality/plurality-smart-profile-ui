import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  .ant-dropdown-menu-item {
    padding: 8px 12px !important;
    background-color: transparent !important;

    &:hover {
      background-color: #f7f2f2 !important;
        
      .network-option span {
        color: #545454 !important;
      }
    }
  }

  .ant-dropdown-menu {
    background-color: white !important;
   
  }

  .network-option {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    width: 100%;
    font-size: 12px;
    
    img {
      width: 20px !important;
      height: 20px !important;
    }


    
    span {
      color: #545454;
    }
  }

  .anticon-caret-down{
      color: #ACACAC;
      cursor: pointer;
  } 

  .spin-container{
    margin-left: 20px;
  }
`;

export default GlobalStyles;
