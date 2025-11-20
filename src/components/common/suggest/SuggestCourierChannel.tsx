import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal } from '../Modal';
import { lazy, Suspense } from 'react';
import { SuggestProp } from './Suggest';
import CenterLoading from '../CenterLoading';
import { CourierChannelService } from '@/services/CourierChannelService';
const LazySectionEditorDialog = lazy(() => import('@/pages/product-management/pages/courier-channel/components/CourierChannelEditorDialog'));


export default function SuggestCourierChannel({ children = 'Courier Partner', value, selected, onChange, placeholder = 'Select courier partner', onSelect, includedValues }: SuggestProp & {
    class_id?: number
}) {
    return (
        <Dropdown
            value={value}
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect} getOptions={async ({ page, keyword }) => {
                var r = await CourierChannelService.search({
                    page, keyword
                });
                if (r.success) {
                    return r.data.records;
                }

                return [];
            }}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Courier Partner',
                        content: <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazySectionEditorDialog onCancel={() => {
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
