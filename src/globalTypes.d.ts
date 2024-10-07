export interface PayloadDataType {
    userId: string,
    session: string,
    method: string
}

export interface ProfileData {
    id?: number,
    iconName?: string,
    displayName?: string,
    icon?: string,
    active?: boolean,
    activeIcon?: string
    platformName?: string,
    platform?: string,
    authentication?: boolean
}