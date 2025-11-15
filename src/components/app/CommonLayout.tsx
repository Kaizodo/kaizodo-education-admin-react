import React, { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { RiCollapseHorizontalLine } from 'react-icons/ri';

export interface NavItem {
    route_root?: string;
    icon: React.ElementType;
    label: string;
    route?: string;
    count?: number;
    section: 'main' | 'management';
}



const NavItemComponent: React.FC<NavItem & { small: boolean; active: boolean, main_route_root: string }> = ({ main_route_root, icon: Icon, label, count, active, small, route, route_root }) => (
    <NavLink to={(route_root ?? main_route_root) + "/" + route} className="block">
        <div
            title={small ? label : undefined}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-150 ${active ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Icon className="w-5 h-5" />
            {!small && (
                <>
                    <span className="ml-3 flex-1 text-sm">{label}</span>
                    {count !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'
                            }`}>
                            {count}
                        </span>
                    )}
                </>
            )}
        </div>
    </NavLink>
);

const Sidebar = ({ navs, title, route_root }: { navs: NavItem[], title: string, route_root: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mode, setMode] = useState<'expanded' | 'hoverCollapsed' | 'pinned'>('expanded');
    const [hover, setHover] = useState(false);

    const mainNav = navs.filter(i => i.section === 'main');
    const managementNav = navs.filter(i => i.section === 'management');

    const isSmall = mode === 'hoverCollapsed' && !hover;
    const widthClass = isSmall ? 'w-16' : 'w-64';

    const onCollapseClick = () => {
        if (mode === 'expanded') setMode('hoverCollapsed');
        else if (mode === 'hoverCollapsed') setMode('pinned');
        else if (mode === 'pinned') setMode('hoverCollapsed');
    };

    const isActive = (route?: string) => {
        if (route == undefined) return false;

        var trimmed_route = (route_root + "/" + route).replace(/\/$/, "");
        // dashboard should only be active on exact match
        if (location.pathname.replace(/\/$/, "") === route_root && !route) return true;



        // others can match children
        return location.pathname.startsWith(trimmed_route) && !!route;
    };


    return (
        <div
            className={`h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-200 ${widthClass}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="p-3 flex items-center justify-between gap-3 border-b border-gray-100">
                {!isSmall && <div className="flex items-center gap-3">
                    <button className="text-sm border p-1 rounded hover:bg-gray-50" onClick={() => navigate('/')}>
                        <LuArrowLeft />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 text-nowrap">{title}</h1>
                </div>}

                <button onClick={onCollapseClick} className="p-1 rounded hover:bg-gray-100">
                    <RiCollapseHorizontalLine className={`w-5 h-5 transform transition-transform ${mode === 'hoverCollapsed' ? '-rotate-90' : ''}`} />
                </button>
            </div>

            <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                {mainNav.map((item, i) => (
                    <NavItemComponent key={i} main_route_root={route_root} {...item} small={isSmall} active={isActive(item.route)} />
                ))}

                {!isSmall && <p className="text-xs font-semibold text-gray-400 uppercase pt-4 pb-1 px-2">Management</p>}

                {managementNav.map((item, i) => (
                    <NavItemComponent main_route_root={route_root} key={i} {...item} small={isSmall} active={isActive(item.route)} />
                ))}
            </div>
        </div>
    );
};

export default function CommonLayout({ navs, title, route_root }: { navs: NavItem[], title: string, route_root: string }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar navs={navs} title={title} route_root={route_root} />
            <div className="flex-1 relative overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
