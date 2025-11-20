import { NavItem } from "@/components/app/CommonLayout";
import { AiOutlineProduct } from "react-icons/ai";
import { TbLogs } from "react-icons/tb";

import { LuHouse, LuPanelTopDashed } from "react-icons/lu";
import { GrArticle, GrNavigate } from "react-icons/gr";

export const WebsiteNavs: NavItem[] = [
    { icon: LuHouse, label: 'Dashboard', section: 'main', route: '' },
    { icon: AiOutlineProduct, label: 'Products', section: 'main', route: 'products' },
    { icon: GrNavigate, label: 'Navigation', section: 'management', route: 'navigation' },
    { icon: GrArticle, label: 'News', section: 'management', route: 'news' }, ,
    { icon: TbLogs, label: 'Blogs', section: 'management', route: 'blogs' }
];