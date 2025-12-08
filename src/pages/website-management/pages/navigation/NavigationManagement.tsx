import AppPage from "@/components/app/AppPage";
import { useEffect, useState } from "react";
import { NavData } from "@/data/NavManager";
import NavManager from "./components/NavManager";
import Btn from "@/components/common/Btn";
import { Save } from "lucide-react";
import { msg } from "@/lib/msg";
import CenterLoading from "@/components/common/CenterLoading";
import { StoreService } from "@/services/StoreService";
import { useGlobalContext } from "@/hooks/use-global-context";
import NoRecords from "@/components/common/NoRecords";
import { LuStore } from "react-icons/lu";
import OrganizationSwitch from "@/components/app/OrganizationSwitch";



export default function NavigationManagement() {
    const { context } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<NavData>({
        header: [],
        footer: []
    });


    const detail = async () => {
        if (!context.organization.id) {
            return;
        }
        setLoading(true);
        var r = await StoreService.loadNavigation(context.organization.id);
        if (r.success) {
            setData(r.data);
        }
        setLoading(false);
    }

    const save = async () => {
        setSaving(true);
        var r = await StoreService.saveNavigation({ ...data, organization_id: context.organization.id });
        if (r.success) {
            msg.success('Navigation saved');
        }
        setSaving(false);
    }

    useEffect(() => {
        detail();
    }, [context.organization])

    return (<AppPage title="Website Navigation" subtitle="Manage header and footer navigation links and design" actions={<Btn onClick={save} loading={saving}><Save />Save Changes</Btn>}>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
            {!context?.organization?.id && <NoRecords
                icon={LuStore}
                title="Please select a store"
                subtitle='Try selecting a store in order to modify settings'
                action={<OrganizationSwitch />}
            />}
            {!!context?.organization?.id && loading && <CenterLoading className='h-[400px] relative' />}
            {!!context?.organization?.id && !loading && <NavManager data={data} setData={setData} />}
        </div>
    </AppPage>)
};

