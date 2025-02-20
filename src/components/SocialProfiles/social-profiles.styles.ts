import styled from "styled-components"

export const ProfileIconsWrapper = styled.div<{ imageUrl: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 80vw;
  max-width: 375px;
  max-height: 375px;
  border-radius: 50%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background: ${({ imageUrl }) => `url(${imageUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
  box-shadow: 
    inset 0 4px 6px rgba(0, 0, 0, 0.2),
    4px 4px 8px rgba(0, 0, 0, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.7);

  .mid-icon {
    position: absolute;
    width: 10vw;
    height: 10vw;
    max-width: 50px;
    max-height: 50px;
  }

  .icon {
    position: absolute;
    width: 12vw;
    height: 12vw;
    max-width: 55px;
    max-height: 55px;
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.2);
    }
  }

  @media (max-width: 575.98px) {
    .icon {
      width: 14vw;
      height: 14vw;
      max-height: 45px;
    }
  }
`

const sharedWrapperStyles = `
  display: flex;
  padding: 10px 20px;
  justify-content: space-around;
  height: auto;
  border-radius: 20px;
  background: #e7e5e5;
  gap: 1rem;
  margin-top: 2.5rem;
  min-width: 300px;
`

export const ProfileWrapperMedium = styled.div`
  ${sharedWrapperStyles}
  position: relative;
  background:rgb(238, 236, 236);
  overflow: hidden;
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.7),
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 -2px 4px rgba(255, 255, 255, 0.7);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(0, 0, 0, 0.05)
    );
    pointer-events: none;
  }

  .icon {
    width: 60px;
    transition: transform 0.3s ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  }
`

export const ProfileWrapperSmall = styled.div`
  ${sharedWrapperStyles}
  padding: 15px 30px 15px 10px !important;
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.7),
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 -2px 4px rgba(255, 255, 255, 0.7);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(0, 0, 0, 0.05)
    );
    pointer-events: none;
  }
  .icon {
    width: 270px;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    .small-icon {
      transition: transform 0.3s ease-in-out;
      &:hover {
        transform: scale(1.1);
      }
    }

    p {
      font-family: 'Lexend', Courier, monospace;
      color: #545454 !important;
      font-size: 20px;
    }
  }
`

