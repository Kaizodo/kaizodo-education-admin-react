import AppPage from '@/components/app/AppPage';
import CenterLoading from '@/components/common/CenterLoading';
import { InvoiceDetailState, InvoiceItemTax } from '@/data/Invoice';
import { Party } from '@/data/UserOrder';
import { useForm } from '@/hooks/use-form';
import { UserOrderService } from '@/services/UserOrderService';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoRecords from '@/components/common/NoRecords';
import { FaShippingFast } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { LuChevronRight, LuDownload } from 'react-icons/lu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoEllipsisVerticalCircleOutline } from 'react-icons/io5';
import { msg } from '@/lib/msg';
import Btn from '@/components/common/Btn';
import { downloadInvoice } from '@/pages/invoices/components/DownloadInvoiceBtn';

// Item in the Invoice
interface InvoiceItem {
    sNo: number;
    description: string;
    hsnSac: string; // HSN (Goods) or SAC (Services) Code
    qty: number;
    rate: number;
    unit: string;
    total: number; // qty * rate
    cgstRate: number; // Central GST rate (%)
    sgstRate: number; // State GST rate (%)
    igstRate: number; // Integrated GST rate (%) - Applicable for inter-state
}

// Full Invoice Data structure
interface InvoiceData {
    invoiceNumber: string;
    invoiceDate: string;
    supplier: Party;
    customer: Party;
    items: InvoiceItem[];
}

// --- 2. MOCK DATA (Sample Indian Invoice) ---
const mockInvoiceData: InvoiceData = {
    invoiceNumber: 'INV-2024/00786',
    invoiceDate: '2024-11-27',
    supplier: {
        name: 'TechSolutions India Pvt. Ltd.',
        addressLine1: 'Unit 401, Cyber Heights',
        addressLine2: 'MG Road, Sec-14',
        city: 'Gurugram',
        state: 'Haryana',
        pinCode: '122001',
        gstin: '06AAACE1234F1Z9',
        pan: 'AAACE1234F',
    },
    customer: {
        name: 'Digital Edge Marketing',
        addressLine1: 'Plot No. 18, Commercial Complex',
        addressLine2: 'Bandra Kurla Complex (BKC)',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400051',
        gstin: '27AABCT9876D1Z5',
    },
    items: [
        {
            sNo: 1,
            description: 'Web Development Service Package (Monthly)',
            hsnSac: '998314', // SAC code for web hosting
            qty: 1,
            rate: 45000.00,
            unit: 'Month',
            total: 45000.00,
            cgstRate: 9,
            sgstRate: 9,
            igstRate: 0,
        },
        {
            sNo: 2,
            description: 'Annual Cloud Storage Subscription',
            hsnSac: '998439', // SAC code for IT consulting
            qty: 1,
            rate: 15000.00,
            unit: 'Year',
            total: 15000.00,
            cgstRate: 9,
            sgstRate: 9,
            igstRate: 0,
        },
        {
            sNo: 3,
            description: '24-inch LED Monitor (Hardware Sale)',
            hsnSac: '8528', // HSN code for Monitor
            qty: 2,
            rate: 8000.00,
            unit: 'Pcs',
            total: 16000.00,
            cgstRate: 0,
            sgstRate: 0,
            igstRate: 18, // Assuming inter-state sale if different state
        },
    ],
};


// --- 4. CALCULATION LOGIC ---

interface InvoiceTotals {
    subtotal: number;
    totalTax: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    grandTotal: number;
}

const calculateTotals = (items: InvoiceItem[]): InvoiceTotals => {
    let subtotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach(item => {
        subtotal += item.total;

        // Calculate tax amounts based on the total for that line item
        const cgstAmount = item.total * (item.cgstRate / 100);
        const sgstAmount = item.total * (item.sgstRate / 100);
        const igstAmount = item.total * (item.igstRate / 100);

        totalCGST += cgstAmount;
        totalSGST += sgstAmount;
        totalIGST += igstAmount;
    });

    const totalTax = totalCGST + totalSGST + totalIGST;
    const grandTotal = subtotal + totalTax;

    return {
        subtotal,
        totalTax,
        totalCGST,
        totalSGST,
        totalIGST,
        grandTotal,
    };
};

