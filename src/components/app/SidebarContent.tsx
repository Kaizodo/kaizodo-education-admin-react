import { navs } from "@/navs";
import { Button } from "../ui/button";
import { NavLink, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { routes } from "@/routes";
import { UserService } from "@/services/UserService";
import { NavType } from "@/data/sidenav";
import { RouteType } from "@/data/router";
import { cn } from "@/lib/utils";
import { LuSearch, LuX } from "react-icons/lu";

interface NavItemProps {
    nav: NavType;
    navIndex: string;
    state: any;
    setState: (state: any) => void;
    depth: number;
}

const NavItem: React.FC<NavItemProps> = ({ nav, navIndex, state, setState, depth }) => {
    const Icon = nav.icon;
    const isExpanded = !!state[navIndex];
    const location = useLocation();

    const isNavAllowed = (nav: NavType): boolean => {
        if (!nav.route) return true;
        const checkNestedRoutes = (list: RouteType[]): boolean => {
            for (const r of list) {
                if (
                    r.path === nav.route &&
                    (!r.permissions?.length || r.permissions.some(p => UserService.permissions.includes(p)))
                ) {
                    return true;
                }
                if (r.children?.length && checkNestedRoutes(r.children)) {
                    return true;
                }
            }
            return false;
        };
        return checkNestedRoutes(routes);
    };

    // Check if nav or any of its children is active
    const isActiveNav = (nav: NavType): boolean => {
        if (nav.route && location.pathname === `/${nav.route}`) return true;
        if (nav.children) {
            return nav.children.some(child => isActiveNav(child));
        }
        return false;
    };

    const isActive = isActiveNav(nav);
    const hasChildren = nav.children?.length && nav.children.filter(isNavAllowed).length > 0;

    if (!isNavAllowed(nav)) return null;

    if (hasChildren) {
        return (
            <Collapsible
                key={`nav_${navIndex}`}
                open={isExpanded}
                onOpenChange={(open) => {
                    setState((prev: any) => ({ ...prev, [navIndex]: open }));
                }}
                className={cn(
                    "rounded-md transition-colors",
                    isActive && !isExpanded && "bg-primary/10"
                )}
            >
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-between px-3 rounded-md font-medium text-sm",
                            "hover:bg-primary/10 hover:text-foreground",
                            isActive && "text-primary",
                            isExpanded && "bg-primary/10 text-primary "
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {!!Icon && <Icon className="h-4 w-4" />}
                            <div className="flex flex-col">
                                <span>{nav.label}</span>
                                {!!nav.subtitle && <span>{nav.subtitle}</span>}
                            </div>
                        </div>
                        {isExpanded ? (
                            <FaChevronDown className="h-3 w-3 transition-transform" />
                        ) : (
                            <FaChevronRight className="h-3 w-3 transition-transform" />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    <div className={cn(
                        "py-1 ps-2 space-y-1 border-l-2 ml-3",
                        isExpanded ? "border-primary/30" : "border-transparent"
                    )}>
                        {nav?.children?.filter(isNavAllowed).map((child, index) => (
                            <NavItem
                                key={`${navIndex}-${index}`}
                                nav={child}
                                navIndex={`${navIndex}-${index}`}
                                state={state}
                                setState={setState}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <NavLink to={nav.route || ''} key={`nav_${navIndex}`}>
            {({ isActive }) => (
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start  items-center px-3 rounded-md   text-sm  font-medium ",
                        "hover:bg-primary/10 hover:text-foreground",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",

                    )}
                >
                    {!!Icon && <Icon className="h-4 w-4" />}
                    <div className="flex flex-col items-start gap-0">
                        <span>{nav.label}</span>
                        {!!nav.subtitle && <span className="text-[10px] font-normal leading-none">{nav.subtitle}</span>}
                    </div>
                </Button>
            )}
        </NavLink>
    );
};

export const SidebarContent = () => {
    const [state, setState] = useState<any>({});
    const customLocation = useLocation();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const expanded: any = {};
        const checkNavs = (navs: NavType[], parentIndex: string = '') => {
            navs.forEach((nav, i) => {
                const currentIndex = parentIndex ? `${parentIndex}-${i}` : `${i}`;
                if (nav.children) {
                    const found = nav.children.some(child =>
                        child.route && customLocation.pathname.startsWith(`/${child.route}`)
                    );
                    if (found) {
                        expanded[currentIndex] = true;
                        // Set all parent indices to true
                        let parent = parentIndex;
                        while (parent) {
                            expanded[parent] = true;
                            parent = parent.substring(0, parent.lastIndexOf('-')) || '';
                        }
                    }
                    checkNavs(nav.children, currentIndex);
                }
            });
        };
        checkNavs(navs);
        setState(expanded);
    }, [customLocation.pathname]);

    const filterNavs = (): NavType[] => {
        if (!keyword.trim()) return navs;
        const lower = keyword.toLowerCase();

        const deepFilter = (nav: NavType): NavType | null => {
            if (nav.label.toLowerCase().includes(lower)) {
                return { ...nav };
            }
            if (nav.children) {
                const filteredChildren = nav.children
                    .map(deepFilter)
                    .filter((c): c is NavType => !!c);
                if (filteredChildren.length > 0) {
                    return { ...nav, children: filteredChildren };
                }
            }
            return null;
        };

        return navs
            .map(deepFilter)
            .filter((n): n is NavType => !!n);
    };

    return (
        <nav className="p-4 space-y-4 max-w-[300px]">
            <div className="flex flex-row items-center relative">
                <LuSearch className="absolute text-muted-foreground left-3 h-4 w-4" />
                <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Search menu..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                {!!keyword && (
                    <button
                        className="absolute right-2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent"
                        onClick={() => setKeyword('')}
                    >
                        <LuX className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="space-y-1">
                {filterNavs().map((nav, index) => (
                    <NavItem
                        key={`nav_${index}`}
                        nav={nav}
                        navIndex={`${index}`}
                        state={state}
                        setState={setState}
                        depth={0}
                    />
                ))}
            </div>
        </nav>
    );
};