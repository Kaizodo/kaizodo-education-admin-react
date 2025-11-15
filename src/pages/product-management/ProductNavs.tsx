import { NavItem } from "@/components/app/CommonLayout";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { TbPercentage, TbPuzzle2 } from "react-icons/tb";
import { PiScales } from "react-icons/pi";
import { LuBadgeIndianRupee, LuHouse } from "react-icons/lu";
import { IoExtensionPuzzleOutline } from "react-icons/io5";

export const ProductNavs: NavItem[] = [
    { icon: LuHouse, label: 'Dashboard', section: 'main', route: '' },
    { icon: AiOutlineProduct, label: 'Products', section: 'main', route: 'products' },
    { icon: MdOutlineCategory, label: 'Categories', section: 'management', route: 'product-categories' },
    { icon: TbPercentage, label: 'Tax Codes', section: 'management', route: 'tax-codes' }, ,
    { icon: LuBadgeIndianRupee, label: 'Tax Components', section: 'management', route: 'tax-components' },
    { icon: PiScales, label: 'Units', section: 'management', route: 'units' },
    { icon: IoExtensionPuzzleOutline, label: 'Features', section: 'management', route: 'features' },
    { icon: TbPuzzle2, label: 'Feature Groups', section: 'management', route: 'feature-groups' }
];