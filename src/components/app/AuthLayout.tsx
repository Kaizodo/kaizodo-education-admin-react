import { useEffect, useState } from "react";


import { Navigate, Outlet } from "react-router-dom";
import CenterLoading from "../common/CenterLoading";
import { AuthenticationService } from "@/services/AuthenticationService";
import { useGlobalContext } from "@/hooks/use-global-context";
import { BootService } from "@/services/BootService";
import { Storage } from "@/lib/storage";



export default function AuthLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { setContext } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        AuthenticationService.isAuthenticated().then(setIsAuthenticated).catch(() => setIsAuthenticated(false));
    }, []);

    const initProfile = async () => {
        var r = await BootService.boot();
        if (r.success) {
            await Storage.set('permissions', r.data.user.permissions);
            setContext(c => ({ ...c, ...r.data }));
            setLoading(false);
        } else {
            await AuthenticationService.logoutPlatform();
            setIsAuthenticated(false);
        }
    }




    useEffect(() => {
        if (isAuthenticated === true) {
            initProfile();
        } else if (isAuthenticated === false) {
            setLoading(false);
        }
    }, [isAuthenticated]);

    if (isAuthenticated === null || loading) {
        return <CenterLoading />
    }

    if (!isAuthenticated) {
        return <Navigate to={'/login'} />
    }



    return <Outlet />;
}
