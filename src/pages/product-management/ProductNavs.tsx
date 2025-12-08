import { NavItem } from "@/components/app/CommonLayout";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory, MdOutlineFeaturedPlayList } from "react-icons/md";
import { TbPercentage, TbPuzzle2, TbTruckDelivery } from "react-icons/tb";
import { PiScales } from "react-icons/pi";
import { LuBadgeIndianRupee, LuHouse } from "react-icons/lu";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { RiDiscountPercentLine, RiSoundModuleFill } from "react-icons/ri";

export const ProductNavs: NavItem[] = [
    { icon: LuHouse, label: 'Dashboard', section: 'main', route: '' },
    { icon: AiOutlineProduct, label: 'Products', section: 'main', route: 'products' },
    { icon: RiDiscountPercentLine, label: 'Discount & Coupons', section: 'main', route: 'discount-plans' },
    { icon: MdOutlineCategory, label: 'Categories', section: 'management', route: 'product-categories' },
    { icon: TbPercentage, label: 'Tax Codes', section: 'management', route: 'tax-codes' },
    { icon: LuBadgeIndianRupee, label: 'Tax Components', section: 'management', route: 'tax-components' },
    { icon: PiScales, label: 'Units', section: 'management', route: 'units' },
    { icon: IoExtensionPuzzleOutline, label: 'Features & Attributes', section: 'management', route: 'features' },
    { icon: TbPuzzle2, label: 'Features & Attribute Groups', section: 'management', route: 'feature-groups' },
    { icon: RiSoundModuleFill, label: 'Modules', section: 'management', route: 'modules' },
    { icon: MdOutlineFeaturedPlayList, label: 'Module Features', section: 'management', route: 'module-features' },
    { icon: TbTruckDelivery, label: 'Courier Partners', section: 'management', route: 'courier-partners' }
];