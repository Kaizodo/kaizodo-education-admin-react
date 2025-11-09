import Btn from '@/components/common/Btn';
import { Progress } from '@/components/ui/progress';
import { OrganizationOnboardingStep } from '@/data/Organization';
import { useGlobalContext } from '@/hooks/use-global-context';
import { useSetValue } from '@/hooks/use-set-value';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react'
import { LuArrowLeft, LuArrowRight, LuCircleCheck } from 'react-icons/lu';
import { RiMenu3Fill } from 'react-icons/ri';
import OrganizationOnboardingStepBasicInformation from './components/OrganizationOnboardingStepBasicInformation';
import { useParams } from 'react-router-dom';

export type OrganizationOnboardingStepsProps = {
    $state: any,
    onLoading?: (loading: boolean) => void,
    registerCallback?: (callback: () => Promise<boolean>) => void
}

export default function OrganizationEditor() {
    const { id } = useParams<{ id: string }>();
    const { context } = useGlobalContext();
    const maxWidth = 600;
    const [state, setState] = useState<any>({});
    const setValue = useSetValue(setState);

    const [loading, setLoading] = useState(false);
    const steps = [
        "Basic Details",
        "Contact Details",
        "Subscription Plan",
        "Social Media & Contacts",
        "Domain Setup",
        "Panel Setup",
        "Academic Setup",
        "Infrastructure Details",
        "Admin & Staff Setup",
        "Upload Documents",
        "Confirm Submition",
        "Track Application"
    ];
    const saveCallbackRef = useRef<() => Promise<boolean>>(async () => false);
    const [menuOpen, setMenuOpen] = useState(window.innerWidth > maxWidth);
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);

    const handleSaveAndNext = async () => {
        if (!saveCallbackRef.current) {
            return;
        }
        if (state.is_confirmed) {
            setCurrentStep(c => c + 1);
            return;
        }
        setSaving(true);
        var success = await saveCallbackRef.current();
        if (success) {
            setCurrentStep(c => c + 1);
        }
        setSaving(false);
    }


    return (<div className="px-0 sm:px-4  mx-auto    flex flex-row relative gap-2" style={{
        height: window.innerHeight - 70
    }}>
        {menuOpen && window.innerWidth < maxWidth && <div className="fixed w-full h-full bg-black bg-opacity-55 z-20" onClick={() => setMenuOpen(false)}></div>}
        <div className={cn(
            "transition-all w-[250px] h-full bg-white border-e border-s fixed left-[-250px] md:relative md:left-0 z-30",
            menuOpen ? "left-[0px] md:relative md:left-0 shadow-lg" : "left-[-250px] md:relative md:left-0 md:overflow-hidden md:w-[0px] md:border-none md:opacity-0"
        )
        }>
            {steps.map((step, step_index) => <div
                onClick={() => {
                    setCurrentStep(step_index + 1);
                    if (window.innerWidth < maxWidth) {
                        setMenuOpen(false);
                    }
                }}
                className={
                    cn(
                        "font-semibold border-b p-2 text-sm   gap-2 flex items-center group hover:bg-blue-50 cursor-pointer select-none border-e-2 border-e-transparent",
                        (step_index + 1) == currentStep && "bg-blue-100 border-e-2 border-e-blue-500 hover:bg-blue-100"
                    )
                }>
                <span className={cn(
                    "h-6 w-6 text-xs bg-gray-200 rounded-full shrink-0 grow-0 text-primary flex items-center  justify-center",
                    (step_index + 1) == currentStep && "bg-primary text-primary-foreground"
                )}>{step_index + 1}</span>
                <span className="flex flex-row flex-1">{step}</span>
                {!!state.is_confirmed && (step_index + 1) !== OrganizationOnboardingStep.TrackApplication && <LuCircleCheck className="text-green-600" />}
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

                {currentStep == OrganizationOnboardingStep.BasicDetails && <OrganizationOnboardingStepBasicInformation $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}

                {/* {currentStep == OrganizationOnboardingStep.AdditionalInformation && <OrganizationOnboardingStepAdditionalInformation $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.Qualifications && <OrganizationOnboardingStepQualifications $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.AchievementsAndMeritDetails && <OrganizationOnboardingStepAchievements $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.SiblingDetails && <OrganizationOnboardingStepSiblingDetail $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.Address && <OrganizationOnboardingStepAddress $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.ParentDetails && <OrganizationOnboardingStepParentInformation $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.MedicalDetails && <OrganizationOnboardingStepMedicalInformation $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.UploadDocuments && <OrganizationOnboardingStepDocuments $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.ConfirmSubmition && <OrganizationOnboardingStepConfirmSubmition
                    is_confirmed={state.is_confirmed}
                    onConfirm={() => {
                        setState((s: any) => ({ ...s, is_confirmed: true }));
                    }} $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                {currentStep == OrganizationOnboardingStep.TrackApplication && <OrganizationOnboardingStepTrackApplication $state={state} registerCallback={fn => saveCallbackRef.current = fn} onLoading={setLoading} />}
                
 */}


            </div>
            {currentStep !== OrganizationOnboardingStep.TrackApplication && <div className="bg-blue-500 p-2 border-t flex flex-row items-center justify-between gap-3">
                {currentStep > 1 && <>
                    <Btn
                        onClick={() => setCurrentStep(c => c - 1)}
                        size="sm" variant={'ghost'} className="text-white" disabled={saving}><LuArrowLeft />Back</Btn>
                    <div className="max-w-2xl flex-1">
                        <Progress
                            value={context.organization_onboarding_progress ?? 0}
                            className="h-1"
                        />
                    </div>
                </>}
                {currentStep <= 1 && <div className="flex-1"></div>}
                <Btn size="sm" onClick={handleSaveAndNext} loading={saving} disabled={saving || loading}>{!state.is_confirmed && 'Save & '}Next <LuArrowRight /></Btn>
            </div>}
        </div>
    </div>)
}
