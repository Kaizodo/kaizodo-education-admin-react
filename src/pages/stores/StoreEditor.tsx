import Btn from '@/components/common/Btn';
import { StoreOnboardingStep } from '@/data/Organization';
import { useSetValue } from '@/hooks/use-set-value';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuArrowRight, LuCircleCheck, LuImage } from 'react-icons/lu';
import { RiMenu3Fill } from 'react-icons/ri';
import StoreOnboardingStepBasicInformation from './components/StoreOnboardingStepBasicInformation';
import { useParams } from 'react-router-dom';
import StoreOnboardingStepBillingInformation from './components/StoreOnboardingStepBillingInformation';
import StoreOnboardingStepProductCategories from './components/StoreOnboardingStepProductCategories';
import StoreOnboardingStepEmployees from './components/StoreOnboardingStepEmployees';
import StoreOnboardingStepDomain from './components/StoreOnboardingStepDomain';
import { useLocation } from 'react-router-dom';
import StoreOnboardingStepConfirmation from './components/StoreOnboardingStepConfirmation';
import StoreOnboardingStepSettings from './components/StoreOnboardingStepSettings';
import StoreOnboardingStepNavigation from './components/StoreOnboardingStepNavigation';
import SafeImage from '@/components/common/SafeImage';

export type OrganizationOnboardingStepsProps = {
    $state: any,
    onLoading?: (loading: boolean) => void,
    registerCallback?: (callback: () => Promise<boolean>) => void,
    onUpdate?: (data: any) => void
}

