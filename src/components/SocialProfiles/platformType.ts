export type Platform = {
    active: boolean
    activeIcon: string
    displayName: string
    icon: string
    iconName: string
    id: number
}

export type ProfileData = Platform

export interface SocialProfilesProps {
    metaverse?: boolean
    handleIconClick: (id: number) => void
    activeStates: boolean[]
}
