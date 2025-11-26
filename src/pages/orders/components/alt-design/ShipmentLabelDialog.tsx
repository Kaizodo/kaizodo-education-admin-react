import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Package, Calendar, Ruler, Tag, Edit2 } from "lucide-react";

const carriers = [
    { value: 'fedex', label: 'FedEx' },
    { value: 'ups', label: 'UPS' },
    { value: 'dhl', label: 'DHL' },
    { value: 'usps', label: 'USPS' },
    { value: 'bluedart', label: 'BlueDart' },
    { value: 'delhivery', label: 'Delhivery' },
];

export default function ShipmentDialog({
    open,
    onClose,
    invoice,
    onSubmit,
    onGenerateLabels,
    isEditing = false
}) {
    const [formData, setFormData] = useState({
        carrier: '',
        tracking_number: '',
        weight: '',
        dimensions: '',
        pickup_date: '',
        estimated_delivery: '',
        special_instructions: ''
    });
    const [labelsGenerated, setLabelsGenerated] = useState(false);

    useEffect(() => {
        if (invoice?.shipment_info) {
            setFormData(invoice.shipment_info);
            setLabelsGenerated(invoice.labels_generated || false);
        }
    }, [invoice]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const handleGenerateLabels = () => {
        onGenerateLabels(formData);
        setLabelsGenerated(true);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-indigo-600" />
                        {isEditing ? 'Edit Shipment Information' : 'Enter Shipment Details'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Carrier</Label>
                            <Select value={formData.carrier} onValueChange={(v) => handleChange('carrier', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select carrier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {carriers.map(c => (
                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Tracking Number</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    value={formData.tracking_number}
                                    onChange={(e) => handleChange('tracking_number', e.target.value)}
                                    className="pl-10"
                                    placeholder="Enter tracking #"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Package Weight (kg)</Label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => handleChange('weight', e.target.value)}
                                    className="pl-10"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Dimensions (LxWxH)</Label>
                            <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    value={formData.dimensions}
                                    onChange={(e) => handleChange('dimensions', e.target.value)}
                                    className="pl-10"
                                    placeholder="20x15x10 cm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Pickup Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="date"
                                    value={formData.pickup_date}
                                    onChange={(e) => handleChange('pickup_date', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Estimated Delivery</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="date"
                                    value={formData.estimated_delivery}
                                    onChange={(e) => handleChange('estimated_delivery', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Special Instructions</Label>
                        <Textarea
                            value={formData.special_instructions}
                            onChange={(e) => handleChange('special_instructions', e.target.value)}
                            placeholder="Any special handling instructions..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    {!labelsGenerated ? (
                        <>
                            <Button variant="outline" onClick={handleSubmit}>
                                Save Info
                            </Button>
                            <Button
                                onClick={handleGenerateLabels}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Generate Labels
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleSubmit} className="gap-2">
                                <Edit2 className="w-4 h-4" />
                                Update & Regenerate
                            </Button>
                            <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700">
                                Done
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}