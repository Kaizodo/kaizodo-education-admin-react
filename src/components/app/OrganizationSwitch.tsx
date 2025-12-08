import { useEffect, useState } from "react";
import Dropdown from "../common/Dropdown";
import { StoreService } from "@/services/StoreService";
import { Storage } from "@/lib/storage";
import { useGlobalContext } from "@/hooks/use-global-context";
import { ContextOrganiation, defaultContextOrganization } from "@/data/global";




export default function OrganizationSwitch() {
    const { context, setContext } = useGlobalContext();
    const [value, setValue] = useState<number | undefined>(0);

    useEffect(() => {
        if (value !== 0 && value === undefined) {
            Storage.set('organization', undefined);
            setContext(c => ({ ...c, organization: defaultContextOrganization }))
        }
    }, [value])


    useEffect(() => {

        (async () => {
            var o = await Storage.get<ContextOrganiation>('organization');
            if (o) {
                setValue(o.id);
                setContext(c => ({ ...c, organization: o ? o : defaultContextOrganization }))
            }
        })()
    }, []);


    return (
        <Dropdown
            searchable={true}
            value={value}
            onChange={setValue}
            placeholder={'Switch Organization'}
            includedValues={[]}
            selected={context.organization as any}
            onSelect={async (organization) => {
                await Storage.set<ContextOrganiation>('organization', organization);
                setContext(c => ({ ...c, organization }));
            }}
            getOptions={async (filters) => {
                var r = await StoreService.search({
                    ...filters,
                    is_internal: 1
                });
                return [{
                    id: undefined,
                    name: 'All Stores'
                }, ...r.data.records.map((rx: any) => ({
                    ...rx,
                    description: rx.nickname
                }))];
            }}

        >

        </Dropdown>
    )
}
