import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    TrendingUp,
    TrendingDown,
    Package,
    DollarSign,
    CreditCard,
    ChevronDown,
    Filter,
    Download,
    MoreHorizontal,
    ArrowRight
} from 'lucide-react';
import AppPage from '@/components/app/AppPage';

// --- Types based on User Context ---

type Party = {
    id: number;
    name: string;
    email: string;
    mobile: string;
    country_name: string;
    country_id: number;
    state_id: number;
    state_name: string;
    address: string;
    pincode: string;
    gst_number: string;
}

type Invoice = {
    id: string; // Added ID for UI keys
    status: 'Paid' | 'Pending' | 'Overdue'; // Added for UI
    seller: Party,
    buyer: Party,
    invoice: {
        amount: number
        base: number
        taxable: number
        tax: number
        discount: number
        shipping: number
        internal_reference_number: string
        currency_symbol: string
        created_at: string
    },
    invoice_items: {
        id: number
        name: string
        product_category_name: string
        unit_name: string
        quantity: number
        mrp: number
        sp: number
        base: number
        tax: number
        taxable: number
        total_amount: number
        discount_amount: number
        discount_percentage: number
        sac: string
        hsn: string
        code: string
    }[],
    invoice_item_taxes: any[], // Simplified for display
}

// --- Mock Data ---

const MOCK_PARTIES: Party[] = [
    { id: 1, name: "Acme Corp", email: "contact@acme.com", mobile: "+1 555-0123", country_name: "USA", country_id: 1, state_id: 1, state_name: "California", address: "123 Tech Blvd", pincode: "90210", gst_number: "GST123" },
    { id: 2, name: "Global Traders", email: "info@global.com", mobile: "+44 20 7946", country_name: "UK", country_id: 2, state_id: 2, state_name: "London", address: "45 Oxford St", pincode: "W1D 1BS", gst_number: "VAT456" },
    { id: 3, name: "Local Shop", email: "owner@local.com", mobile: "+91 9876543210", country_name: "India", country_id: 3, state_id: 3, state_name: "Maharashtra", address: "Shop 4, Mumbai", pincode: "400001", gst_number: "27AAAAA0000A1Z5" },
];

const MOCK_INVOICES: Invoice[] = [
    {
        id: "INV-2024-001",
        status: 'Paid',
        seller: MOCK_PARTIES[0],
        buyer: MOCK_PARTIES[1],
        invoice: { amount: 1250.00, base: 1000, taxable: 1000, tax: 250, discount: 0, shipping: 50, internal_reference_number: "REF001", currency_symbol: "$", created_at: "2024-10-25" },
        invoice_items: [{ id: 1, name: "Premium Widget", product_category_name: "Electronics", unit_name: "pcs", quantity: 10, mrp: 150, sp: 100, base: 1000, tax: 250, taxable: 1000, total_amount: 1250, discount_amount: 0, discount_percentage: 0, sac: "", hsn: "8517", code: "WID01" }],
        invoice_item_taxes: []
    },
    {
        id: "INV-2024-002",
        status: 'Pending',
        seller: MOCK_PARTIES[0],
        buyer: MOCK_PARTIES[2],
        invoice: { amount: 3400.50, base: 3000, taxable: 3000, tax: 400.50, discount: 100, shipping: 0, internal_reference_number: "REF002", currency_symbol: "$", created_at: "2024-10-26" },
        invoice_items: [{ id: 2, name: "Office Chair", product_category_name: "Furniture", unit_name: "pcs", quantity: 5, mrp: 800, sp: 600, base: 3000, tax: 400.50, taxable: 3000, total_amount: 3400.50, discount_amount: 100, discount_percentage: 10, sac: "", hsn: "9403", code: "CHR05" }],
        invoice_item_taxes: []
    },
    {
        id: "INV-2024-003",
        status: 'Overdue',
        seller: MOCK_PARTIES[0],
        buyer: MOCK_PARTIES[1],
        invoice: { amount: 150.00, base: 120, taxable: 120, tax: 30, discount: 0, shipping: 10, internal_reference_number: "REF003", currency_symbol: "$", created_at: "2024-10-20" },
        invoice_items: [{ id: 3, name: "HDMI Cable", product_category_name: "Accessories", unit_name: "pcs", quantity: 20, mrp: 10, sp: 6, base: 120, tax: 30, taxable: 120, total_amount: 150, discount_amount: 0, discount_percentage: 0, sac: "", hsn: "8544", code: "CAB02" }],
        invoice_item_taxes: []
    },
    {
        id: "INV-2024-004",
        status: 'Paid',
        seller: MOCK_PARTIES[0],
        buyer: MOCK_PARTIES[2],
        invoice: { amount: 5600.00, base: 5000, taxable: 5000, tax: 600, discount: 200, shipping: 100, internal_reference_number: "REF004", currency_symbol: "$", created_at: "2024-10-27" },
        invoice_items: [],
        invoice_item_taxes: []
    },
    {
        id: "INV-2024-005",
        status: 'Paid',
        seller: MOCK_PARTIES[0],
        buyer: MOCK_PARTIES[1],
        invoice: { amount: 920.00, base: 800, taxable: 800, tax: 120, discount: 0, shipping: 20, internal_reference_number: "REF005", currency_symbol: "$", created_at: "2024-10-28" },
        invoice_items: [],
        invoice_item_taxes: []
    }
];

