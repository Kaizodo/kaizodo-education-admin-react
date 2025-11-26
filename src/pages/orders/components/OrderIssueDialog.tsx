import React, { useState, useMemo, ChangeEvent } from 'react';
import { Ban, RefreshCw, Undo2, ChevronRight, ChevronLeft, CheckCircle, Info, Home, Package, ListChecks } from 'lucide-react';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import { Organization } from '@/data/Organization';
import { UserOrderItem } from '@/data/UserOrder';
import { useForm } from '@/hooks/use-form';
import { SetValueType } from '@/hooks/use-set-value';
import { UserOrderIssueType, UserOrderStatus } from '@/data/order';
import OrderIssueDialogStep1 from './OrderIssueDialogStep1';
import Btn from '@/components/common/Btn';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import OrderIssueDialogStep2 from './OrderIssueDialogStep2';

// --- 1. TYPE DEFINITIONS ---

type IssueType = 'Cancellation' | 'Replacement' | 'Return' | null;
type CancellationSubType = 'Full' | 'Partial' | null;

interface Item {
    id: string;
    name: string;
    quantity: number;
    selectedQuantity: number;
}

interface IssueData {
    title: string;
    icon: React.FC<any>;
    reasons: string[];
    cancellationOptions?: CancellationSubType[];
    guide: string[];
    color: string;
}

interface IssueState {
    orderId: string;
    issueType: IssueType;
    cancellationType: CancellationSubType;
    reason: string;
    details: string;
    step: number;
    items: Item[]; // Mock items in the order
}

// --- 2. ISSUE CONFIGURATION DATA ---

const ISSUE_CONFIG: Record<string, IssueData> = {
    Cancellation: {
        title: 'Order Cancellation',
        icon: Ban,
        cancellationOptions: ['Full', 'Partial'],
        reasons: [
            'Customer requested cancellation',
            'Item out of stock/discontinued',
            'Pricing or listing error',
            'Shipping address deemed undeliverable',
            'Payment authorization failed',
        ],
        guide: [
            'Confirm the Order ID and verify if it has been shipped.',
            'Select Full or Partial Cancellation.',
            'Document the precise reason for the cancellation.',
            'Notify the customer and process the immediate refund/credit.',
            'Update inventory and order status in the backend system.',
        ],
        color: 'red',
    },
    Replacement: {
        title: 'Item Replacement',
        icon: RefreshCw,
        reasons: [
            'Defective or damaged item received',
            'Wrong item/variant delivered (e.g., size, color)',
            'Missing parts/components',
            'Transit damage reported by carrier',
        ],
        guide: [
            'Verify the claim with photo/video evidence from the customer.',
            'Generate a new shipping label for the replacement item.',
            'Dispatch the new item (consider advanced replacement policy).',
            'Track the return of the original item (if required).',
            'Confirm receipt and close the replacement ticket.',
        ],
        color: 'orange',
    },
    Return: {
        title: 'Customer Return',
        icon: Undo2,
        reasons: [
            'Customer changed mind/No longer needed',
            'Quality not as expected',
            'Late delivery',
            'Better price found elsewhere',
        ],
        guide: [
            'Issue a Return Merchandise Authorization (RMA) number.',
            'Provide detailed return shipping instructions (label, address).',
            'Wait for the item to be received and inspected by QC.',
            'Process the refund (minus any restocking fees or shipping) within 2 business days.',
            'Close the RMA ticket and update customer service log.',
        ],
        color: 'blue',
    },
};

// --- 3. REUSABLE COMPONENTS ---

// Card for selecting an issue type (Step 1)
const IssueCard: React.FC<{ type: IssueType; selected: boolean; onSelect: () => void; data: IssueData }> = ({
    type,
    selected,
    onSelect,
    data,
}) => {
    const Icon = data.icon;
    const baseClasses = `p-3 flex items-center space-x-3 rounded-lg shadow-md transition-all duration-200 cursor-pointer border`;
    const selectedClasses = `bg-white border-indigo-500 ring-2 ring-indigo-200`;
    const defaultClasses = `bg-gray-50 border-gray-200 hover:shadow-lg hover:border-gray-300`;

    return (
        <div
            className={`${baseClasses} ${selected ? selectedClasses : defaultClasses}`}
            onClick={onSelect}
        >
            <Icon className={`w-6 h-6 text-${data.color}-500`} />
            <h3 className="font-semibold text-sm text-gray-800">{data.title}</h3>
            {selected && <CheckCircle className="w-5 h-5 text-indigo-500 ml-auto" />}
        </div>
    );
};

