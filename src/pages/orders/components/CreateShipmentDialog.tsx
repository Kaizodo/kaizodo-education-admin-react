import { useState } from 'react';
import {
    CheckCircle2,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import { useForm } from '@/hooks/use-form';
import CreateShipmentStep1 from './CreateShipmentStep1';
import CreateShipmentStep2 from './CreateShipmentStep2';
import CreateShipmentStep3 from './CreateShipmentStep3';
import CreateShipmentStep4 from './CreateShipmentStep4';
import { UserOrderService } from '@/services/UserOrderService';
import { msg } from '@/lib/msg';
import { ShipmentPackageType } from '@/data/order';

const steps = [
    { num: 1, label: 'Stock / Picking' },
    { num: 2, label: 'Packing' },
    { num: 3, label: 'Summary' },
];




const StepIndicator = ({ currentStep }: { currentStep: number }) => {


    return (
        <div className="w-full py-6 px-4 bg-white border-b border-gray-100 mb-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {steps.map((step, idx) => (
                    <div key={step.num} className="flex flex-col items-center relative z-10 w-1/4">
                        <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors duration-300
              ${currentStep >= step.num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
                        >
                            {currentStep > step.num ? <CheckCircle2 size={18} /> : step.num}
                        </div>
                        <span className={`mt-2 text-xs md:text-sm font-medium ${currentStep >= step.num ? 'text-indigo-900' : 'text-gray-400'}`}>
                            {step.label}
                        </span>

                        { }
                        {idx !== steps.length - 1 && (
                            <div className={`absolute top-4 md:top-5 left-1/2 w-full h-[2px] -z-10 
                ${currentStep > step.num ? 'bg-indigo-600' : 'bg-gray-100'}`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function CreateShipmentDialog({ onSuccess, user_order_id, organization, items, currency_symbol, currency_code }) {
    const [form, setValue] = useForm({
        user_order_id,
        organization: organization,
        all_items: items,
        items: items.map(i => ({
            ...i,
            selected_quantity: i.quantity_unlocked,
            quantity: i.quantity_unlocked
        })),
        currency_symbol,
        currency_code,
        tracking_number: '',
        pickup_date: '',
        dispatch_date: '',
        notes: '',
        total_amount: 0,
        package_type: ShipmentPackageType.Individual,
        print_type: 'normal',
        print_orientation: 'portrait',
        labels_high: 2,
        labels_wide: 2
    });
    const [step, setStep] = useState<number>(1);

    const [submitted, setSubmitted] = useState(false);

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        var r = await UserOrderService.createShipment({
            organization_id: form.organization?.id,
            user_order_id,
            items: form.items.map((i) => ({
                id: i.id,
                quantity: i.selected_quantity,
                package_weight: i.package_weight,
                package_length: i.package_length,
                package_width: i.package_width,
                package_height: i.package_height
            })),
            tracking_number: form.tracking_number,
            pickup_date: form.pickup_date,
            dispatch_date: form.dispatch_date,
            notes: form.notes,
            package_type: form.package_type,
            package_weight: form.package_weight,
            package_length: form.package_length,
            package_width: form.package_width,
            package_height: form.package_height
        });
        if (r.success) {
            setSubmitted(true);
            msg.success('Shipment created');
            onSuccess(r.data);
        }
        return r.success;
    };








    const SuccessScreen = () => (
        <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shipment Created!</h2>
            <p className="text-gray-500 mb-8">Your shipment request ID #99281 has been successfully submitted.</p>

            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-200"
            >
                Create Another Shipment
            </button>
        </div>
    );

    if (submitted) return <div className="min-h-screen bg-gray-50 p-4 font-sans"><div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"><SuccessScreen /></div></div>;

    return (
        <>
            <ModalBody>
                <StepIndicator currentStep={step} />

                {step === 1 && (
                    <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CreateShipmentStep1 form={form} setValue={setValue} />
                    </div>
                )}

                {step === 2 && (
                    <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CreateShipmentStep2 form={form} setValue={setValue} />
                    </div>
                )}

                {/* {step === 3 && (
                    <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CreateShipmentStep3 form={form} setValue={setValue} />
                    </div>
                )} */}

                {step === 3 && (
                    <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CreateShipmentStep4 form={form} setValue={setValue} />
                    </div>
                )}


            </ModalBody>
            <ModalFooter className='justify-between'>
                {step > 1 ? (
                    <Btn
                        onClick={handleBack}
                        variant={'outline'}
                    >
                        <ChevronLeft size={20} /> Back
                    </Btn>
                ) : (
                    <div></div>
                )}

                {step < steps.length ? (
                    <Btn
                        onClick={handleNext}
                        disabled={step === 1 && !form.organization?.id || step === 2 && form.items.filter(i => !!i?.selected_quantity).length === 0}
                    >
                        Next Step <ChevronRight size={20} />
                    </Btn>
                ) : (
                    <Btn
                        asyncClick={handleSubmit}

                    >
                        Submit Request <CheckCircle2 size={20} />
                    </Btn>
                )}
            </ModalFooter>
        </>
    );
}