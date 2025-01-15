
import { Checkbox } from "antd"
import styled from "styled-components"

const TermsWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
    width: 91.3%;

    span{
        font-size: 12px;
        color: gray;

        a{
            text-decoration: underline;
            color: rgb(33, 33, 218);
        }
    }

    .ant-checkbox {
        margin-right: 8px;
        &-checked {
            .ant-checkbox-inner {
                background-color: gray !important;
                border-color: gray !important;
            }
        }

        &:hover {
            .ant-checkbox-inner {
                border-color: gray !important;
            }
        }

    }
    /* .ant-checkbox{
      margin-right: 8px;
    }

    .ant-checkbox-checked .ant-checkbox-inner{
        background-color: gray !important;
        border-color: gray !important;
    }

    .ant-checkbox-wrapper:hover .ant-checkbox-inner{
        border-color: gray !important;
    }*/
`

const Terms = ({ acceptance, setAcceptance }: { acceptance: boolean, setAcceptance: (prev: boolean) => void }) => {
    return (
        <TermsWrapper>
            <Checkbox checked={acceptance} onChange={(e) => setAcceptance(e.target.checked)} />
            <span>
                I accept the <a
                    href="https://plurality.network/user-terms-of-service/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    terms of service
                </a>{" "}
                and subscribe to receive updates from the Plurality Network
            </span>
        </TermsWrapper>
    )
}

export default Terms
