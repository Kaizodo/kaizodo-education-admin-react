import { useEffect, useState } from "react";
import Dropdown from "../common/Dropdown";
import { StoreService } from "@/services/StoreService";
import { Storage } from "@/lib/storage";
import { useGlobalContext } from "@/hooks/use-global-context";
import { defaultContextOrganization } from "@/data/global";




export default function OrganizationSwitch() {
    const { setContext } = useGlobalContext();
    const [value, setValue] = useState();

    useEffect(() => {
        Storage.set('organization_id', value);
        if (!value) {
            setContext(c => ({ ...c, organization: defaultContextOrganization }))
        }
    }, [value])




    return (
        <Dropdown
            searchable={true}
            value={value}
            onChange={setValue}
            placeholder={'Switch Organization'}
            includedValues={[]}
            onSelect={(organization) => setContext(c => ({ ...c, organization }))}
            getOptions={async (filters) => {
                var r = await StoreService.search({
                    ...filters,
                    is_internal: 1
                });
                return [{
                    id: undefined,
                    name: 'All Stores'
                }, ...r.data.records];
            }}

        >

        </Dropdown>
    )
}
