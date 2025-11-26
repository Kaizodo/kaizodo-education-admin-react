import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertTriangle, User, MapPin, Phone, Mail } from "lucide-react";

export default function ProcessItemsDialog({
    open,
    onClose,
    selectedItems,
    items,
    order,
    onGenerateInvoice
}) {
    const [quantities, setQuantities] = useState({});
    const [cancelRemaining, setCancelRemaining] = useState({});

    useEffect(() => {
        const initial = {};
        const cancelInit = {};
        selectedItems.forEach(id => {
            const item = items.find(i => i.id === id);
            if (item) {
                initial[id] = item.quantity - (item.invoiced_quantity || 0);
                cancelInit[id] = false;
            }
        });
        setQuantities(initial);
        setCancelRemaining(cancelInit);
    }, [selectedItems, items]);

    const selectedItemsData = selectedItems.map(id => items.find(i => i.id === id)).filter(Boolean);

    const missingItems = selectedItemsData.filter(item => {
        const availableQty = quantities[item.id] || 0;
        const requestedQty = item.quantity - (item.invoiced_quantity || 0);
        return availableQty < requestedQty;
    });

    const calculateSubtotal = () => {
        return selectedItemsData.reduce((sum, item) => {
            const qty = quantities[item.id] || 0;
            return sum + (qty * item.unit_price) - (item.discount || 0);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const handleQuantityChange = (id, value) => {
        const item = items.find(i => i.id === id);
        const maxQty = item ? item.quantity - (item.invoiced_quantity || 0) : 0;
        const newValue = Math.min(Math.max(0, parseInt(value) || 0), maxQty);
        setQuantities(prev => ({ ...prev, [id]: newValue }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b bg-slate-50">
                    <DialogTitle className="text-xl font-semibold">Process Selected Items</DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column - Items Table */}
                    <div className="flex-1 border-r">
                        <ScrollArea className="h-[500px]">
                            <div className="p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Product</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead className="text-center">Requested</TableHead>
                                            <TableHead className="text-center">Available Qty</TableHead>
                                            <TableHead className="text-right">Line Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedItemsData.map((item) => {
                                            const requestedQty = item.quantity - (item.invoiced_quantity || 0);
                                            const availableQty = quantities[item.id] || 0;
                                            const isMissing = availableQty < requestedQty;

                                            return (
                                                <TableRow key={item.id} className={isMissing ? 'bg-amber-50/50' : ''}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            {item.product_image ? (
                                                                <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-slate-100" />
                                                            )}
                                                            <span className="font-medium text-sm">{item.product_name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm text-slate-500">{item.sku}</TableCell>
                                                    <TableCell className="text-center font-semibold">{requestedQty}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={requestedQty}
                                                            value={quantities[item.id] || 0}
                                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                            className="w-20 text-center mx-auto"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        ${((quantities[item.id] || 0) * item.unit_price).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Column - Calculations & Customer Info */}
                    <div className="w-80 bg-slate-50/50 flex flex-col">
                        <ScrollArea className="flex-1">
                            <div className="p-5 space-y-6">
                                {/* Customer Details */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Customer</h4>
                                    <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <span className="font-medium text-sm">{order?.customer_name}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <span className="text-sm text-slate-600 leading-relaxed">{order?.shipping_address}</span>
                                        </div>
                                        {order?.customer_phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <span className="text-sm text-slate-600">{order.customer_phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price Calculations */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Order Value</h4>
                                    <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Tax (10%)</span>
                                            <span className="font-medium">${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-slate-200 my-2" />
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Total</span>
                                            <span className="font-bold text-lg text-indigo-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Missing Items */}
                                {missingItems.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            <h4 className="font-semibold text-amber-700 text-sm">Incomplete Items</h4>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-4 space-y-3 border border-amber-200">
                                            {missingItems.map(item => {
                                                const requestedQty = item.quantity - (item.invoiced_quantity || 0);
                                                const missing = requestedQty - (quantities[item.id] || 0);
                                                return (
                                                    <div key={item.id} className="space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-sm font-medium text-amber-900">{item.product_name}</span>
                                                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                                                {missing} missing
                                                            </span>
                                                        </div>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <Checkbox
                                                                checked={cancelRemaining[item.id]}
                                                                onCheckedChange={(checked) =>
                                                                    setCancelRemaining(prev => ({ ...prev, [item.id]: checked }))
                                                                }
                                                                className="border-amber-400"
                                                            />
                                                            <span className="text-xs text-amber-700">Cancel remaining items</span>
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-slate-50">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Shipment labels will also be generated
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button
                                onClick={() => onGenerateInvoice(quantities, cancelRemaining)}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}