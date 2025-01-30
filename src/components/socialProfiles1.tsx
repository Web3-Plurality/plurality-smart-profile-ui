// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useRef, useState } from 'react';
// import { ProfileData } from '../types';
// import { getLocalStorageValueofClient, getPlatformImage } from '../utils/Helpers';
// import CustomIcon from './customIcon';
// import styled from 'styled-components';
// import useResponsive from '../hooks/useResponsive';
// import { CLIENT_ID } from '../utils/EnvConfig';

// import CircleImg from './../assets/images/circle.png';

// type Platform = {
//     active: boolean,
//     activeIcon: string,
//     displayName: string,
//     icon: string,
//     iconName: string,
//     id: number
// }


// const ProfileIconsWrapper = styled.div<{ imageUrl: string }>`
//     position: relative;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 80vw;
//     height: 80vw;
//     max-width: 375px;
//     max-height: 375px;
//     border-radius: 50%;
//     box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
//     background: ${({ imageUrl }) => `url(${imageUrl})`};
//     background-size: cover;
//     background-position: center;
//     background-repeat: no-repeat;
//     margin: auto;

//     .mid-icon {
//         position: absolute;
//         width: 10vw;
//         height: 10vw;
//         max-width: 50px;
//         max-height: 50px;
//     }

//     .icon {
//         position: absolute;
//         width: 12vw;
//         height: 12vw;
//         max-width: 55px;
//         max-height: 55px;
//         border-radius: 50%;
//         transition: transform 0.3s ease-in-out;

//         @media (max-width: 365px) {
//             max-width: 45px;
//         }

//         &:hover{
//            transform: scale(1.2)
//         }
//     }

//     @media (max-width: 575.98px) {
//         .icon {
//             width: 14vw;
//             height: 14vw;
//             max-height: 45px;
//         }
//     }

//     @media (max-width: 470px) {
//         .app-logo-center{
//             width: 160px;
//             height: 160px;
//         }
//     }

//     @media (max-width: 398px) {
//         .app-logo-center{
//             width: 150px;
//             height: 150px;
//         }
//     }

//     @media (max-width: 350px) {
//         .app-logo-center{
//             width: 120px;
//             height: 120px;
//         }
//     }

// `;

// const ProfileWrapperMedium = styled.div`
//     display: flex;
//     padding: 10px 20px;
//     justify-content: space-around;
//     height: auto;
//     border-radius: 20px;
//     background: #e7e5e5;
//     gap: 1rem;
//     margin-top: 2.5rem;
//     box-shadow:
//         inset 0 4px 6px rgba(0, 0, 0, 0.2), /* Inset shadow at the top */
//         4px 4px 8px rgba(0, 0, 0, 0.2), /* Outer bottom-right shadow */
//         -4px -4px 8px rgba(255, 255, 255, 0.7); /* Outer top-left highlight */

//     .icon{
//         width: 60px;
//         transition: transform 0.3s ease-in-out;
//         &:hover{
//            transform: scale(1.2)
//         }
//     }
// `;

// const ProfileWrapperSmall = styled.div`
//     display: flex;
//     padding: 15px 30px 15px 10px;
//     justify-content: space-around;
//     height: auto;
//     border-radius: 20px;
//     background: #e7e5e5;
//     gap: 1rem;
//     margin-top: 2.5rem;
//     box-shadow:
//         inset 0 4px 6px rgba(0, 0, 0, 0.2), /* Inset shadow at the top */
//         4px 4px 8px rgba(0, 0, 0, 0.2), /* Outer bottom-right shadow */
//         -4px -4px 8px rgba(255, 255, 255, 0.7); /* Outer top-left highlight */

//     .icon{
//         width: 270px;
//         height: 50px;
//         display: flex;
//         justify-content: flex-start;
//         align-items: center;
//         gap: 1rem;

//         .small-icon{
//             transition: transform 0.3s ease-in-out;
//             &:hover{
//                 transform: scale(1.1)
//             }
//         }

//         p{
//             font-family: 'Lexend', Courier, monospace;
//             color: #545454 !important;
//             font-size: 22px;
//         }
//     }
// `;




// type MetaverseProps = {
//     metaverse?: boolean,
//     handleIconClick: (id: number) => void,
//     activeStates: boolean[]
// }

// const SocialProfiles = ({
//     activeStates,
//     handleIconClick,
// }: MetaverseProps) => {
//     const circleRef = useRef<HTMLDivElement>(null);
//     const [circleRadius, setCircleRadius] = useState(153);

//     const queryParams = new URLSearchParams(location.search);
//     const clientId = queryParams.get('client_id') || CLIENT_ID;

//     const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)

//     const { isExtraSmallScreen, isMobileScreen, isTabScreen } = useResponsive()
//     const isIframe = window.self !== window.top;