// Step indicator component
const StepIndicator: React.FC<{ current: number; total: number; title: string }> = ({ current, total, title }) => (
    <div className="mb-6">
        <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-1">
            <span>Step {current} of {total}</span>
            <span className="text-indigo-600">{title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(current / total) * 100}%` }}
            ></div>
        </div>
    </div>
);


// Step 3: Select Reason (Radio List)
const Step3SelectReason: React.FC<{ state: IssueState; setState: React.Dispatch<React.SetStateAction<IssueState>>; selectedIssueData: IssueData; nextStep: () => void; prevStep: () => void }> = ({ state, setState, selectedIssueData, nextStep, prevStep }) => {

    const handleReasonChange = (reason: string) => {
        setState((prevState) => ({ ...prevState, reason }));
    };

    const handleDetailsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setState((prevState) => ({ ...prevState, details: e.target.value }));
    };

    return (
        <>
            <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                <ListChecks className="w-5 h-5 mr-2 text-indigo-500" />
                Select Primary Reason for {state.issueType}
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {selectedIssueData.reasons.map((reason) => (
                    <div
                        key={reason}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${state.reason === reason ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-gray-200 hover:bg-gray-100'
                            }`}
                        onClick={() => handleReasonChange(reason)}
                    >
                        <input
                            type="radio"
                            name="reason"
                            value={reason}
                            checked={state.reason === reason}
                            onChange={() => handleReasonChange(reason)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <label className="ml-3 text-sm font-medium text-gray-700 flex-1">
                            {reason}
                        </label>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Notes / Specific Details (Optional)
                </label>
                <textarea
                    id="details"
                    name="details"
                    value={state.details}
                    onChange={handleDetailsChange}
                    rows={3}
                    placeholder="Include specific item IDs, customer instructions, or next steps here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900"
                />
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition flex items-center"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!state.reason}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center"
                >
                    Next: Summary & Guide <ChevronRight className="w-5 h-5 ml-1" />
                </button>
            </div>
        </>
    );
};

// Step 4: Summary and Guide
const Step4Summary: React.FC<{ state: IssueState; selectedIssueData: IssueData; handleSubmit: (e: React.FormEvent) => void; isLoading: boolean; prevStep: () => void }> = ({ state, selectedIssueData, handleSubmit, isLoading, prevStep }) => {

    const affectedItems = state.items.filter(item => item.selectedQuantity > 0);

    return (
        <>
            {/* Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-md font-bold text-gray-800 mb-3">Issue Summary</h3>
                <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Order ID:</span> {state.orderId}</p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Issue Type:</span> {selectedIssueData.title} {state.cancellationType ? `(${state.cancellationType})` : ''}</p>
                <p className="text-sm text-gray-700 mb-3"><span className="font-semibold">Reason:</span> {state.reason}</p>

                <h4 className="text-sm font-semibold text-gray-700 mt-2">Affected Items ({affectedItems.length} items):</h4>
                <ul className="text-xs list-disc list-inside ml-2 space-y-0.5">
                    {affectedItems.map(item => (
                        <li key={item.id} className="text-gray-600">{item.name} (Qty: {item.selectedQuantity})</li>
                    ))}
                </ul>

                {state.details && (
                    <p className="text-sm text-gray-700 mt-3"><span className="font-semibold">Notes:</span> {state.details}</p>
                )}
            </div>

            {/* Guide Panel */}
            <div className={`p-4 bg-${selectedIssueData.color}-50 rounded-xl shadow-inner border border-${selectedIssueData.color}-200 mb-6`}>
                <h3 className={`flex items-center text-md font-bold text-${selectedIssueData.color}-700 mb-3`}>
                    <Info className="w-5 h-5 mr-2" />
                    Required Procedure Guide
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    {selectedIssueData.guide.map((step, index) => (
                        <li key={index} className="text-sm leading-relaxed">
                            {step}
                        </li>
                    ))}
                </ol>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition flex items-center"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-1/2 py-3 font-semibold rounded-xl shadow-lg transition duration-300 flex items-center justify-center ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Processing...' : `Confirm & Submit`}
                </button>
            </div>
        </>
    );
};


