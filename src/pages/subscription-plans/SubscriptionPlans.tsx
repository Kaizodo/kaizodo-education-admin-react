import AppPage from "@/components/app/AppPage";
import { useEffect, useState } from "react";
import Btn from "@/components/common/Btn";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { getDefaultPaginated } from "@/data/pagination";
import { SubscriptionPlanService } from "@/services/SubscriptionPlanService";
import { useSetValue } from "@/hooks/use-set-value";
import Pagination from "@/components/common/Pagination";
import CenterLoading from "@/components/common/CenterLoading";
import NoRecords from "@/components/common/NoRecords";

import { SubscriptionPlanThumbnail } from "./components/SubscriptionPlanThumbnail";
import TextField from "@/components/common/TextField";
import Dropdown from "@/components/common/Dropdown";


export default function SubscriptionPlans() {
    const navigate = useNavigate();
    const [searching, setSearching] = useState(false);
    const [paginated, setPaginated] = useState<any>(getDefaultPaginated());
    const [filters, setFilters] = useState<any>({
        page: 1,
        keyword: '',
        custom: 0
    });
    const setFilter = useSetValue(setFilters);
    const search = async () => {
        setSearching(true);
        var r = await SubscriptionPlanService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {
        search();
    }, [filters]);

    return (
        <AppPage
            title="Subscription Plans"
            subtitle="Manage predefined subscription plans for your organization"
            actions={<Btn onClick={() => navigate('/subscription-plans/create')}><LuPlus />Create New Plan</Btn>}
        >
            <div className="bg-white rounded-lg p-2 shadow-lg mb-6 grid grid-cols-5 gap-3">
                <TextField value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v, true)} placeholder="Search by name ">Search</TextField>
                <Dropdown searchable={false} value={filters.custom} onChange={setFilter('custom', 'debounce')} placeholder="Select plan type" getOptions={async () => {
                    return [
                        { id: 0, name: 'Standard Plan' },
                        { id: 1, name: 'Custom Plan' }
                    ]
                }}>Plan Type</Dropdown>
            </div>
            {searching && <CenterLoading className="relative h-[400px]" />}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {!searching && paginated.records.map((record: any, index: number) => {
                    return <SubscriptionPlanThumbnail record={record} index={index} key={record.id} />
                })}
            </div>

            {!searching && paginated.records.length == 0 && <NoRecords />}
            <Pagination paginated={paginated} onChange={setFilter('page')} />
        </AppPage>
    )
}
