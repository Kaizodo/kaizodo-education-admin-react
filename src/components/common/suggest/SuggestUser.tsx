import { BoardingType, UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { UserService } from '@/services/UserService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { nameLetter } from '@/lib/utils';
import { FaEnvelope, FaPhone, FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';


const LazyUserEditorDialog = lazy(() => import('@/pages/users/components/UserEditorDialog'));


export default function SuggestUser({ children,
    value,
    onChange,
    user_type,
    user_types,
    class_id,
    section_id,
    selected,
    exclude_ids,
    placeholder,
    onSelect,
    includedValues,
    boarding_type,
    has_onboarding,
    has_offboarding
}: SuggestProp & {
    exclude_ids?: number[],
    user_type?: UserType,
    user_types?: UserType[],
    class_id?: number,
    section_id?: number,
    boarding_type?: BoardingType,
    has_onboarding?: number,
    has_offboarding?: number
}) {
    var auto_placeholder = placeholder;
    var auto_children = children;

    if (user_type !== undefined) {
        switch (user_type) {
            case UserType.Admin:
                auto_placeholder = 'Select administrator';
                auto_children = 'Administrator';
                break;
            case UserType.Employee:
                auto_placeholder = 'Select employee';
                auto_children = 'Employee';
                break;
            case UserType.Teacher:
                auto_placeholder = 'Select teacher';
                auto_children = 'Teacher';
                break;
            case UserType.Student:
                auto_placeholder = 'Select student';
                auto_children = 'Student';
                break;
            case UserType.Parent:
                auto_placeholder = 'Select parent';
                auto_children = 'Parent';
                break;
            case UserType.Driver:
                auto_placeholder = 'Select driver';
                auto_children = 'Driver';
                break;
            case UserType.User:
            default:
                auto_placeholder = 'Select user';
                auto_children = 'User';
                break;
        }
    }

    if (!placeholder) {
        placeholder = auto_placeholder;
    }

    if (!children) {
        children = auto_children;
    }

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
                var r = await UserService.search({
                    page,
                    keyword,
                    user_type,
                    user_types,
                    class_id,
                    section_id,
                    boarding_type,
                    has_onboarding,
                    has_offboarding,
                    exclude_ids
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
