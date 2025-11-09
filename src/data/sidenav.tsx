import { IconType } from "react-icons/lib"

export type NavType = {
    route?: string,
    label: string,
    subtitle?: string,
    icon?: IconType,
    children?: NavType[]
}


