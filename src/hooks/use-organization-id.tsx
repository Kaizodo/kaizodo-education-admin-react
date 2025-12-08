import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "./use-global-context";
import { Modal, ModalBody } from "@/components/common/Modal";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import CenterLoading from "@/components/common/CenterLoading";
import { useDebounce } from "./use-debounce";
import { useForm } from "./use-form";
import { StoreService } from "@/services/StoreService";
import SafeImage from "@/components/common/SafeImage";
import { LuImage } from "react-icons/lu";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { ContextOrganiation } from "@/data/global";
import { Storage } from "@/lib/storage";

export function useOrganizationId() {
    const { context, setContext } = useGlobalContext();
    const openedOrganizationChoiceRef = useRef<boolean>(false);

    const chooseOrganization = () => {
        if (!openedOrganizationChoiceRef.current) {
            openedOrganizationChoiceRef.current = true;
        } else {
            return;
        }
        const modal_id = Modal.show({
            header: false,
            disabled: true,

            content: () => {
                const [searching, setSearching] = useState(true);
                const [paginated, setPaginated] = useState<PaginationType<ContextOrganiation>>(getDefaultPaginated());
                const [filters, setFilter] = useForm<{
                    debounce?: boolean,
                    page: number,
                    keyword: string
                    is_internal: number
                }>({
                    is_internal: 1,
                    debounce: true,
                    page: 1,
                    keyword: '',
                });


                const debounceSearch = useDebounce(() => {
                    search();
                }, 300, 1);

                const search = async () => {
                    setSearching(true);
                    var r = await StoreService.search(filters);
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

                if (searching) {
                    return <CenterLoading className=" bg-white rounded-lg shadow-xl relative w-full h-[400px]" />
                }

                return <>
                    <ModalBody>

                        <span className="uppercase font-medium text-lg">Select a store</span>
                        {paginated.records.map(record => {

                            return <div
                                key={record.id}
                                className="flex flex-row items-center gap-3 border rounded-lg hover:bg-accent select-none cursor-pointer p-1"
                                onClick={async () => {
                                    await Storage.set<ContextOrganiation>('organization', record);
                                    setContext(c => ({ ...c, organization: record }));
                                    Modal.close(modal_id);
                                }}
                            >
                                <SafeImage src={record.logo_short} className='h-16 w-16 border rounded-lg p-1 items-center justify-center flex'>
                                    <LuImage className='text-3xl text-gray-400' />
                                </SafeImage>
                                <div className='flex flex-col justify-start items-start'>
                                    <span className='font-medium text-sm'>{record.name}</span>
                                    <span className='text-xs text-gray-600 mb-1'>{record.nickname}</span>
                                    {!record.organization_id && <Badge>Main Organization</Badge>}
                                </div>
                            </div>
                        })}
                        {!searching && paginated.records.length == 0 && <NoRecords title="No Stores found" />}
                        <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
                    </ModalBody>
                </>
            }
        })
    }

    useEffect(() => {
        if (!context.organization?.id) {
            chooseOrganization();
        }
    }, [context])
    return context?.organization?.id as number;
}