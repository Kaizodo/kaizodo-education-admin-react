import { BoardingType, getUserTypeName, User, UserType } from "@/data/user"
import { Modal, ModalBody, ModalFooter } from "./Modal";
import Btn from "./Btn";
import { useEffect, useState } from "react";
import CenterLoading from "./CenterLoading";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NoRecords from "./NoRecords";
import Pagination from "./Pagination";
import { useSetValue } from "@/hooks/use-set-value";
import { cn, nameLetter } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "../ui/search";
import { Badge } from "../ui/badge";
import { LuArrowRight } from "react-icons/lu";
import { EmployeeService } from "@/services/EmployeeService";

type Props = {
    title: string,
    subtitle: string,
    exclude_ids?: number[],
    user_type?: UserType,
    user_types?: UserType[],
    class_id?: number,
    section_id?: number,
    boarding_type?: BoardingType,
    has_onboarding?: number,
    has_offboarding?: number,
    interview_round_id?: number,
}




export async function pickMultipleUsers({
    title,
    subtitle, ...rest }: Props & {
        title: string,
        subtitle: string
    }): Promise<User[]> {
    return new Promise((resolve) => {
        const modal_id = Modal.show({
            title,
            subtitle,
            maxWidth: 500,
            content: () => {
                const [paginated, setPaginated] = useState<PaginationType<User>>(getDefaultPaginated());
                const [searching, setSearching] = useState(true);
                const [filters, setFilters] = useState<any>({ ...rest, page: 1, keyword: '' });
                const setFilter = useSetValue(setFilters);
                const [selected, setSelected] = useState<User[]>([]);
                const search = async () => {
                    setSearching(true);
                    var r = await EmployeeService.search(filters);
                    if (r.success) {
                        setPaginated(r.data);
                    }
                    setSearching(false);
                }


                const debounceSearch = useDebounce(() => {
                    search();
                }, 300);



                useEffect(() => {
                    if (filters.debounce) {
                        debounceSearch();
                    } else {
                        search();
                    }

                }, [filters]);

                return (<>
                    <div className="p-2 bg-white border-b">
                        <Search placeholder="Name, Email, Code..." value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
                    </div>
                    <ModalBody className="max-h-[60vh] gap-1">
                        {searching && <CenterLoading className="relative h-[300px]" />}
                        {!searching && paginated.records.map(record => {
                            var isSelected = !!selected.find(u => u.id == record.id);
                            return (<label key={record.id} className={
                                cn(
                                    "flex flex-row items-center gap-3 border bg-white rounded-lg p-2 hover:bg-sky-50 hover:border-sky-100",
                                    isSelected && "bg-sky-50 border-sky-300 border"
                                )
                            }>
                                <Checkbox checked={isSelected} onCheckedChange={checked => checked ? setSelected(s => [...s, record]) : setSelected(s => s.filter(s => s.id !== record.id))} />
                                <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-3">
                                        <AvatarImage src={record.image} />
                                        <AvatarFallback>
                                            {nameLetter(record.first_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>

                                        <span className="text-xs text-gray-500">{record.designation_name ?? getUserTypeName(record.user_type)}</span>
                                        <span className="text-sm text-gray-500">Emp Id : {record.code}</span>

                                    </div>
                                </div>

                            </label>);
                        }

                        )}
                        {!searching && paginated.records.length == 0 && <NoRecords />}

                    </ModalBody>
                    <Pagination showCount={false} className="p-3 border-t" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
                    <ModalFooter className="flex flex-row items-center justify-between">
                        <span className="text-xs">Selected <Badge> {selected.length}</Badge></span>
                        <Btn size={'sm'} onClick={() => {
                            Modal.close(modal_id);
                            resolve(selected);
                        }}>Select <LuArrowRight /></Btn>
                    </ModalFooter>
                </>);
            }
        })
    });
}



