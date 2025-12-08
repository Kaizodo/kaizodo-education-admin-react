import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { KanbanSquare, Bell, Search, UserCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-slate-900 font-sans selection:bg-blue-100">
            {/* Navigation Bar */}
            <nav className="h-14 px-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="bg-blue-600 p-1.5 rounded-md">
                            <KanbanSquare className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">TaskFlow</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">Workspaces</Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">Recent</Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">Starred</Button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex relative group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-48 bg-slate-100 border-slate-200 border pl-9 pr-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                        <UserCircle2 className="w-6 h-6" />
                    </Button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}