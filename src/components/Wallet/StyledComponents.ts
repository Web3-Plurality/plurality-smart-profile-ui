import styled from "styled-components";

export const BalanceTabWrapper = styled.div<{ tab: string }>`
  width: 370px;
  background-color: ${({ tab }) => (tab === 'receive' ? 'transparent' : '#FFF')};
  border-radius: 15px;
  box-shadow: ${({ tab }) => (tab === 'receive' ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)')};
  display: flex;
  flex-direction: column;

  .balance-info-1, .balance-info-2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.3rem;

    .address {
      display: flex;
      gap: 15px;
      align-items: center;
      color: #545454;

      img {
        height: 17px;
        cursor: pointer;
      }

      .balance {
        font-size: 20px;
        color: #545454;
        margin-left: 10px;

        .balance-info {
          color: #177EF8;
          font-size: 14px;
          margin-left: 6px;
          img {
            width: 12px;
            margin: 0 5px -4px;
          }
        }
      }
    }

    .chain {
      border: 1.5px solid #ACACAC;
      padding: 0.4rem;
      min-width: 80px;
      text-align: right;
      border-radius: 12px;

      p {
        margin: 0;
        font-size: 12px;
        color: #ACACAC;
        cursor: not-allowed;
      }
    }

    .dropdown-wrapper {
      border: 1.5px solid #ACACAC;
      padding: 0.4rem;
      min-width: 80px;
      text-align: right;
      border-radius: 12px;
      cursor: pointer;
      margin: 8px 0;
    }
  }

  .isBorder{
    margin-top: 10px;
    width: 80%;
    background-color: #fff;
    border: 1px solid #ACACAC;
    border-radius: 15px;
    padding: 0 0.7rem;
  }

  .ant-divider-horizontal {
    margin: 0;
  }

  .selected-network {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;

    img {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 440px) {
      width: 320px;
  }

  @media (max-width: 395px) {
      width: 300px;
  }
`;

