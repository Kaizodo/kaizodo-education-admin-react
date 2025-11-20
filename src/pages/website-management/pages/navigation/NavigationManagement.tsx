import AppPage from "@/components/app/AppPage";
import { useEffect, useState } from "react";
import { NavData } from "@/data/NavManager";
import NavManager from "./components/NavManager";
import Btn from "@/components/common/Btn";
import { Save } from "lucide-react";
import { msg } from "@/lib/msg";
import CenterLoading from "@/components/common/CenterLoading";
import { SettingService } from "@/services/SettingService";



export default function NavigationManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<NavData>({
        header: [],
        footer: []
    });


    const detail = async () => {
        setLoading(true);
        var r = await SettingService.loadNavigation();
        if (r.success) {
            setData(r.data);
        }
        setLoading(false);
    }

    const save = async () => {
        setSaving(true);
        var r = await SettingService.saveNavigation(data);
        if (r.success) {
            msg.success('Navigation saved');
        }
        setSaving(false);
    }

    useEffect(() => {
        detail();
    }, [])

    return (<AppPage title="Website Navigation" subtitle="Manage header and footer navigation links and design" actions={<Btn onClick={save} loading={saving}><Save />Save Changes</Btn>}>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
            {loading && <CenterLoading className='h-[400px] relative' />}
            {!loading && <NavManager data={data} setData={setData} />}
        </div>
    </AppPage>)
};

