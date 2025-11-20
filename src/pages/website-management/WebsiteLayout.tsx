import CommonLayout from "@/components/app/CommonLayout";
import { WebsiteNavs } from "./WebsiteNavs";

export default function ProductLayout() {
    return (<CommonLayout title="Website Mgmt" navs={WebsiteNavs} route_root="/website-management" />)
}
