import { useEffect } from "react";
import styled from "styled-components";

interface LoaderProps {
    message: string;
}

const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;

    .loader {
        display: block;
        position: relative;
        width: 2rem;
        height: 2rem;

        &::after {
            content: '';
            position: absolute;
            width: 2rem;
            height: 2rem;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid var(--gray-100);
            border-top-color: var(--gray-400);
            border-radius: 50%;
            animation: spinner 1s ease infinite;
        }
    }

    @keyframes spinner {
        from {
            transform: rotate(0turn);
        }
        to {
            transform: rotate(1turn);
        }   
    }
`;

export default function Loader({ message }: LoaderProps) {
    useEffect(() => {
        const footerButton = document.getElementById('footer-btn');
        footerButton?.classList.add('toggleShow')

        const widgetHeader = document.getElementById('w-header');
        widgetHeader?.classList.add('toggleShow')

        return () => {
            footerButton?.classList.remove('toggleShow')
            widgetHeader?.classList.remove('toggleShow')
        }
    }, [])

    return (
        <LoaderContainer>
            <div className="loader"></div>
            <p>{message}</p>
        </ LoaderContainer>
    )
}