import { useState } from "react";
import {
    LuMenu, LuLogOut, LuBell, LuSearch,
    LuShield,
} from 'react-icons/lu';


import { SidebarContent } from "./SidebarContent";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AuthenticationService } from "@/services/AuthenticationService";
import { useGlobalContext } from "@/hooks/use-global-context";
import { nameLetter } from "@/lib/utils";



export default function MainLayout() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoutProcessing, setLogoutProcessing] = useState(false);
    const { context } = useGlobalContext();




    const logout = async () => {
        setLogoutProcessing(true);
        await AuthenticationService.logout();
        setLogoutProcessing(false);
    }





    return (
        <div className="flex flex-col h-screen">
            <header className="bg-white text-black border-b border-gray-300 sticky top-0 z-40 h-[70px]">
                <div className="flex items-center justify-between px-4 md:px-2 py-2">
                    <div className="flex items-center space-x-2">
                        {/* Mobile Menu Trigger */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-900 hover:text-white hover:bg-slate-800"
                                >
                                    <LuMenu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 bg-white border-slate-700 p-0">
                                <div className="p-4 border-b border-slate-700">
                                    <div className="flex items-center space-x-3">
                                        <LuShield className="h-8 w-8 text-slate-400" />
                                        <div>
                                            <h1 className="text-lg font-bold text-white">System Control</h1>
                                            <p className="text-xs text-slate-400">Super Admin</p>
                                        </div>
                                    </div>
                                </div>
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>




                        <div className="flex items-center">

                            <div className="hidden sm:block  rounded-sm p-1">
                                <img src={'/logo/dark/lg.png'} style={{
                                    height: 30
                                }} />
                                <p className="text-xs text-primary">Super Administrator Panel</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-lg font-bold">Control Center</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Button onClick={() => navigate('/search')} variant="ghost" size="sm" className="text-slate-900 hover:text-white hidden sm:flex">
                            <LuSearch className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => navigate('/notifications')} variant="ghost" size="sm" className="text-slate-900 hover:text-white relative">
                            <LuBell className="h-4 w-4" />
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 p-0 bg-red-500 text-xs flex items-center justify-center">3</Badge>
                        </Button>
                        <div className="flex items-center space-x-2 md:space-x-3 border-l border-slate-700 pl-2 md:pl-4">
                            <Avatar className="h-7 w-7 md:h-8 md:w-8">
                                <AvatarImage src={context.user.image} />
                                <AvatarFallback className="bg-slate-700 text-white text-sm">
                                    {nameLetter(context.user.first_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:block">
                                <p className="text-sm font-medium">{context.user.first_name} {context.user.last_name}</p>
                                <p className="text-xs text-slate-400">{context.user.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                loading={logoutProcessing}
                                onClick={logout}
                                className="text-slate-900 hover:text-white hover:bg-slate-800"
                            >
                                <LuLogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1  w-full flex flex-row">
                <aside className="hidden md:block w-70 bg-white max-h-[calc(100vh-70px)] overflow-y-auto">
                    <SidebarContent />
                </aside>
                <main className="bg-sky-50 flex-1  w-full overflow-y-auto max-h-[calc(100vh-70px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