export default function StoreEditor() {
    const params = useParams<{ id: string }>();
    const [id, setId] = useState<number>(Number(params?.id ?? 0));
    const maxWidth = 600;
    const [state, setState] = useState<any>({});
    const setValue = useSetValue(setState);
    const loc = useLocation();
    const [form, setForm] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const steps = [
        "Basic Details",
        "Billing Details",
        "Product Categories",
        "Employees",
        "Domain",
        "Settings",
        "Navigation",
        "Confirm Submition"
    ];
    const saveCallbackRef = useRef<() => Promise<boolean>>(async () => false);
    const [menuOpen, setMenuOpen] = useState(window.innerWidth > maxWidth);
    const [currentStep, setCurrentStep] = useState(loc.state ? 2 : 1);
    const [saving, setSaving] = useState(false);

    const handleSaveAndNext = async () => {
        if (!saveCallbackRef.current) {
            return;
        }

        setSaving(true);
        var success = await saveCallbackRef.current();
        if (success) {
            if (currentStep !== StoreOnboardingStep.ConfirmSubmition) {
                setCurrentStep(c => c + 1);
            }

        }
        setSaving(false);
    }

    useEffect(() => {
        if (params?.id) {
            setId(Number(params.id))
        }

    }, [params])

    return (<div className="px-0 sm:px-4  mx-auto    flex flex-row relative gap-2" style={{
        height: window.innerHeight - 70
    }}>
        {menuOpen && window.innerWidth < maxWidth && <div className="fixed w-full h-full bg-black bg-opacity-55 z-20" onClick={() => setMenuOpen(false)}></div>}
        <div className={cn(
            "transition-all w-[250px] h-full bg-white border-e border-s fixed left-[-250px] md:relative md:left-0 z-30",
            menuOpen ? "left-[0px] md:relative md:left-0 shadow-lg" : "left-[-250px] md:relative md:left-0 md:overflow-hidden md:w-[0px] md:border-none md:opacity-0"
        )
        }>
            <div className='flex flex-col border-b  py-3 justify-center items-center'>

                <SafeImage src={form.logo_short} className='w-10  flex justify-center items-center text-gray-600 text-3xl'>
                    <LuImage />
                </SafeImage>
                <span className='font-medium text-center'>{form.name}</span>
                <span className='text-xs italic text-center'>{form.nickname}</span>
            </div>
            {steps.map((step, step_index) => <div
                onClick={() => {
                    if (!id) {
                        return;
                    }
                    setCurrentStep(step_index + 1);
                    if (window.innerWidth < maxWidth) {
                        setMenuOpen(false);
                    }
                }}
                className={
                    cn(
                        "font-semibold border-b p-2 text-sm   gap-2 flex items-center group hover:bg-blue-50 cursor-pointer select-none border-e-2 border-e-transparent",
                        (step_index + 1) == currentStep && "bg-blue-100 border-e-2 border-e-blue-500 hover:bg-blue-100",
                        !id && step_index > 0 && "bg-accent hover:bg-accent cursor-not-allowed"
                    )
                }>
                <span className={cn(
                    "h-6 w-6 text-xs bg-gray-200 rounded-full shrink-0 grow-0 text-primary flex items-center  justify-center",
                    (step_index + 1) == currentStep && "bg-primary text-primary-foreground"
                )}>{step_index + 1}</span>
                <span className="flex flex-row flex-1">{step}</span>
                {!!state.is_confirmed && (step_index + 1) !== StoreOnboardingStep.ConfirmSubmition && <LuCircleCheck className="text-green-600" />}
            </div>)}
        </div>

        <div className="flex-1 h-full max-h-full flex flex-col min-h-0 sm:min-h-full">
            <div className="bg-blue-500 flex flex-row items-center gap-3  font-medium p-2">
                <Btn
                    onClick={() => setMenuOpen(!menuOpen)}
                    variant={window.innerWidth < maxWidth ? 'outline' : 'ghost'} size={'sm'} className="text-primary sm:text-white">
                    <RiMenu3Fill />
                    {window.innerWidth < maxWidth ? 'Steps' : ''}
                </Btn>
                <span className="text-white text-sm">{steps[currentStep - 1] ?? 'Step'}</span>
            </div>
            <div className="max-h-full overflow-y-auto flex-1 bg-white">

                {currentStep == StoreOnboardingStep.BasicDetails && <StoreOnboardingStepBasicInformation
                    $state={state}
                    registerCallback={fn => saveCallbackRef.current = fn}
                    onLoading={setLoading}
                    onCreate={i => setId(i)}
                    onUpdate={setForm}
                />}
                {currentStep == StoreOnboardingStep.BillingInformation && <StoreOnboardingStepBillingInformation $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == StoreOnboardingStep.ProductCategories && <StoreOnboardingStepProductCategories $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == StoreOnboardingStep.Employees && <StoreOnboardingStepEmployees $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == StoreOnboardingStep.Domain && <StoreOnboardingStepDomain $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == StoreOnboardingStep.Settings && <StoreOnboardingStepSettings $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == StoreOnboardingStep.Navigation && <StoreOnboardingStepNavigation $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}

                {currentStep == StoreOnboardingStep.ConfirmSubmition && <StoreOnboardingStepConfirmation
                    $state={state}
                    registerCallback={fn => saveCallbackRef.current = fn}
                    onLoading={setLoading}
                    onPublish={setValue('publish')}
                />}




            </div>
            <div className="bg-blue-500 p-2 border-t flex flex-row items-center justify-between gap-3">
                {currentStep > 1 && <>
                    <Btn
                        onClick={() => setCurrentStep(c => c - 1)}
                        size="sm" variant={'ghost'} className="text-white" disabled={saving}><LuArrowLeft />Back</Btn>
                </>}
                {currentStep <= 1 && <div className="flex-1"></div>}
                <Btn size="sm" onClick={handleSaveAndNext} loading={saving} disabled={saving || loading}>
                    {currentStep !== StoreOnboardingStep.ConfirmSubmition && 'Save & Next'}
                    {currentStep == StoreOnboardingStep.ConfirmSubmition && 'Save Status'}
                    {currentStep !== StoreOnboardingStep.ConfirmSubmition && <LuArrowRight />}
                </Btn>
            </div>
        </div>
    </div>)
}
