import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { LuChevronRight } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import StickyBox from "react-sticky-box";
import AppPage from "./AppPage";
import { IconType } from "react-icons/lib";


type Props = {

    title?: string,
    subtitle?: string,
    navs: {
        icon?: IconType,
        route: string,
        name: string
    }[],
    children?: ReactNode,
    containerClassName?: string
}
export default function AppSidebarLayout({ navs, children, title, subtitle, containerClassName = "md:pt-0" }: Props) {
    const location = useLocation();
    const navigate = useNavigate()

    return (
        <AppPage title={title} subtitle={subtitle} containerClassName={containerClassName}>
            <div className='flex-1  w-full flex flex-row gap-3 items-start'>
                <StickyBox offsetTop={20} offsetBottom={20}>
                    <div className='rounded-lg border shadow-sm bg-white h-full w-[250px] overflow-hidden'>
                        {navs.map(nav => {
                            return <div
                                key={`nav_${nav.route}`}
                                onClick={() => navigate(nav.route)}
                                className={
                                    cn(
                                        `border-b px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex flex-row items-center gap-2`,
                                        nav.route == location.pathname && `bg-primary text-white hover:bg-primary hover:text-white`
                                    )
                                }>
                                {!!nav.icon && <nav.icon className="text-lg" />}
                                {nav.name}
                                {nav.route == location.pathname && <LuChevronRight className="ms-auto" />}
                            </div>;
                        })}
                    </div>
                </StickyBox>

                <div className="flex-1">
                    {children}
                </div>
            </div>
        </AppPage>
    )
}
