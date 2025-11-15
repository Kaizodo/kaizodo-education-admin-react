import { SubscriptionPlanEditorState } from '../SubscriptionPlanEditor'
import Richtext from '@/components/common/Richtext'

export default function TermsTab({ state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) {
    return (
        <div className='space-y-3 border bg-sky-50 p-3 rounded-lg'>
            <div>
                <span className='font-bold text-xl'>Tems & NDA</span>
            </div>
            <Richtext value={state.nda} onChange={setValue('nda')}>Written NDA</Richtext>
            <Richtext value={state.tnc} onChange={setValue('tnc')}>Terms & Conditions</Richtext>
        </div>
    )
}
