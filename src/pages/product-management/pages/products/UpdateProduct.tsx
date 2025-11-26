import AppPage from '@/components/app/AppPage';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LuArrowRight } from 'react-icons/lu';
import { useForm } from '@/hooks/use-form';
import { ProductService } from '@/services/ProductService';
import CenterLoading from '@/components/common/CenterLoading';
import SectionNavigator, { NavigatorSection } from '@/components/common/SectionNavigator';
import { TbHeartPlus, TbSitemap, TbTransactionRupee, TbUserShare } from "react-icons/tb";
import { IoExtensionPuzzleOutline, IoReturnDownBackOutline } from "react-icons/io5";
import { RiSoundModuleFill, RiVerifiedBadgeLine } from "react-icons/ri";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsImages, BsInfo, BsListStars } from 'react-icons/bs';
import HighlightInput from './components/HighlightInput';
import ProductMediaInformation from './components/ProductMediaInformation';
import ProductPricingInformation from './components/ProductPricingInformation';
import ProductBasicInformation from './components/ProductBasicInformation';
import ProductFeatureInformation from './components/ProductFeatureInformation';
import ProductModuleInformation from './components/ProductModuleInformation';
import { ProductState } from '@/data/Product';
import ProductVariantInformation from './components/ProductVariantInformation';
import ProductAddonInformation from './components/ProductAddonInformation';
import ProductPhaseInformation from './components/ProductPhaseInformation';
import ProductReferralInformation from './components/ProductReferralInformation';
import ProductShippingInformation from './components/ProductShippingInformation';
import ProductWarrantyInformation from './components/ProductWarrantyInformation';
import ProductReturnInformation from './components/ProductReturnInformation';

export default function UpdateProduct() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [state, setValue, setState] = useForm<ProductState>()



    const load = async () => {
        if (!id) {
            return;
        }
        var r = await ProductService.detail(Number(id));
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            navigate('/product-management/products')
        }
    }



    useEffect(() => {
        load();
    }, [id])





    return (<AppPage
        enableBack={true}
        backRoute={'/product-management/products'}
        title={state?.product?.name ?? "Update Product"}
        subtitle={state?.tree ? <div className='flex flex-row gap-1 text-xs flex-wrap items-center'>
            {state.tree.map((item, index: number) => {
                return <>
                    <span key={item.id} className={cn(
                        'flex    px-1 text-xs',
                        item.id == state.product.product_category_id && "   font-medium "
                    )}  >{item.name}</span>
                    {index !== state.tree.length - 1 && <LuArrowRight />}
                </>
            })}
        </div> : undefined}
        containerClassName='p-0 md:p-0 md:ps-6'
    >
        {loading && <CenterLoading className="relative h-[500px]" />}
        {!loading && <SectionNavigator menuItems={[
            { id: 'basic', title: 'Basic Information', subtitle: 'Start with core product details', icon: BsInfo },
            { id: 'pricing', title: 'Pricing', subtitle: 'Set pricing and related options', icon: TbTransactionRupee },
            { id: 'media', title: 'Images & Media', subtitle: 'Upload product visuals', icon: BsImages },
            { id: 'highlights', title: 'Highlights', subtitle: 'Add key selling points', icon: BsListStars },
            { id: 'features', title: 'Features & Attributes', subtitle: 'Define product capabilities', icon: IoExtensionPuzzleOutline },
            { id: 'variants', title: 'Variants', subtitle: 'Configure product variations', icon: TbSitemap },
            { id: 'addons', title: 'Addons', subtitle: 'Attach optional add-ons', icon: TbHeartPlus },
            { id: 'modules', title: 'Modules', subtitle: 'Add modular components', icon: RiSoundModuleFill },
            { id: 'phases', title: 'Installation Phases', subtitle: 'Organize deployment workflow', icon: HiOutlineWrenchScrewdriver },
            { id: 'shipping', title: 'Shipping Details', subtitle: 'Set delivery and logistics info', icon: LiaShippingFastSolid },
            { id: 'warranty', title: 'Warranty Details', subtitle: 'Provide product warranty information', icon: RiVerifiedBadgeLine },
            { id: 'referral', title: 'Referral Program', subtitle: 'Create referral incentives', icon: TbUserShare },
            { id: 'return', title: 'Return Policy', subtitle: 'Your return policy and duration', icon: IoReturnDownBackOutline }
        ]
        }>
            <NavigatorSection
                id="basic"
                icon={BsInfo}
                title="Product Information"
                subtitle="Easily input essential details like name, price, and more to showcase your product."
            >
                <ProductBasicInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="pricing"
                icon={TbTransactionRupee}
                title="Product Pricing"
                subtitle="Add country and stock wise pricing for product"
                className="p-0"
            >
                <ProductPricingInformation state={state} setState={setState} setStateValue={setValue} />
            </NavigatorSection>

            <NavigatorSection
                id="media"
                icon={BsImages}
                title="Product Images"
                subtitle="Upload attractive photos of produts"
            >

                <ProductMediaInformation state={state} setState={setState} setStateValue={setValue} />



            </NavigatorSection>
            <NavigatorSection
                id="highlights"
                icon={BsListStars}
                title="Product Highlights"
                subtitle="Upload attractive photos of produts"
            >
                <div className="px-3">
                    <HighlightInput features={state.product.features ?? []} setValue={setValue} product_id={state.product.id} />
                </div>
            </NavigatorSection>
            <NavigatorSection
                id="features"
                icon={IoExtensionPuzzleOutline}
                title="Features & Attributes"
                subtitle="Upload attractive photos of produts"
            >
                <ProductFeatureInformation state={state} setState={setState} setStateValue={setValue} />
            </NavigatorSection>
            <NavigatorSection
                id="variants"
                icon={TbSitemap}
                title="Variants"
                subtitle="Configure product variations"
                className="p-0"
            >
                <ProductVariantInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="addons"
                icon={TbHeartPlus}
                title="Addons"
                subtitle="Attach optional add-ons"

            >
                <ProductAddonInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="modules"
                icon={RiSoundModuleFill}
                title="Modules"
                subtitle="Add modular components"

            >
                <ProductModuleInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="phases"
                icon={HiOutlineWrenchScrewdriver}
                title="Installation Phases"
                subtitle="Organize deployment workflow"

            >
                <ProductPhaseInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="shipping"
                icon={LiaShippingFastSolid}
                title="Shipping Details"
                subtitle="Set delivery and logistics info"

            >
                <ProductShippingInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="warranty"
                icon={RiVerifiedBadgeLine}
                title="Warranty Information"
                subtitle="Provide product warranty details"
                className='p-0'
            >
                <ProductWarrantyInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="referral"
                icon={HiOutlineWrenchScrewdriver}
                title="Referral Program"
                subtitle="Create referral incentives"

            >
                <ProductReferralInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>
            <NavigatorSection
                id="return"
                icon={IoReturnDownBackOutline}
                title="Return Policy"
                subtitle="Your return policy and duration"

            >
                <ProductReturnInformation state={state} setState={setState} setStateValue={setValue} />


            </NavigatorSection>


        </SectionNavigator>}
    </AppPage>)
}