// --- Components ---

// 1. Simple Custom Area Chart (SVG)
const SimpleAreaChart = ({ data, color = "#6366f1" }: { data: number[], color?: string }) => {
    const height = 60;
    const width = 120;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / (max - min)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={`M0,${height} L${points} L${width},${height} Z`}
                fill={color}
                fillOpacity="0.1"
            />
        </svg>
    );
};

// 2. Stat Card
const StatCard = ({ title, value, change, trend, icon: Icon, chartData, colorClass }: any) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <div className="flex items-end justify-between h-12">
                <div className="flex items-center text-sm">
                    {trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-rose-500 mr-1" />
                    )}
                    <span className={`font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {change}
                    </span>
                    <span className="text-slate-400 ml-1">vs last month</span>
                </div>
                <div className="w-24 h-10">
                    <SimpleAreaChart data={chartData} color={trend === 'up' ? '#10b981' : '#f43f5e'} />
                </div>
            </div>
        </div>
    );
};

// 3. Invoice Row Component
const InvoiceRow = ({ invoice }: { invoice: Invoice }) => {
    const statusColor = {
        Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Pending: "bg-amber-100 text-amber-700 border-amber-200",
        Overdue: "bg-rose-100 text-rose-700 border-rose-200"
    }[invoice.status];

    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{invoice.invoice.internal_reference_number}</span>
                    <span className="text-xs text-slate-500">{invoice.id}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                        {invoice.buyer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">{invoice.buyer.name}</div>
                        <div className="text-xs text-slate-500">{invoice.buyer.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-700">{invoice.invoice.created_at}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-slate-900">
                    {invoice.invoice.currency_symbol}{invoice.invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500">Tax: {invoice.invoice.tax.toFixed(2)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                    {invoice.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
};

// --- Main App Component ---

export default function ProductDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    // Toggle sidebar on mobile automatically
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredInvoices = useMemo(() => {
        return MOCK_INVOICES.filter(inv =>
            inv.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.invoice.internal_reference_number.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);



    return (<AppPage title='Dashboard' subtitle="Here's what's happening with your store today.">
        <div className="flex justify-between items-end mb-8">

            {currentView === 'Dashboard' && (
                <div className="flex items-center gap-2">
                    <button className="hidden sm:flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Last 7 Days <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200">
                        <Download className="w-4 h-4" /> Reports
                    </button>
                </div>
            )}
        </div>

        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="$54,230.50"
                    change="+12.5%"
                    trend="up"
                    icon={DollarSign}
                    chartData={[10, 25, 40, 30, 45, 50, 65, 80]}
                    colorClass="bg-indigo-500 text-indigo-500"
                />
                <StatCard
                    title="Total Orders"
                    value="1,452"
                    change="+8.2%"
                    trend="up"
                    icon={ShoppingBag}
                    chartData={[30, 40, 35, 50, 49, 60, 70, 90]}
                    colorClass="bg-blue-500 text-blue-500"
                />
                <StatCard
                    title="Active Customers"
                    value="892"
                    change="-2.4%"
                    trend="down"
                    icon={Users}
                    chartData={[60, 55, 40, 45, 30, 35, 20, 10]}
                    colorClass="bg-orange-500 text-orange-500"
                />
                <StatCard
                    title="Pending Shipments"
                    value="45"
                    change="+4.3%"
                    trend="up"
                    icon={Package}
                    chartData={[20, 25, 30, 35, 40, 45, 50, 55]}
                    colorClass="bg-purple-500 text-purple-500"
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
                            <p className="text-sm text-slate-500">Monthly revenue performance</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                            <option>Last 12 Months</option>
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end space-x-2 sm:space-x-4">
                        {[65, 40, 75, 55, 80, 60, 90, 70, 85, 95, 80, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full bg-indigo-50 rounded-t-sm relative group-hover:bg-indigo-100 transition-all duration-300"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500" style={{ height: `${h * 0.7}%` }}></div>

                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                        ${(h * 150).toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 mt-2">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Sellers / Categories */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Sales by Category</h3>
                    <p className="text-sm text-slate-500 mb-6">Top performing product categories</p>

                    <div className="space-y-5">
                        {[
                            { name: "Electronics", val: 75, color: "bg-indigo-500", amt: "$24k" },
                            { name: "Furniture", val: 45, color: "bg-emerald-500", amt: "$12k" },
                            { name: "Fashion", val: 30, color: "bg-orange-500", amt: "$8.5k" },
                            { name: "Accessories", val: 20, color: "bg-pink-500", amt: "$4k" }
                        ].map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">{cat.name}</span>
                                    <span className="text-slate-500">{cat.amt}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className={`h-2.5 rounded-full ${cat.color}`} style={{ width: `${cat.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-800">85%</div>
                                <div className="text-xs text-slate-500">Growth</div>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-800">4.8</div>
                                <div className="text-xs text-slate-500">Rating</div>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-800">12k</div>
                                <div className="text-xs text-slate-500">Sales</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table (Preview) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                    <button
                        onClick={() => setCurrentView('Orders')}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Ref</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredInvoices.slice(0, 5).map((inv) => (
                                <InvoiceRow key={inv.id} invoice={inv} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </AppPage>);
};

