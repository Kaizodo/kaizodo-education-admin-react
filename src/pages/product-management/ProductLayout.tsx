import CommonLayout from "@/components/app/CommonLayout";
import { ProductNavs } from "./ProductNavs";

export default function ProductLayout() {
    return (<CommonLayout title="Product Mgmt" navs={ProductNavs} route_root="/product-management" />)
}
