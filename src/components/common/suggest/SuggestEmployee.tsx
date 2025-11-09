import Dropdown from '../Dropdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { nameLetter } from '@/lib/utils';
import { FaEnvelope, FaPhone, FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { EmployeeService } from '@/services/EmployeeService';


const LazyUserEditorDialog = lazy(() => import('@/pages/users/components/UserEditorDialog'));


export default function SuggestEmployee({ children,
    value,
    onChange,
    selected,
    exclude_ids,
    exclude_manager_subordinates,
    is_manager,
    placeholder,
    onSelect,
    includedValues,
}: SuggestProp & {
    exclude_ids?: number[],
    exclude_manager_subordinates?: number[],
    is_manager?: number
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
                        title: 'Add Driver',
                        maxWidth: 700,
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}>
                            <LazyUserEditorDialog
                                modifier='employee'
                                onSuccess={(data) => {
                                    updateOptions(data);
                                    Modal.close(modal_id);

                                }}
                                onCancel={() => {
                                    Modal.close(modal_id);
                                }} />
                        </Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
            getOptions={async ({ page, keyword }) => {
                var r = await EmployeeService.search({
                    page,
                    keyword,
                    exclude_ids,
                    exclude_manager_subordinates,
                    is_manager
                });
                if (r.success) {
                    return r.data.records.map((record: any) => ({

                        id: record.id,
                        name: `${record.first_name} ${record.last_name}`,
                        ...record, widget: (item: any) => {
                            return <div className='flex flex-row gap-3 items-center'>
                                <Avatar>
                                    <AvatarImage src={item.image} />
                                    <AvatarFallback>{nameLetter(item.first_name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <span>{item.first_name} {item.last_name}</span>
                                    {!!item.mobile && <div className='gap-3 flex flex-row items-center text-sm'><FaPhone /> {item.mobile}</div>}
                                    {!!item.email && <div className='gap-3 flex flex-row items-center text-sm'><FaEnvelope /> {record.email}</div>}
                                </div>
                            </div>
                        }
                    }));
                }
                return [];
            }} >
            {children}
        </Dropdown>
    )
}