//     useEffect(() => {
//         if (circleRef.current) {
//             const width = circleRef.current.offsetWidth;
//             const baseRadius = isExtraSmallScreen ? (width / 1.98) : isMobileScreen ? isIframe ? (width / 2.06) : (width / 2.1) : width / 2.1;
//             setCircleRadius(baseRadius - 30);
//         }
//     }, [circleRef.current?.offsetWidth, isMobileScreen, isTabScreen, isIframe]);


//     let { platforms: socailIcons } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
//     const angle = (360 / socailIcons?.length) * (Math.PI / 180);

//     socailIcons = socailIcons?.slice(0, 6);

//     const socilasLength = socailIcons?.length
//     const updateLocalStoragePlatforms = (activeStates: boolean[]) => {
//         const { platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

//         const updatedPlatforms = platforms?.map((platform: Platform) => ({
//             ...platform,
//             active: platform.active ? true : activeStates[platform.id] || false
//         }));

//         const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
//         let existingData = existingDataString ? JSON.parse(existingDataString) : {}

//         existingData = {
//             ...existingData,
//             platforms: updatedPlatforms
//         }
//         localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
//     };

//     useEffect(() => {
//         updateLocalStoragePlatforms(activeStates);
//     }, [activeStates]);

//     const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
//     const connectedPlatforms = smartProfileData?.data?.smartProfile?.connectedPlatforms || [];

//     const plaformImg = getPlatformImage()

//     return (
//         <>
//             {socilasLength > 4 ? (
//                 <ProfileIconsWrapper ref={circleRef} imageUrl={CircleImg} className="circle">
//                     <div className='mid-icon'>
//                         <img className="app-logo-center" src={plaformImg} alt='' />
//                     </div>
//                     {socailIcons && socailIcons.map(({ iconName, id, icon, activeIcon }: { iconName: string, id: number, icon: string, activeIcon: string }, index: number) => {
//                         const x = circleRadius * Math.cos(angle * index);
//                         const y = circleRadius * Math.sin(angle * index);
//                         return (
//                             <div
//                                 key={id}
//                                 className={`icon `}
//                                 style={{
//                                     position: "absolute",
//                                     left: `calc(50% + ${x}px - ${isExtraSmallScreen ? '22px' : isMobileScreen ? isIframe ? '26px' : '22px' : isTabScreen ? '29px' : '27px'})`,
//                                     top: `calc(50% + ${y}px - ${isExtraSmallScreen ? '21px' : isMobileScreen ? isIframe ? '25px' : '20px' : isTabScreen ? '25px' : '25px'})`,
//                                     cursor: 'pointer'
//                                 }}
//                                 onClick={() => handleIconClick(id)}
//                             >
//                                 <CustomIcon
//                                     path={
//                                         activeStates[id] ||
//                                             socailIcons.find((x: ProfileData) => x.id === id)?.active ||
//                                             connectedPlatforms?.includes(iconName)
//                                             ? activeIcon : icon} />
//                             </div>
//                         );
//                     })}
//                 </ProfileIconsWrapper>
//             ) : (socilasLength <= 4 && socilasLength > 1) ? (
//                 <ProfileWrapperMedium>
//                     {socailIcons && socailIcons.map(({ iconName, id, icon, activeIcon }: { iconName: string, id: number, icon: string, activeIcon: string }) => (
//                         <div
//                             key={id}
//                             className={`icon`}
//                             style={{
//                                 cursor: 'pointer'
//                             }}
//                             onClick={() => handleIconClick(id)}
//                         >
//                             <CustomIcon
//                                 path={
//                                     activeStates[id] ||
//                                         socailIcons.find((x: ProfileData) => x.id === id)?.active ||
//                                         connectedPlatforms?.includes(iconName)
//                                         ? activeIcon : icon} />
//                         </div>
//                     ))}
//                 </ProfileWrapperMedium>) : (
//                 <ProfileWrapperSmall>
//                     {socailIcons && socailIcons.map(({ iconName, displayName, id, icon, activeIcon }: { iconName: string, displayName: string, id: number, icon: string, activeIcon: string }) => (
//                         <div
//                             key={id}
//                             className={`icon`}
//                             style={{
//                                 cursor: 'pointer'
//                             }}
//                             onClick={() => handleIconClick(id)}
//                         >
//                             <div className='small-icon'>
//                                 <CustomIcon
//                                     path={
//                                         activeStates[id] ||
//                                             socailIcons.find((x: ProfileData) => x.id === id)?.active ||
//                                             connectedPlatforms?.includes(iconName)
//                                             ? activeIcon : icon} /></div>
//                             <p>Connect {displayName}</p>
//                         </div>
//                     ))}
//                 </ProfileWrapperSmall>
//             )}
//         </>

//     );
// }

// export default SocialProfiles;