
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { EmployeeService } from '@/services/EmployeeService';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { User } from '@/data/user';
import { useDebounce } from '@/hooks/use-debounce';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { LuMail, LuPhone, LuUserPlus, LuUserX } from 'react-icons/lu';
import SuggestEmployee from '@/components/common/suggest/SuggestEmployee';
import { Search } from '@/components/ui/search';
import { msg } from '@/lib/msg';
import { nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Props {
    id: number
}

export default function EmployeeSubordinateEditorDialog({ id }: Props) {
    const [assigining, setAssigining] = useState(false);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);

    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<User>>(getDefaultPaginated());
    const [filters, setFilters] = useState<any>({
        debounce: true,
        page: 1,
        keyword: '',
        user_id: id
    });
    const setFilter = useSetValue(setFilters);



    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await EmployeeService.searchSubordinates(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);

    const assign = async () => {
        setAssigining(true);
        var r = await EmployeeService.addSubordinate({
            subordinate_user_id: form.subordinate_user_id,
            user_id: id
        });

        if (r.success) {
            msg.success('Subordindate assigned');
            search();
            setValue('subordinate_user_id')(undefined);
        }
        setAssigining(false);
    }




    return (
        <>
            <ModalBody className='relative'>
                <div className='flex items-end gap-3 bg-white border shadow-sm rounded-lg p-2'>
                    <div className='flex-1'>
                        <SuggestEmployee
                            value={form.subordinate_user_id}
                            onChange={setValue('subordinate_user_id')}
                            placeholder='Select a subordindate'
                            is_manager={0}
                            exclude_manager_subordinates={[id]}
                        >Select Subordindate</SuggestEmployee>
                    </div>
                    <Btn disabled={!form.subordinate_user_id} onClick={assign} loading={assigining}><LuUserPlus />Assign</Btn>
                </div>
                <div>
                    <Search placeholder='Search subordindates' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
                </div>
                {!!searching && <CenterLoading className='relative h-[400px]' />}
                {!searching && paginated.records.map((record) => (<div
                    key={record.id}
                    className="flex items-center bg-white border rounded-lg py-1 px-2">
                    <Avatar className="h-16 w-16 mr-3">
                        <AvatarImage src={record.image} />
                        <AvatarFallback>
                            {nameLetter(record.first_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                        <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                        <div className="flex flex-col gap-1 text-sm">
                            {!!record.email && <div className="text-xs text-gray-500 flex flex-row items-center gap-2"><LuMail />{record.email}</div>}
                            {!!record.mobile && <div className="text-xs text-gray-500 flex flex-row items-center gap-2"><LuPhone />{record.mobile}</div>}
                        </div>
                    </div>
                    <Btn size={'xs'} variant={'destructive'} onClick={() => {
                        msg.confirm('Remove ' + record.first_name + ' ' + record.last_name, 'Removing a subordindate may effect various features.', {
                            onConfirm: async () => {
                                var r = await EmployeeService.removeSubordinate({
                                    subordinate_user_id: record.id,
                                    user_id: id
                                });
                                if (r.success) {
                                    msg.success('Subordindate removed');
                                    search();
                                }
                                return r.success;
                            }
                        })
                    }}><LuUserX /> Remove</Btn>
                </div>))}
                {!searching && paginated.records.length == 0 && <NoRecords title='No Subordinates Yet' subtitle='Try assigning some surborindates or adjusting some filters' />}

            </ModalBody>
            {paginated.pages > 1 && <ModalFooter>
                <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
            </ModalFooter>}

        </>
    );
};

