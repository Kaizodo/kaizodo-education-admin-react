import React, { useMemo } from 'react';
import { CheckCircle, Clock, Calendar, Tag, DollarSign, Package } from 'lucide-react';
import { Proposal } from '../LeadDetail';
import { formatCurrency, formatDateTime, formatDays } from '@/lib/utils';
import { ModalBody } from '@/components/common/Modal';




const DetailRow: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center text-gray-600">
            <div className="text-indigo-500 mr-3">{icon}</div>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
);

const FinancialSummaryRow: React.FC<{ label: string; value: number; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between py-2 ${isTotal ? 'text-lg font-bold border-t-2 border-indigo-200 mt-2 pt-3' : 'text-sm'}`}>
        <span className={isTotal ? 'text-indigo-700' : 'text-gray-600'}>{label}</span>
        <span className={isTotal ? 'text-indigo-700' : 'text-gray-800'}>{formatCurrency(value)}</span>
    </div>
);


export default function LeadProposalDetail({ proposal }: { proposal: Proposal }) {

    // --- CALCULATIONS ---
    const financialSummary = useMemo(() => {
        // Base Subscription
        const baseAmount = proposal.amount;

        // Total Topup Amounts
        const topupSubtotal = proposal.topup_plans.reduce((sum, item) => sum + item.amount, 0);

        // Total Taxable Base (Base + Topups) - Note: In a real system, tax calculation is much more complex
        const subtotal = baseAmount + topupSubtotal;

        // Calculate total taxes across all topups and base amount (assuming base has no separate tax breakdown)
        const totalCGST = proposal.topup_plans.reduce((sum, item) => sum + item.cgst, 0);
        const totalSGST = proposal.topup_plans.reduce((sum, item) => sum + item.sgst, 0);
        const totalIGST = proposal.topup_plans.reduce((sum, item) => sum + item.igst, 0);
        const totalTax = totalCGST + totalSGST + totalIGST;

        // Grand Total
        const grandTotal = subtotal + totalTax;

        return { subtotal, totalCGST, totalSGST, totalIGST, totalTax, grandTotal };
    }, [proposal]);


    const expiryDate = new Date(proposal.datetime_expiry).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const isTopupPresent = proposal.topup_plans.length > 0;

    return (
        <>
            <ModalBody>
                {/* Proposal Header Card */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-indigo-100">
                    <div className="p-6 md:p-8 bg-gradient-to-br from-yellow-50 to-white text-yellow-700">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                            {proposal.name || `Proposal #${proposal.id}`}
                        </h1>
                        <p className=" text-lg">
                            Internal Reference: <span className="font-mono bg-yellow-300 px-2 py-0.5 rounded text-sm">{proposal.internal_reference_number}</span>
                        </p>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">

                        <DetailRow
                            label="Status"
                            value={proposal.active === 1 ? 'Active' : 'Inactive'}
                            icon={<CheckCircle size={16} />}
                        />
                        <DetailRow
                            label="Duration"
                            value={formatDays(proposal.duration_days)}
                            icon={<Clock size={16} />}
                        />
                        <DetailRow
                            label="Expiry Date"
                            value={expiryDate}
                            icon={<Calendar size={16} />}
                        />
                        <DetailRow
                            label="Base Amount"
                            value={formatCurrency(proposal.amount)}
                            icon={<DollarSign size={16} />}
                        />

                        <DetailRow
                            label="Created At"
                            value={formatDateTime(proposal.created_at)}
                            icon={<Calendar size={16} />}
                        />
                    </div>
                </div>

                {/* Body Sections */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Features & Top-up Details (Main Column) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Subscription Features */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Tag className="text-indigo-500 mr-2" size={20} />
                                Subscription Features
                            </h2>
                            <ul className="space-y-3">
                                {proposal.features.map((feature) => (
                                    <li key={feature.id} className="flex items-start text-gray-700">
                                        <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0 mt-1 mr-2" />
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Top-up Plans */}
                        {isTopupPresent && (
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Package className="text-indigo-500 mr-2" size={20} />
                                    Top-Up Services ({proposal.topup_plans.length})
                                </h2>

                                <div className="space-y-4">
                                    {proposal.topup_plans.map((topup, index) => (
                                        <div key={index} className="border border-gray-100 rounded-lg p-4 bg-indigo-50 hover:bg-indigo-100 transition duration-150">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-lg font-semibold text-indigo-800">{topup.name || `Topup Item ${index + 1}`}</h3>
                                                <span className="text-xl font-bold text-indigo-600">{formatCurrency(topup.amount)}</span>
                                            </div>
                                            <div className="grid grid-cols-2 text-xs text-gray-600 gap-x-4">
                                                <p><span className="font-medium">Type:</span> {topup.topup_type === 1 ? 'Service' : 'Product'}</p>
                                                <p className="text-right"><span className="font-medium">Unit Price:</span> {formatCurrency(topup.price)} x {topup.quantity}</p>
                                                <p><span className="font-medium">SAC/HSN:</span> {topup.sac || topup.hsn || 'N/A'}</p>
                                            </div>
                                            <div className="flex justify-between mt-2 text-xs text-gray-500 border-t border-indigo-200 pt-2">
                                                <span>Taxes:</span>
                                                <span>CGST: {formatCurrency(topup.cgst)} | SGST: {formatCurrency(topup.sgst)} | IGST: {formatCurrency(topup.igst)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Financial Summary (Sidebar) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Financial Overview</h2>

                            <FinancialSummaryRow label="Base Subscription" value={proposal.amount} />
                            {isTopupPresent && (
                                <FinancialSummaryRow label="Total Top-ups" value={financialSummary.subtotal - proposal.amount} />
                            )}

                            <div className="border-t border-dashed my-3 pt-3">
                                <FinancialSummaryRow label="Subtotal (Pre-Tax)" value={financialSummary.subtotal} />
                            </div>

                            <FinancialSummaryRow label="Total CGST" value={financialSummary.totalCGST} />
                            <FinancialSummaryRow label="Total SGST" value={financialSummary.totalSGST} />
                            <FinancialSummaryRow label="Total IGST" value={financialSummary.totalIGST} />

                            <FinancialSummaryRow label="Total Tax" value={financialSummary.totalTax} />

                            <FinancialSummaryRow label="GRAND TOTAL" value={financialSummary.grandTotal} isTotal={true} />
                        </div>
                    </div>
                </div>
            </ModalBody>
        </>
    );
};