// --- 5. REACT COMPONENT ---

const PartyDetail: React.FC<{ title: string, party: Party }> = ({ title, party }) => (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1">{title}</h3>
        <p className="text-xl font-semibold text-indigo-700">{party.name}</p>
        <p className="text-sm text-gray-600 mt-1">
            {party.address}
            <br />
            {party.country_name}, {party.state_name} - {party.pincode}
        </p>
        <p className="text-xs mt-3 font-medium">
            <span className="font-bold text-gray-700">GSTIN:</span> {party.gst_number}
        </p>

    </div>
);



export default function InvoiceDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<InvoiceDetailState>();
    const [form, setValue, setForm] = useForm<any>({})


    const load = async () => {
        if (!internal_reference_number) {
            return;
        }
        setLoading(true);
        var r = await UserOrderService.invoiceDetail(internal_reference_number);
        if (r.success) {
            setState(r.data);
            setForm({});
            setLoading(false);
        } else {
            navigate(-1);
        }
    }

    const groupInvoiceTax = () => {
        if (!state) {
            return [];
        }
        const map: Record<string, number> = {};

        for (const t of state?.invoice_item_taxes) {
            const key = `${t.name} ${t.percentage}%`;
            map[key] = (map[key] || 0) + Number(t.amount);
        }

        return Object.entries(map).map(([label, total]) => ({
            label,
            total
        }));
    }

    const data = mockInvoiceData;
    const totals = calculateTotals(data.items);


    useEffect(() => {
        load();
    }, [internal_reference_number])


    if (!state || loading) {
        return <CenterLoading className="relative h-screen" />
    }


    var tax_component_ids = [...new Set(state.invoice_item_taxes.map(t => t.tax_component_id))];

    var tax_components = tax_component_ids.map(t => {
        var found = state.invoice_item_taxes.find(i => i.tax_component_id == t);
        if (!found) {
            return null;
        }
        return found;
    }).filter(Boolean) as InvoiceItemTax[];

    const tax_groups = groupInvoiceTax();

    return (<AppPage
        enableBack={true}
        title={'Invoice #' + state.invoice.internal_reference_number}
        subtitle={`${formatDateTime(state.invoice.created_at)} | ORDER #${state.invoice.order_internal_reference_number}`}
        actions={<DropdownMenu>
            <DropdownMenuTrigger>
                <Btn variant="outline">Downloads <IoEllipsisVerticalCircleOutline /></Btn>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Available Downloads</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={async () => {
                        var msg_id = msg.loading('Downloading...');
                        if (internal_reference_number) {
                            await downloadInvoice({ internal_reference_number: internal_reference_number });
                        }

                        msg.dismiss(msg_id);
                    }} className="justify-between">Download Invoice <LuDownload /></DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                        var msg_id = msg.loading('Downloading...');
                        if (internal_reference_number) {
                            await downloadInvoice({
                                internal_reference_number: internal_reference_number, additional_data: {
                                    label: 'dc'
                                }
                            });
                        }
                        msg.dismiss(msg_id);
                    }} className="justify-between">Delivery Challan <LuDownload /></DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                        var msg_id = msg.loading('Downloading...');
                        if (internal_reference_number) {
                            await downloadInvoice({
                                internal_reference_number: internal_reference_number, additional_data: {
                                    label: 'dc1'
                                }
                            });
                        }

                        msg.dismiss(msg_id);
                    }} className="justify-between">Delivery Challan Copy(1)<LuDownload /></DropdownMenuItem>
                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>}
    >
        <div className='flex flex-row gap-6'>
            <div className="flex-1 ">



                {/* --- Seller & Buyer Details --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <PartyDetail title="Seller (Billed From)" party={state.seller_party} />
                    <PartyDetail title="Buyer (Billed To)" party={state.buyer_party} />
                </div>

                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 mt-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-indigo-700 text-white">
                            <tr>
                                <th className="py-3 px-2 text-left text-xs font-medium uppercase w-8">S.No.</th>
                                <th className="py-3 px-4 text-left text-xs font-medium uppercase w-48">Description</th>
                                <th className="py-3 px-2 text-center text-xs font-medium uppercase w-16">HSN/SAC</th>
                                <th className="py-3 px-2 text-center text-xs font-medium uppercase w-12">Qty</th>
                                <th className="py-3 px-2 text-center text-xs font-medium uppercase w-16">Rate</th>
                                {tax_components.map(t => {
                                    return <th className="py-3 px-2 text-center text-xs font-medium uppercase w-12">{t.name} (%)</th>
                                })}
                                <th className="py-3 px-4 text-right text-xs font-medium uppercase w-20">Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {state.invoice_items.map((item, item_index) => (
                                <tr key={item.id}>
                                    <td className="py-3 px-2 whitespace-nowrap text-sm text-center font-medium text-gray-900">{item_index + 1}</td>
                                    <td className="py-3 px-4 text-left text-sm text-gray-700">
                                        {item.name}
                                    </td>
                                    <td className="py-3 px-2 whitespace-nowrap text-sm text-center text-gray-600">{item.sac || item.hsn}</td>
                                    <td className="py-3 px-2 whitespace-nowrap text-sm text-center text-gray-600">{item.quantity} {item.unit_name}</td>
                                    <td className="py-3 px-2 whitespace-nowrap text-sm text-right text-gray-600">{state.invoice.currency_symbol}{item.sp}</td>
                                    {tax_components.map(t => {
                                        var found = state.invoice_item_taxes.find(tx => tx.tax_component_id == t.tax_component_id && tx.invoice_item_id == item.id);

                                        return <td className="py-3 px-2 whitespace-nowrap text-sm text-center text-gray-600">{found?.percentage ?? 0}%</td>
                                    })}
                                    <td className="py-3 px-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900">{state.invoice.currency_symbol}{item.total_amount}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                    <div className="flex flex-col md:flex-row justify-between px-4 bg-white border-t">
                        {/* Tax Summary (Left/Top) */}
                        <div className="w-full md:w-1/2 p-2">
                            <h4 className="font-semibold text-lg mb-2 border-b-2 pb-1 text-gray-800">Tax Summary (GST)</h4>
                            <div className="space-y-1 text-sm">
                                {tax_groups.map((tax, tax_index) => {
                                    return (<div key={tax_index} className="flex justify-between">
                                        <span className="text-gray-600">{tax.label}:</span>
                                        <span className="font-medium text-gray-900">{state.invoice.currency_symbol}{tax.total}</span>
                                    </div>)
                                })}


                                <div className="flex justify-between pt-2 border-t font-bold text-base text-green-700">
                                    <span>Total Tax Amount:</span>
                                    <span>{state.invoice.currency_symbol}{tax_groups.reduce((pv, cv) => pv += cv.total, 0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Grand Total (Right/Bottom) */}
                        <div className="w-full md:w-1/2 p-2 md:pl-8 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200">
                            <div className="flex flex-col justify-end space-y-3">
                                <div className="text-lg font-semibold text-gray-700">
                                    Total Payable (Tax + Subtotal):
                                </div>
                                <div className="text-4xl font-extrabold text-indigo-700 border-b-4 border-indigo-200 pb-2">
                                    {state.invoice.currency_symbol}{state.invoice.amount}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





            </div>
            <div className='w-[350px] '>
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Shipments</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        {state.shipments.length == 0 && <NoRecords icon={FaShippingFast} title='No Shipments Yet' subtitle='Create new shipments and manage product delivery' />}
                        {state.shipments.map(shipment => {
                            // const meta = getUserOrderStatusMeta(shipment.status);
                            return (<Link
                                key={shipment.id}
                                to={`/shipments/${shipment.internal_reference_number}`}
                                className="flex items-center justify-between p-3 mb-2 border rounded-xl hover:shadow-md transition w-full"
                            >
                                <div className="flex flex-col gap-1 w-full">

                                    <div className="flex flex-wrap gap-1">
                                        {shipment.items.map(i => (
                                            <Badge key={i.id} className="text-xs px-2 py-0.5">
                                                {i.name}
                                            </Badge>
                                        ))}
                                    </div>

                                    <span className="font-semibold text-sm">
                                        {shipment.internal_reference_number}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        Last Update: {formatDateTime(shipment.updated_at ?? shipment.created_at)}
                                    </span>
                                </div>

                                <LuChevronRight className="text-gray-400" />
                            </Link>);
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppPage>);
};
