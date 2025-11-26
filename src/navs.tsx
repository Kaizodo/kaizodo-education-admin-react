import {
    LuHouse,
    LuCrown,
    LuUniversity,
    LuCog,
    LuHeadphones,
    LuUsers,
    LuClipboardList,
    LuLock,
    LuLayers,
    LuNewspaper,
    LuBus,
    LuGitCompare,
    LuBadgeIndianRupee,
    LuFileStack,
} from "react-icons/lu";
import { NavType } from "./data/sidenav";
import { BiSliderAlt } from "react-icons/bi";
import { LiaBullhornSolid, LiaUserTieSolid } from "react-icons/lia";
import { TbListTree, TbTimelineEventText, TbUserStar } from "react-icons/tb";
import { TiGroupOutline } from "react-icons/ti";
import { GrGroup, GrNavigate } from "react-icons/gr";
import { PRODUCTION_MODE } from "./lib/api";
import { IoCodeSlashOutline, IoStorefrontOutline } from "react-icons/io5";
import { FaGlobeAsia } from "react-icons/fa";
import { BsCardHeading, BsDatabaseGear, BsInbox, BsPatchQuestion } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
import { RxIdCard } from "react-icons/rx";
import { RiDiscountPercentLine } from "react-icons/ri";
import { FaTimeline } from "react-icons/fa6";
import { PiNetwork, PiProjectorScreenChart } from "react-icons/pi";

export const navs: NavType[] = [
    { route: '', label: 'Dashboard', icon: LuHouse },
    {
        label: 'Subscription  Plan Editor',
        icon: LuCrown,
        children: [
            { route: 'subscription-plans', label: 'Subscription Plans', subtitle: 'Pre-defined subscription plans', icon: LuCrown },
            { route: 'subscription-topups', label: 'TopUp Plans', subtitle: 'SMS, Email etc Plans ', icon: BiSliderAlt },
            { route: 'comparison-points', label: 'Comparison Points', subtitle: 'Manage comparison points ', icon: LuGitCompare },
            { route: 'subscription-modules', label: 'Modules', subtitle: 'Pre-defined subscription modules', icon: BiSliderAlt },
            { route: 'subscription-features', label: 'Features', subtitle: 'Pre-defined subscription features', icon: BiSliderAlt },
            { route: 'discount-plans', label: 'Discount & Coupons', subtitle: 'Manage discount coupons for subscription', icon: RiDiscountPercentLine },
            { route: 'feature-cards', label: 'Feature Cards', icon: BsCardHeading },
        ]
    },
    {
        label: 'Marketing',
        icon: LiaBullhornSolid,
        children: [
            { route: 'referral-schemes', label: 'Referral Scheme', subtitle: 'Manage time limited referral schems', icon: LuBadgeIndianRupee },
            { route: 'referral-earnings', label: 'Referral Earnings / Withdrawals', subtitle: 'Manage referral earning withdrawal requests', icon: LuBadgeIndianRupee },
            { route: 'marketing-material', label: 'Marketing Material', subtitle: 'Manage marketing material list', icon: RxIdCard },
        ]
    },
    {
        label: 'Clients',
        icon: LiaUserTieSolid,
        route: 'clients'
    },

    {
        label: 'Projects & Steps',
        icon: PiNetwork,
        children: [
            {
                label: 'Projects',
                icon: PiProjectorScreenChart,
                route: 'projects'
            },
            { label: 'Project Phases', icon: FaTimeline, route: 'phases' },
            { label: 'Project Phase Steps', icon: TbTimelineEventText, route: 'phase-steps' },
        ]
    },
    {
        label: 'Employees & Team',
        icon: GrGroup,
        children: [
            { label: 'Employees', icon: LuUsers, route: 'employees' },
            { label: 'Teams', icon: TiGroupOutline, route: 'teams' }
        ]
    },
    {
        admin_only: true,
        label: 'Organizations',
        icon: LuUniversity,
        route: 'organizations',
        subtitle: 'Manage school,collages, institutes'

    },
    {
        admin_only: true,
        label: 'Stores',
        icon: IoStorefrontOutline,
        route: 'stores',
        subtitle: 'Manage  stores and businesses'

    },
    {
        label: 'Orders',
        icon: LuClipboardList,
        route: 'orders'
    },
    { label: 'Product Management', icon: LuCrown, route: 'product-management' },
    { label: 'Lead Management', icon: TbUserStar, route: 'lead-management' },
    { label: 'Website Management', icon: FaGlobeAsia, route: 'website-management' },
    { label: 'Data Management', icon: BsDatabaseGear, route: 'data-management' },
    {
        label: 'Ticket Support',
        icon: LuHeadphones,
        children: [
            { route: 'tickets', label: 'Tickets', subtitle: 'Manage all support tickets', icon: LiaUserTieSolid },
            { route: 'ticket-category', label: 'Categories', subtitle: 'Manage ticket categories', icon: TbListTree },
        ]
    },
    {
        admin_only: true,
        label: 'Settings',
        icon: LuCog,
        route: 'settings',
        subtitle: 'Manage various important settings'

    },
    {

        label: 'Website',
        icon: FaGlobeAsia,
        children: [
            { route: 'article-bulk-upload', label: 'Bulk Upload Articles', icon: LuFileStack },
            { route: 'news', label: 'News', icon: LuNewspaper },
            { route: 'blogs', label: 'Blogs', icon: LuNewspaper },
            { route: 'gallery', label: 'Gallery', icon: LuBus },
            { route: 'testimonials', label: 'Testimonials', icon: VscFeedback },
            { route: 'faqs', label: 'FAQs', icon: BsPatchQuestion, subtitle: 'Frequently Asked Questions' },
            { route: 'banner', label: 'Banner', icon: BsInbox },
            { route: 'footer-links', label: 'Footer Links', icon: GrNavigate },
            { route: 'custom-page', label: 'Custom Page', icon: BsInbox }
        ]
    },
    ...(!PRODUCTION_MODE ? [
        {
            label: 'Developer Options', icon: IoCodeSlashOutline, children: [
                { route: 'permissions', label: 'Permissions', icon: LuLock },
                { route: 'permission-groups', label: 'Permission Groups', icon: LuLayers }
            ]
        }
    ] : [])
];

