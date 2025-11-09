import TextField from '@/components/common/TextField'
import { SubscriptionPlanEditorState } from '../SubscriptionPlanEditor'
import Radio from '@/components/common/Radio'
import { YesNoArray } from '@/data/Common'
import Richtext from '@/components/common/Richtext'

export const ReferralTab = ({ state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) => {
    return (
        <>
            <div className='flex flex-col max-w-sm gap-3 mb-3'>
                <Radio value={state.has_referral} onChange={setValue('has_referral')} options={YesNoArray}>Avaiable for referral ?</Radio>
                {!!state.has_referral && <>
                    <TextField type='number' value={state.commission_percentage} onChange={setValue('commission_percentage')} placeholder='Enter %'>Commission Percentage / Referral</TextField>
                    <Radio value={state.has_commission_on_renewal} onChange={setValue('has_commission_on_renewal')} options={YesNoArray}>Give commision on renewal ?</Radio>
                    {!!state.has_commission_on_renewal && <TextField type='number' value={state.renewal_commission_percentage} onChange={setValue('renewal_commission_percentage')} placeholder='Enter %'>Renewal Commission Percentage</TextField>}
                </>}
            </div>
            {!!state.has_referral && <Richtext value={state.referral_content} onChange={setValue('referral_content')} placeholder='Enter instrucitons and terms'>Instructions & Terms</Richtext>}

        </>
    )
}
