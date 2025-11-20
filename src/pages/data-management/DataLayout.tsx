import CommonLayout from "@/components/app/CommonLayout";
import { DataNavs } from "./DataNavs";

export default function ProductLayout() {
    return (<CommonLayout title="Data Mgmt" navs={DataNavs} route_root="/data-management" />)
}
