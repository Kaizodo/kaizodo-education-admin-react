import { NavItem } from "@/components/app/CommonLayout";
import { LuHouse, LuIndianRupee, LuMapPinned } from "react-icons/lu";
import { GiModernCity } from "react-icons/gi";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { PiMapPinAreaFill } from "react-icons/pi";
import { TbTransactionRupee } from "react-icons/tb";

export const DataNavs: NavItem[] = [
    { icon: LuHouse, label: 'Dashboard', section: 'main', route: '' },
    { icon: GiModernCity, label: 'City Data', section: 'management', route: 'city' },
    { icon: LuMapPinned, label: 'District Data', section: 'management', route: 'district' }, ,
    { icon: PiMapPinAreaFill, label: 'States Data', section: 'management', route: 'state' },
    { icon: HiGlobeAsiaAustralia, label: 'Country Data', section: 'management', route: 'country' },
    { icon: LuIndianRupee, label: 'Currencies', section: 'management', route: 'currency' },
    { icon: TbTransactionRupee, label: 'Currency Exchange', section: 'management', route: 'exchange' }
];