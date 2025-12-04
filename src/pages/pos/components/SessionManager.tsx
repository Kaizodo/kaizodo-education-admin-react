import { useGlobalContext } from '@/hooks/use-global-context';
import { msg } from '@/lib/msg';
import { formatDateTime } from '@/lib/utils';
import { PosService } from '@/services/PosService';
import React, { useState, useCallback } from 'react';
import { LuLoader } from 'react-icons/lu';

// Define types for better TypeScript safety
type ShiftStage = 'opening' | 'shift' | 'closing' | 'summary';

interface ShiftData {
    openTime: string | null;
    openingBalance: number | null;
    openingRemarks: string;
    closeTime: string | null;
    closingBalance: number | null;
    closingRemarks: string;
}



interface InputProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: 'text' | 'number';
    placeholder?: string;
    isTextArea?: boolean;
    disabled?: boolean; // Added disabled prop
}

const FormInput: React.FC<InputProps> = ({ label, id, value, onChange, type = 'text', placeholder, isTextArea = false, disabled = false }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isTextArea ? (
            <textarea
                id={id}
                rows={3}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled} // Apply disabled state
                className={`w-full p-3 border rounded-lg shadow-sm transition duration-150 ${disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
            />
        ) : (
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled} // Apply disabled state
                className={`w-full p-3 border rounded-lg shadow-sm transition duration-150 ${disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
            />
        )}
    </div>
);




// --- Main App Component ---

