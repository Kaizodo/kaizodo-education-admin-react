import { lazy } from "react";
import type { RouteType } from "./data/router";
import { PRODUCTION_MODE } from "./lib/api";
import AuthLayout from "./components/app/AuthLayout";


export const routes: RouteType[] = [
    { path: 'login', element: lazy(() => import('@/pages/login/Login')) },
    {
        path: '', element: AuthLayout, children: [
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
                    { path: 'phase-steps', element: lazy(() => import('@/pages/phase-step/PhaseStepManagement')) },

                    { path: 'employees', element: lazy(() => import('@/pages/employees/EmployeeListing')) },
                    { path: 'feature-cards', element: lazy(() => import('@/pages/feature-cards/FeatureCards')) },
                    { path: 'teams', element: lazy(() => import('@/pages/teams/Teams')) },
                    { path: 'settings', element: lazy(() => import('@/pages/settings/Settings')) },
                    { path: 'orders', element: lazy(() => import('@/pages/orders/Orders')) },
                    { path: 'orders/:internal_reference_number', element: lazy(() => import('@/pages/orders/OrderDetail')) },

                    { path: 'organizations', element: lazy(() => import('@/pages/organizations/OrganizationListing')) },
                    { path: 'organizations/create', element: lazy(() => import('@/pages/organizations/OrganizationEditor')) },
                    { path: 'organizations/update/:id', element: lazy(() => import('@/pages/organizations/OrganizationEditor')) },
                    { path: 'ticket-category', element: lazy(() => import('@/pages/ticket-category/TicketCategoryModules')) },
                    { path: 'news', element: lazy(() => import('@/pages/articles/NewsManagement')) },
                    { path: 'blogs', element: lazy(() => import('@/pages/articles/BlogsManagement')) },
                    { path: 'article-bulk-upload', element: lazy(() => import('@/pages/articles/ArticleBulkUpload')) },
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
                ],
            },
            {
                path: 'website-management', element: lazy(() => import('@/pages/website-management/WebsiteLayout')), children: [
                    { path: '', element: lazy(() => import('@/pages/website-management/pages/dashboard/WebsiteDashboard')) },
                    { path: 'navigation', element: lazy(() => import('@/pages/website-management/pages/navigation/NavigationManagement')) },

                ]
            },
            {
                path: 'data-management', element: lazy(() => import('@/pages/data-management/DataLayout')), children: [
                    { path: '', element: lazy(() => import('@/pages/data-management/pages/dashboard/DataDashboard')) },
                    { path: 'country', element: lazy(() => import('@/pages/data-management/pages/country/CountryManagement')) },
                    { path: 'state', element: lazy(() => import('@/pages/data-management/pages/state/StateManagement')) },
                    { path: 'city', element: lazy(() => import('@/pages/data-management/pages/city/CityManagement')) },
                    { path: 'district', element: lazy(() => import('@/pages/data-management/pages/district/DistrictManagement')) },
                    { path: 'locality', element: lazy(() => import('@/pages/data-management/pages/locality/LocalityManagement')) },
                    { path: 'currency', element: lazy(() => import('@/pages/data-management/pages/currency/CurrencyManagement')) },
                    { path: 'exchange', element: lazy(() => import('@/pages/data-management/pages/currency-exchange/CurrencyExchangeManagement')) },
                ]
            },
            {
                path: 'product-management', element: lazy(() => import('@/pages/product-management/ProductLayout')), children: [
                    { path: '', element: lazy(() => import('@/pages/product-management/pages/dashboard/ProductDashboard')) },
                    { path: 'products', element: lazy(() => import('@/pages/product-management/pages/products/ProductListing')) },
                    { path: 'products/create', element: lazy(() => import('@/pages/product-management/pages/products/CreateProduct')) },
                    { path: 'products/:id', element: lazy(() => import('@/pages/product-management/pages/products/UpdateProduct')) },
                    { path: 'product-categories', element: lazy(() => import('@/pages/product-management/pages/product-categories/ProductCategoryListing')) },
                    { path: 'tax-codes', element: lazy(() => import('@/pages/product-management/pages/tax-codes/TaxCodesListing')) },
                    { path: 'tax-components', element: lazy(() => import('@/pages/product-management/pages/tax-components/TaxComponentListing')) },
                    { path: 'units', element: lazy(() => import('@/pages/product-management/pages/units/UnitListing')) },
                    { path: 'features', element: lazy(() => import('@/pages/product-management/pages/features/FeatureListing')) },
                    { path: 'feature-groups', element: lazy(() => import('@/pages/product-management/pages/feature-group/FeatureGroupListing')) },
                    { path: 'modules', element: lazy(() => import('@/pages/product-management/pages/modules/Modules')) },
                    { path: 'module-features', element: lazy(() => import('@/pages/product-management/pages/module-features/ModuleFeatures')) },
                    { path: 'courier-partners', element: lazy(() => import('@/pages/product-management/pages/courier-channel/CourierChannelListing')) },
                    { path: 'discount-plans', element: lazy(() => import('@/pages/product-management/pages/discount-plans/DiscountPlans')) },
                ]
            },

            {
                path: 'lead-management', element: lazy(() => import('@/pages/lead-management/LeadLayout')), children: [
                    { path: '', element: lazy(() => import('@/pages/lead-management/dashboard/LeadDashboard')) },
                    { path: 'contacts', element: lazy(() => import('@/pages/lead-management/contacts/LeadContacts')) },
                    { path: 'lead-sources', element: lazy(() => import('@/pages/lead-management/lead-sources/LeadSources')) },
                    {
                        path: 'leads', element: lazy(() => import('@/pages/lead-management/leads/LeadListing')), children: [
                            { path: ':internal_reference_number', element: lazy(() => import('@/pages/lead-management/leads/LeadDetail')) }
                        ]
                    },

                ]
            },
        ]
    }

];