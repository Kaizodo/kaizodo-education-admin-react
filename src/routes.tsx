import { lazy } from "react";
import type { RouteType } from "./data/router";
import { PRODUCTION_MODE } from "./lib/api";


export const routes: RouteType[] = [
    { path: 'login', element: lazy(() => import('@/pages/login/Login')) },
    {
        element: lazy(() => import('@/components/app/MainLayout')), children: [
            { path: 'page-not-found', element: lazy(() => import('@/pages/errors/NotFound404')) },
            { path: '', element: lazy(() => import('@/pages/dashboard/Dashboard')) },
            { path: 'subscription-plans', element: lazy(() => import('@/pages/subscription-plans/SubscriptionPlans')) },
            { path: 'subscription-plans/create', element: lazy(() => import('@/pages/subscription-plans/SubscriptionPlanEditor')) },
            { path: 'subscription-plans/update/:id', element: lazy(() => import('@/pages/subscription-plans/SubscriptionPlanEditor')) },
            { path: 'subscription-features', element: lazy(() => import('@/pages/subscription-features/SubscriptionFeatures')) },
            { path: 'subscription-modules', element: lazy(() => import('@/pages/subscription-modules/SubscriptionModules')) },
            { path: 'subscription-topups', element: lazy(() => import('@/pages/subscription-topups/SubscriptionTopups')) },
            { path: 'comparison-points', element: lazy(() => import('@/pages/comparison-points/ComparisonPoints')) },
            { path: 'clients', element: lazy(() => import('@/pages/clients/ClientListing')) },
            { path: 'referral-schemes', element: lazy(() => import('@/pages/referral-scheme/ReferralScheme')) },
            { path: 'referral-earnings', element: lazy(() => import('@/pages/referral-earning-withdrawal/ReferralEarningWithdrawal')) },
            { path: 'marketing-material', element: lazy(() => import('@/pages/marketing-material/MarketingMaterial')) },
            { path: 'faqs', element: lazy(() => import('@/pages/faqs/Faqs')) },
            { path: 'projects', element: lazy(() => import('@/pages/projects/ProjectListing')) },
            { path: 'projects/:internal_reference_number', element: lazy(() => import('@/pages/projects/ProjectDetail')) },
            { path: 'phases', element: lazy(() => import('@/pages/phase/PhaseManagement')) },
            { path: 'phases', element: lazy(() => import('@/pages/phase/PhaseManagement')) },
            { path: 'phase-steps', element: lazy(() => import('@/pages/phase-step/PhaseStepManagement')) },
            { path: 'footer-links', element: lazy(() => import('@/pages/footer-links/FooterLinks')) },
            { path: 'employees', element: lazy(() => import('@/pages/employees/EmployeeListing')) },
            { path: 'feature-cards', element: lazy(() => import('@/pages/feature-cards/FeatureCards')) },
            { path: 'teams', element: lazy(() => import('@/pages/teams/Teams')) },
            { path: 'settings', element: lazy(() => import('@/pages/settings/Settings')) },
            { path: 'orders', element: lazy(() => import('@/pages/orders/Orders')) },
            { path: 'orders/:internal_reference_number', element: lazy(() => import('@/pages/orders/OrderDetail')) },
            { path: 'discount-plans', element: lazy(() => import('@/pages/discount-plans/DiscountPlans')) },
            { path: 'organizations', element: lazy(() => import('@/pages/organizations/OrganizationListing')) },
            { path: 'organizations/create', element: lazy(() => import('@/pages/organizations/OrganizationEditor')) },
            { path: 'organizations/update/:id', element: lazy(() => import('@/pages/organizations/OrganizationEditor')) },
            { path: 'ticket-category', element: lazy(() => import('@/pages/ticket-category/TicketCategoryModules')) },
            { path: 'news', element: lazy(() => import('@/pages/articles/NewsManagement')) },
            { path: 'blogs', element: lazy(() => import('@/pages/articles/BlogsManagement')) },
            { path: 'testimonials', element: lazy(() => import('@/pages/testimonials/TestimonialManagement')) },
            { path: 'gallery', element: lazy(() => import('@/pages/gallery/GalleryManagement')) },
            { path: 'banner', element: lazy(() => import('@/pages/banner/BannerManagement')) },
            { path: 'custom-page', element: lazy(() => import('@/pages/custom-page/CustomPageManagement')) },
            {
                path: 'tickets', element: lazy(() => import('@/pages/tickets/Tickets')), children: [
                    { path: ':internal_reference_number', element: lazy(() => import('@/pages/tickets/components/TicketDetails')) }
                ]
            },
            ...(!PRODUCTION_MODE ? [
                { path: 'permissions', element: lazy(() => import('@/pages/permissions/PermissionManagement')) },
                { path: 'permission-groups', element: lazy(() => import('@/pages/permission-groups/PermissionGroupListing')) }
            ] : [])
        ]
    }
];