export default function SessionManager() {
    const { context, setContext } = useGlobalContext();
    const [currentStage, setCurrentStage] = useState<ShiftStage>(!context.pos_session ? 'opening' : 'shift');
    const [shiftData, setShiftData] = useState<ShiftData>({
        openTime: formatDateTime(context.pos_session?.created_at ?? ''),
        openingBalance: context.pos_session?.opening_balance ?? 0,
        openingRemarks: context.pos_session?.opening_remarks ?? '',
        closeTime: null,
        closingBalance: null,
        closingRemarks: '',
    });

    // State for Loading Animations
    const [isOpeningLoading, setIsOpeningLoading] = useState(false);
    const [isClosingLoading, setIsClosingLoading] = useState(false);

    // State for Opening Form
    const [openBalanceInput, setOpenBalanceInput] = useState('');
    const [openRemarksInput, setOpenRemarksInput] = useState('');
    const [openError, setOpenError] = useState('');

    // State for Closing Form
    const [closeBalanceInput, setCloseBalanceInput] = useState('');
    const [closeRemarksInput, setCloseRemarksInput] = useState('');
    const [closeError, setCloseError] = useState('');

    // Handle Opening Shift
    const handleStartShift = useCallback(async () => {
        const balance = parseFloat(openBalanceInput.replace(/[^0-9.]/g, ''));

        if (isNaN(balance) || balance < 0) {
            setOpenError('Please enter a valid opening cash balance.');
            return;
        }

        // 1. Start loading animation and disable inputs
        setIsOpeningLoading(true);

        var r = await PosService.startSession({
            opening_balance: balance,
            opening_remarks: openRemarksInput.trim()
        });

        if (r.success) {
            msg.success('Session started!');
            setContext(c => ({ ...c, pos_session: r.data }));
        } else {
            setIsOpeningLoading(false);
        }



    }, [openBalanceInput, openRemarksInput, shiftData]);

    // Handle Closing Shift
    const handleCloseShift = useCallback(async () => {
        const balance = parseFloat(closeBalanceInput.replace(/[^0-9.]/g, ''));

        if (isNaN(balance) || balance < 0) {
            setCloseError('Please enter a valid closing cash balance.');
            return;
        }

        // 1. Start loading animation and disable inputs
        setIsClosingLoading(true);

        var r = await PosService.closeSession({
            closing_balance: balance,
            closing_remarks: closeRemarksInput.trim()
        });

        if (r.success) {
            msg.success('Session closed!');
            setContext(c => ({ ...c, pos_session: undefined }));
        } else {
            setIsClosingLoading(false);
        }


    }, [closeBalanceInput, closeRemarksInput]);

    // Handle Reset (for demonstration purposes)
    const handleReset = useCallback(() => {
        setCurrentStage('opening');
        setShiftData({
            openTime: null,
            openingBalance: null,
            openingRemarks: '',
            closeTime: null,
            closingBalance: null,
            closingRemarks: '',
        });
        setOpenBalanceInput('');
        setOpenRemarksInput('');
        setCloseBalanceInput('');
        setCloseRemarksInput('');
    }, []);

    // --- Render Functions ---

    const renderOpeningForm = () => (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl transition-all w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-b pb-2">
                Open Shift
            </h2>
            <FormInput
                label="Opening Cash Balance (USD)"
                id="openingBalance"
                type="number"
                value={openBalanceInput}
                onChange={(e) => { setOpenBalanceInput(e.target.value); setOpenError(''); }}
                placeholder="e.g., 200.00"
                disabled={isOpeningLoading}
            />
            <FormInput
                label="Opening Remarks / Notes"
                id="openingRemarks"
                value={openRemarksInput}
                onChange={(e) => setOpenRemarksInput(e.target.value)}
                isTextArea
                placeholder="Any initial issues, large bills, etc."
                disabled={isOpeningLoading}
            />
            {openError && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded-lg border border-red-200">
                    {openError}
                </p>
            )}
            <button
                onClick={handleStartShift}
                disabled={isOpeningLoading}
                className={`w-full py-3 mt-4 text-white font-bold rounded-xl shadow-lg transition duration-200 transform focus:outline-none focus:ring-4 flex items-center justify-center ${isOpeningLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] focus:ring-blue-300'
                    }`}
            >
                {isOpeningLoading ? (
                    <>
                        <LuLoader className="animate-spin" />
                        Starting Shift...
                    </>
                ) : (
                    'Start Shift'
                )}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
                User ID: Static Demo User
            </p>
        </div>
    );

    const renderShiftInProgress = () => (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl transition-all w-full max-w-md text-center">
            <h2 className="text-3xl font-extrabold text-green-700 mb-4">
                Shift in Progress
            </h2>
            <p className="text-gray-600 mb-6">
                The shift started at: <br />
                <span className="font-semibold text-lg text-gray-800">
                    {shiftData.openTime?.toLocaleString() || 'N/A'}
                </span>
            </p>
            <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500">Opening Balance</p>
                <p className="text-2xl font-bold text-green-600 mb-4">
                    {context.settings?.currency_symbol}{shiftData.openingBalance}
                </p>
            </div>

            <button
                onClick={() => setCurrentStage('closing')}
                className="w-full py-3 mt-6 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-red-300"
            >
                End Shift & Start Closing
            </button>
        </div>
    );

    const renderClosingForm = () => (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl transition-all w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-red-700 mb-6 border-b pb-2">
                Close Shift
            </h2>
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-gray-700">Starting Balance</p>
                <p className="text-xl font-bold text-green-700">
                    {context.settings?.currency_symbol}{shiftData.openingBalance}
                </p>
            </div>

            <FormInput
                label="Closing Cash Balance (USD)"
                id="closingBalance"
                type="number"
                value={closeBalanceInput}
                onChange={(e) => { setCloseBalanceInput(e.target.value); setCloseError(''); }}
                placeholder="Counted cash amount"
                disabled={isClosingLoading}
            />
            <FormInput
                label="Closing Remarks / Notes"
                id="closingRemarks"
                value={closeRemarksInput}
                onChange={(e) => setCloseRemarksInput(e.target.value)}
                isTextArea
                placeholder="Any discrepancies, large refunds, specific events."
                disabled={isClosingLoading}
            />
            {closeError && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded-lg border border-red-200">
                    {closeError}
                </p>
            )}
            <button
                onClick={handleCloseShift}
                disabled={isClosingLoading}
                className={`w-full py-3 mt-4 text-white font-bold rounded-xl shadow-lg transition duration-200 transform focus:outline-none focus:ring-4 flex items-center justify-center ${isClosingLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-[1.01] active:scale-[0.99] focus:ring-green-300'
                    }`}
            >
                {isClosingLoading ? (
                    <>
                        <LuLoader className="animate-spin" />
                        Submitting Report...
                    </>
                ) : (
                    'Submit Closing Report'
                )}
            </button>
        </div>
    );




    const renderContent = () => {
        switch (currentStage) {
            case 'opening':
                return renderOpeningForm();
            case 'shift':
                return renderShiftInProgress();
            case 'closing':
                return renderClosingForm();
            default:
                return (
                    <div className="text-center p-8">
                        <p className="text-xl text-red-500">Something went wrong.</p>
                        <button onClick={handleReset} className="mt-4 text-blue-500">
                            Reset
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {renderContent()}
        </div>
    );
};

