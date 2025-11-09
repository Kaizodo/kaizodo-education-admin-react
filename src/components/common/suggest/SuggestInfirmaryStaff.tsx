import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { nameLetter } from '@/lib/utils';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { InfirmaryService } from '@/services/InfirmaryService';





export default function SuggestInfirmaryStaff({ children = 'User', value, onChange, user_type, selected, placeholder = 'Select user', onSelect, includedValues, infirmary_id }: SuggestProp & {
    user_type?: UserType,
    infirmary_id?: number,
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
            getOptions={async ({ page, keyword }) => {
                var r = await InfirmaryService.getAssignUser({ page, keyword, infirmary_id});
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
