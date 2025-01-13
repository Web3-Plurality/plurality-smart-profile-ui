import styled from 'styled-components'
import ConsentBody from './bodySection'
import ConsentFooter from './footerSection';

const ConsentWrapper = styled.div`
    padding: 0 30px;
    color: #4f4f4f;
    /* margin-top: 40px; */

    .consent-title{
        font-size: 18px;

        span{
            font-weight: 800;
        }
    }

    li{
        font-size: 15px;
    }

    .consent-warning{
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 800;
    }

    .risks-info{
        margin-top: 0;
        font-size: 15px;
        span{
        text-decoration: underline;
        cursor: pointer;
    }
    }
`;

const Consent = () => {
    return (
        <ConsentWrapper >
            <ConsentBody />
            <ConsentFooter />
        </ConsentWrapper>
    )
}

export default Consent
