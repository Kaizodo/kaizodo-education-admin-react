import StatCard from "./components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Target } from "lucide-react";
import { mockLeads, statusConfig } from "@/data/mockData";
import { Link } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import AppPage from "@/components/app/AppPage";

export default function LeadDashboard() {
    const totalLeads = mockLeads.length;
    const totalValue = mockLeads.reduce((sum, lead) => sum + lead.value, 0);
    const wonLeads = mockLeads.filter((l) => l.status === "won").length;
    const activeLeads = mockLeads.filter((l) => !["won", "lost"].includes(l.status)).length;

    const recentLeads = mockLeads.slice(0, 5);

    const statusData = Object.entries(statusConfig).map(([status, config]) => ({
        name: config.label,
        value: mockLeads.filter((l) => l.status === status).length,
        color: config.color,
    }));

    const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#f59e0b", "#f97316", "#22c55e", "#ef4444"];

    const conversionData = [
        { stage: "New", count: mockLeads.filter((l) => l.status === "new").length },
        { stage: "Contacted", count: mockLeads.filter((l) => l.status === "contacted").length },
        { stage: "Qualified", count: mockLeads.filter((l) => l.status === "qualified").length },
        { stage: "Proposal", count: mockLeads.filter((l) => l.status === "proposal").length },
        { stage: "Won", count: mockLeads.filter((l) => l.status === "won").length },
    ];

    return (
        <AppPage title="Dashboard" subtitle="Welcome back! Here's your sales overview.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Leads"
                    value={totalLeads}
                    description="Active prospects"
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="Pipeline Value"
                    value={`$${(totalValue / 1000).toFixed(0)}K`}
                    description="Total opportunity value"
                    icon={DollarSign}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${((wonLeads / totalLeads) * 100).toFixed(0)}%`}
                    description="Closed won deals"
                    icon={TrendingUp}
                    trend={{ value: 3, isPositive: true }}
                />
                <StatCard
                    title="Active Deals"
                    value={activeLeads}
                    description="In progress"
                    icon={Target}
                    trend={{ value: 5, isPositive: false }}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Lead Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={conversionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="stage" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Leads */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Leads</CardTitle>

                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentLeads.map((lead) => (
                            <Link
                                key={lead.id}
                                to={`/leads/${lead.id}`}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-semibold text-primary">
                                            {lead.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium truncate">{lead.name}</p>
                                            <span
                                                className={`px-2 py-0.5 text-xs rounded-full text-white ${statusConfig[lead.status].color
                                                    }`}
                                            >
                                                {statusConfig[lead.status].label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{lead.company}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="font-semibold">${lead.value.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">{lead.assignedTo}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AppPage>
    );
};

