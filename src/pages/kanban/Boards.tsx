import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Star, Clock, Users, Plus, ArrowRight, LayoutGrid, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const recentBoards = [
        { id: 1, title: "Product Roadmap", color: "from-blue-600 to-blue-500", starred: true },
        { id: 2, title: "Marketing Launch", color: "from-purple-600 to-pink-600", starred: true },
        { id: 3, title: "Design System", color: "from-emerald-500 to-teal-500", starred: false },
        { id: 4, title: "Q4 Goals", color: "from-orange-500 to-red-500", starred: false },
    ];

    return (
        <div className="flex-1 bg-slate-50 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Welcome Section */}
                <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Your Workspaces</h1>
                        <p className="text-slate-500 mt-1">Manage your projects and collaborate with your team.</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Board
                    </Button>
                </div>

                {/* Starred Boards */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-lg">
                        <Star className="w-5 h-5" />
                        <h2>Starred Boards</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentBoards.filter(b => b.starred).map(board => (
                            <Link to={createPageUrl('Board')} key={board.id} className="group relative h-32 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                                <div className={`absolute inset-0 bg-gradient-to-br ${board.color}`} />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute p-4 inset-0 flex flex-col justify-between">
                                    <span className="font-bold text-white text-lg shadow-sm">{board.title}</span>
                                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent Boards */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-lg">
                        <Clock className="w-5 h-5" />
                        <h2>Recently Viewed</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentBoards.map(board => (
                            <Link to={createPageUrl('Board')} key={board.id} className="group relative h-32 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                                <div className={`absolute inset-0 bg-gradient-to-br ${board.color}`} />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute p-4 inset-0 flex flex-col justify-between">
                                    <span className="font-bold text-white text-lg shadow-sm">{board.title}</span>
                                    {board.starred && (
                                        <div className="flex justify-end">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}

                        <button className="group h-32 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600">
                            <Plus className="w-6 h-6" />
                            <span className="font-medium">Create new board</span>
                        </button>
                    </div>
                </section>

                {/* Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-lg">
                            <Activity className="w-5 h-5" />
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 items-start p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">JD</div>
                                    <div>
                                        <p className="text-slate-800 text-sm">
                                            <span className="font-bold">John Doe</span> moved card <span className="font-medium underline decoration-slate-300">Design System Research</span> from <span className="italic">To Do</span> to <span className="italic">In Progress</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-lg">
                            <Users className="w-5 h-5" />
                            <h2>Teams</h2>
                        </div>
                        <Card className="shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">AC</div>
                                        <div>
                                            <p className="font-bold text-sm">Acme Corp</p>
                                            <p className="text-xs text-slate-500">Premium Workspace</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon"><ArrowRight className="w-4 h-4" /></Button>
                                </div>
                                <Button variant="outline" className="w-full">Manage Team</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}