import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { VisitorService } from '@/services/VisitorService';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { nameLetter } from '@/lib/utils';

const LazyEditorDialog = lazy(() => import('@/pages/visitors/components/VisitorRegistrationForm'));


export default function SuggestVisitor({ children = 'Select Visitor', value, onChange, selected, placeholder = 'Select Visitor', onSelect, includedValues }: SuggestProp & {
    user_type?: UserType
}) {
    return (
        <Dropdown
            searchable={true}
            selected={selected}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Create Visitor',
                        maxWidth: 700,
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyEditorDialog onSuccess={(data) => {
                            updateOptions(data);
                            Modal.close(modal_id);

                        }} onCancel={() => {
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
            getOptions={async ({ page, keyword }) => {
                const res = await VisitorService.search({ page, keyword });

                if (res.success) {
                    return res.data.records.map((record: any) => {
                        return {
                            id: record.id,
                            name: record.name,
                            ...record,
                            widget: (item: any) => (
                                <div className="flex flex-row gap-3 items-center">
                                    <Avatar>
                                        <AvatarImage src={item?.pass?.[0]?.student_image} />
                                        <AvatarFallback>{nameLetter(item.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className='flex gap-2'>

                                            {!!item.phone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FaPhone className="text-xs" />
                                                    {item.phone}
                                                </div>
                                            )}

                                            {!!item.email && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FaEnvelope className="text-xs" />
                                                    {item.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ),
                        };
                    });
                }

                return [];
            }}>
            {children}
        </Dropdown>
    )
}
