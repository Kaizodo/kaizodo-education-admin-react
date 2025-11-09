import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';

import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { OfferDeclineReasonService } from '@/services/OfferDeclineReasonService';
import { CampaignType } from '@/data/campaign';
const LazyEditorDalog = lazy(() => import('@/pages/offer-decline-reason/components/OfferDeclineReasonEditorDialog'));



export default function SuggestOfferDeclineReason({ children = 'Offer decline reason', campaign_type, value, selected, onChange, placeholder = 'Select a reason', onSelect, includedValues }: SuggestProp & {
    campaign_type: CampaignType
}) {
    return (
        <Dropdown
            searchable={true}
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await OfferDeclineReasonService.search({
                    page, keyword, campaign_type
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'New Offer Decline Reason',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDalog onCancel={() => {
                            Modal.close(modal_id);
                        }} onSuccess={(options) => {
                            updateOptions(options);
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
        >
            {children}
        </Dropdown>
    )
}
