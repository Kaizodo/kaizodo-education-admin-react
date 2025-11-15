import {
    Home, Briefcase, DollarSign, FileText, Users, BarChart2, List,
} from 'lucide-react';

import { VscSourceControl } from 'react-icons/vsc';
import CommonLayout, { NavItem } from '@/components/app/CommonLayout';



const navItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', section: 'main', route: '' },
    { icon: Briefcase, label: 'Leads', section: 'main', route: 'leads' },
    { icon: List, label: 'Jobs', section: 'main' },
    { icon: BarChart2, label: 'Activity', section: 'main' },
    { icon: DollarSign, label: 'Proposals', count: 345, section: 'management', route: 'proposals' },
    { icon: FileText, label: 'Invoices', count: 348, section: 'management', route: 'invoices' },
    { icon: Users, label: 'Contacts', count: 451, section: 'management', route: 'contacts' },
    { icon: BarChart2, label: 'Metrics', count: 255, section: 'management', route: 'metrics' },
    { icon: Briefcase, label: 'Company', section: 'management', route: 'company' },
    { icon: Users, label: 'Users', section: 'management', route: 'users' },
    { icon: VscSourceControl, label: 'Lead Sources', section: 'management', route: 'lead-sources' },
];




export default function LeadLayout() {
    return (<CommonLayout navs={navItems} title={"Lead Management"} route_root='/lead-management' />);
}
