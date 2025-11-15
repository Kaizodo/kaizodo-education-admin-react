import AppPage from "@/components/app/AppPage";
import ProductCategorySelector from "./components/ProductCategorySelector";

export default function ProductEditor() {
    return (
        <AppPage
            enableBack={true}
            backRoute={'/product-management/products'}
            title="Create New Product"
            subtitle="Select suitable product category to get started"
        >
            <ProductCategorySelector />
        </AppPage>
    )
}