type Props = {
    onSuccess: () => void,
    user_order_id: number,
    organization: Organization,
    items: UserOrderItem[],
    currency_symbol: string,
    currency_code: string
}

type OrderIssueForm = {
    step: number,
    status?: UserOrderIssueType,
    items: UserOrderItem[],
    universal_category_id?: number,
    remarks?: string,
};

export type OrderIssueDialogProps = {
    form: OrderIssueForm,
    setValue: SetValueType
}

export default function OrderIssueDialog({ onSuccess, user_order_id, organization, items, currency_symbol, currency_code }: Props) {
    const [form, setValue] = useForm<OrderIssueForm>({
        step: 1,
        items: items,
    });
    const [step, setStep] = useState<number>(1);

    const [state, setState] = useState<IssueState>({
        orderId: '',
        issueType: null,
        cancellationType: null,
        reason: '',
        details: '',
        step: 1, // Start at step 1
        items: [
            { id: 'I-101', name: 'Blue T-Shirt, Size L', quantity: 2, selectedQuantity: 0 },
            { id: 'I-102', name: 'Black Denim Jeans', quantity: 1, selectedQuantity: 0 },
            { id: 'I-103', name: 'Running Sneakers, Red', quantity: 1, selectedQuantity: 0 },
        ],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const totalSteps = 4;

    const selectedIssueData = useMemo(() => {
        return state.issueType ? ISSUE_CONFIG[state.issueType] : null;
    }, [state.issueType]);

    const nextStep = () => setState(p => ({ ...p, step: p.step + 1 }));
    const prevStep = () => setState(p => ({ ...p, step: p.step - 1 }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation check
        if (!state.issueType || !state.orderId || !state.reason) {
            alert('Please complete all required fields before submission.');
            return;
        }

        setIsLoading(true);

        // Mock API call delay
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            console.log('Issue Submitted:', state);
        }, 1500);
    };

    const resetForm = () => {
        setState({
            orderId: '',
            issueType: null,
            cancellationType: null,
            reason: '',
            details: '',
            step: 1,
            items: state.items.map(item => ({ ...item, selectedQuantity: 0 })),
        });
        setIsSubmitted(false);
    };

    const renderStepContent = () => {


        switch (form.step) {
            case 1:
                return <OrderIssueDialogStep1 form={form} setValue={setValue} />;
            case 2:
                return <OrderIssueDialogStep2 form={form} setValue={setValue} />;
            case 3:
                return selectedIssueData && <Step3SelectReason state={state} setState={setState} selectedIssueData={selectedIssueData} nextStep={nextStep} prevStep={prevStep} />;
            case 4:
                return selectedIssueData && <Step4Summary state={state} selectedIssueData={selectedIssueData} handleSubmit={handleSubmit} isLoading={isLoading} prevStep={prevStep} />;
            default:
                return <OrderIssueDialogStep1 form={form} setValue={setValue} />;
        }
    };

    // --- JSX STRUCTURE ---

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-2xl text-center border-t-8 border-green-500">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Issue Logged Successfully!</h1>
                    <p className="text-gray-600 mb-6">
                        The {state.issueType} request for Order <span className="font-mono bg-gray-100 p-1 rounded text-sm">{state.orderId}</span> has been created.
                    </p>
                    <button
                        onClick={resetForm}
                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center mx-auto"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Create Another Issue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <ModalBody>
                <StepIndicator
                    current={state.step}
                    total={totalSteps}
                    title={
                        form.step === 1 ? 'Select Issue Type' :
                            form.step === 2 ? 'Select Items & Quantities' :
                                form.step === 3 ? 'Select Reason & Notes' :
                                    'Summary & Submission'
                    }
                />

                {/* Dynamic Step Content */}
                {renderStepContent()}
            </ModalBody>
            <ModalFooter className='justify-between'>
                <div className='flex-1'>
                    {form.step > 1 && <Btn variant={'outline'} onClick={() => setValue('step')(form.step - 1)}><LuArrowLeft /> Back</Btn>}
                </div>
                {form.step == 1 && <Btn disabled={form.status === undefined} onClick={() => setValue('step')(form.step + 1)}>Next - Items Selection<LuArrowRight /></Btn>}
            </ModalFooter>
        </>
    );
}