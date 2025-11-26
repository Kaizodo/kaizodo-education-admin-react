import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag, Calendar, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import StoreItemsCard from "@/components/order/StoreItemsCard";
import FloatingSelectionBar from "@/components/order/FloatingSelectionBar";
import ProcessItemsDialog from "@/components/order/ProcessItemsDialog";
import ShipmentDialog from "@/components/order/ShipmentDialog";
import CustomerInfoCard from "@/components/order/CustomerInfoCard";
import OrderValueCard from "@/components/order/OrderValueCard";
import InvoicesCard from "@/components/order/InvoicesCard";
import CancellationsCard from "@/components/order/CancellationsCard";

export default function OrderDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    const queryClient = useQueryClient();

    const [selectedItems, setSelectedItems] = useState([]);
    const [processDialogOpen, setProcessDialogOpen] = useState(false);
    const [shipmentDialogOpen, setShipmentDialogOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);

    // Fetch order
    const { data: order, isLoading: orderLoading } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => base44.entities.Order.filter({ id: orderId }),
        select: (data) => data[0],
        enabled: !!orderId
    });

    // Fetch order items
    const { data: orderItems = [], isLoading: itemsLoading } = useQuery({
        queryKey: ['orderItems', orderId],
        queryFn: () => base44.entities.OrderItem.filter({ order_id: orderId }),
        enabled: !!orderId
    });

    // Fetch stores for items
    const storeIds = [...new Set(orderItems.map(item => item.store_id))];
    const { data: stores = [] } = useQuery({
        queryKey: ['stores', storeIds],
        queryFn: async () => {
            if (storeIds.length === 0) return [];
            const allStores = await base44.entities.Store.list();
            return allStores.filter(s => storeIds.includes(s.id));
        },
        enabled: storeIds.length > 0
    });

    // Fetch invoices
    const { data: invoices = [] } = useQuery({
        queryKey: ['invoices', orderId],
        queryFn: () => base44.entities.Invoice.filter({ order_id: orderId }),
        enabled: !!orderId
    });

    // Fetch cancellations
    const { data: cancellations = [] } = useQuery({
        queryKey: ['cancellations', orderId],
        queryFn: () => base44.entities.Cancellation.filter({ order_id: orderId }),
        enabled: !!orderId
    });

    // Mutations
    const createInvoiceMutation = useMutation({
        mutationFn: (data) => base44.entities.Invoice.create(data),
        onSuccess: (newInvoice) => {
            queryClient.invalidateQueries(['invoices', orderId]);
            queryClient.invalidateQueries(['orderItems', orderId]);
            setCurrentInvoice(newInvoice);
            setProcessDialogOpen(false);
            setShipmentDialogOpen(true);
        }
    });

    const updateInvoiceMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Invoice.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['invoices', orderId]);
        }
    });

    const updateOrderItemMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.OrderItem.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['orderItems', orderId]);
        }
    });

    const createCancellationMutation = useMutation({
        mutationFn: (data) => base44.entities.Cancellation.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['cancellations', orderId]);
        }
    });

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = (storeId, select) => {
        const storeItemIds = orderItems
            .filter(item => item.store_id === storeId && item.status !== 'invoiced' && item.status !== 'cancelled')
            .map(item => item.id);

        if (select) {
            setSelectedItems(prev => [...new Set([...prev, ...storeItemIds])]);
        } else {
            setSelectedItems(prev => prev.filter(id => !storeItemIds.includes(id)));
        }
    };

    const handleDownloadList = (store, items) => {
        // Generate PDF content
        const content = items.map(item =>
            `${item.product_name} (SKU: ${item.sku}) - Qty: ${item.quantity}`
        ).join('\n');

        const blob = new Blob([
            `Store: ${store.name}\n`,
            `Order: ${order?.order_number}\n`,
            `Date: ${new Date().toLocaleDateString()}\n\n`,
            `Items:\n${content}`
        ], { type: 'text/plain' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${store.name}_${order?.order_number}_items.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateInvoice = async (quantities, cancelRemaining) => {
        const selectedItemsData = selectedItems.map(id => orderItems.find(i => i.id === id)).filter(Boolean);
        const storeId = selectedItemsData[0]?.store_id;

        const invoiceItems = selectedItemsData.map(item => ({
            order_item_id: item.id,
            product_name: item.product_name,
            sku: item.sku,
            requested_quantity: item.quantity - (item.invoiced_quantity || 0),
            invoiced_quantity: quantities[item.id] || 0,
            unit_price: item.unit_price,
            total: (quantities[item.id] || 0) * item.unit_price
        }));

        const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        const invoiceNumber = `INV-${Date.now()}`;

        // Create invoice
        await createInvoiceMutation.mutateAsync({
            invoice_number: invoiceNumber,
            order_id: orderId,
            store_id: storeId,
            items: invoiceItems,
            subtotal,
            tax,
            total,
            status: 'generated'
        });

        // Update order items
        for (const item of selectedItemsData) {
            const invoicedQty = quantities[item.id] || 0;
            const newInvoicedTotal = (item.invoiced_quantity || 0) + invoicedQty;
            const requestedQty = item.quantity - (item.invoiced_quantity || 0);
            const missing = requestedQty - invoicedQty;

            let newStatus = item.status;
            let cancelledQty = item.cancelled_quantity || 0;

            if (newInvoicedTotal >= item.quantity) {
                newStatus = 'invoiced';
            } else if (invoicedQty > 0) {
                newStatus = 'partially_cancelled';
            }

            if (cancelRemaining[item.id] && missing > 0) {
                cancelledQty += missing;
                newStatus = newInvoicedTotal > 0 ? 'partially_cancelled' : 'cancelled';
            }

            await updateOrderItemMutation.mutateAsync({
                id: item.id,
                data: {
                    invoiced_quantity: newInvoicedTotal,
                    cancelled_quantity: cancelledQty,
                    status: newStatus
                }
            });
        }

        // Create cancellation records for cancelled items
        const cancelledItems = selectedItemsData.filter(item => cancelRemaining[item.id]);
        if (cancelledItems.length > 0) {
            const cancellationItems = cancelledItems.map(item => {
                const requestedQty = item.quantity - (item.invoiced_quantity || 0);
                const missing = requestedQty - (quantities[item.id] || 0);
                return {
                    order_item_id: item.id,
                    product_name: item.product_name,
                    quantity: missing,
                    reason: 'Stock unavailable'
                };
            });

            const cancellationValue = cancellationItems.reduce((sum, ci) => {
                const item = orderItems.find(i => i.id === ci.order_item_id);
                return sum + (ci.quantity * (item?.unit_price || 0));
            }, 0);

            await createCancellationMutation.mutateAsync({
                order_id: orderId,
                store_id: storeId,
                type: 'cancellation',
                items: cancellationItems,
                total_value: cancellationValue,
                status: 'completed',
                reason: 'Partial fulfillment - stock unavailable'
            });
        }

        setSelectedItems([]);
    };

    const handleShipmentSubmit = async (shipmentData) => {
        if (currentInvoice) {
            await updateInvoiceMutation.mutateAsync({
                id: currentInvoice.id,
                data: { shipment_info: shipmentData }
            });
        }
    };

    const handleGenerateLabels = async (shipmentData) => {
        if (currentInvoice) {
            await updateInvoiceMutation.mutateAsync({
                id: currentInvoice.id,
                data: {
                    shipment_info: shipmentData,
                    labels_generated: true,
                    status: 'labels_generated'
                }
            });
            setShipmentDialogOpen(false);
        }
    };

    const statusColors = {
        pending: 'bg-slate-100 text-slate-700',
        processing: 'bg-blue-100 text-blue-700',
        partially_fulfilled: 'bg-amber-100 text-amber-700',
        fulfilled: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700'
    };

    if (orderLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-7xl mx-auto text-center py-20">
                    <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700">Order not found</h2>
                    <Link to={createPageUrl('Orders')}>
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Orders
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to={createPageUrl('Orders')}>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Order {order.order_number}
                                </h1>
                                <Badge className={`${statusColors[order.status]} border-0`}>
                                    {order.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {order.order_date && format(new Date(order.order_date), 'MMM d, yyyy h:mm a')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Hash className="w-4 h-4" />
                                    {orderItems.length} items
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer & Order Value */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CustomerInfoCard order={order} />
                    <OrderValueCard order={order} />
                </div>

                {/* Store Items */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900">Order Items by Store</h2>
                    {stores.map(store => (
                        <StoreItemsCard
                            key={store.id}
                            store={store}
                            items={orderItems}
                            selectedItems={selectedItems}
                            onSelectItem={handleSelectItem}
                            onSelectAll={handleSelectAll}
                            onDownloadList={handleDownloadList}
                        />
                    ))}
                </div>

                {/* Invoices & Cancellations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InvoicesCard invoices={invoices} />
                    <CancellationsCard cancellations={cancellations} />
                </div>

                {/* Floating Selection Bar */}
                <FloatingSelectionBar
                    count={selectedItems.length}
                    onProcess={() => setProcessDialogOpen(true)}
                    onClear={() => setSelectedItems([])}
                />

                {/* Process Items Dialog */}
                <ProcessItemsDialog
                    open={processDialogOpen}
                    onClose={() => setProcessDialogOpen(false)}
                    selectedItems={selectedItems}
                    items={orderItems}
                    order={order}
                    onGenerateInvoice={handleGenerateInvoice}
                />

                {/* Shipment Dialog */}
                <ShipmentDialog
                    open={shipmentDialogOpen}
                    onClose={() => setShipmentDialogOpen(false)}
                    invoice={currentInvoice}
                    onSubmit={handleShipmentSubmit}
                    onGenerateLabels={handleGenerateLabels}
                />
            </div>
        </div>
    );
}