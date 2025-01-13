import React from "react";
import styled from "styled-components"

const HeaderDivWrapper = styled.div`
    width: 100%;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items : center;

    hr{
        width: 100%;
        border: none;
        border-top: 1px solid rgba(5, 5, 5, 0.1);
        margin: 5px 0
    }
`;

const ItemLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        <HeaderDivWrapper>
            <hr />
        </HeaderDivWrapper>
        {children}
    </>

)

export default ItemLayout
