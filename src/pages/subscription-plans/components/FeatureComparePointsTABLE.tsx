import { LuCircleCheck, LuX } from "react-icons/lu";
import { SubscriptionPlanEditorState } from "../SubscriptionPlanEditor"
import { LucideXCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SubscriptionPlanService } from "@/services/SubscriptionPlanService";
import CenterLoading from "@/components/common/CenterLoading";

const plans: Plan[] = [
    {
        id: 'basic',
        name: 'Essential Starter',
        price: 99,
        description: 'Core modules to manage basic school administration efficiently.',
        isPopular: false,
    },
    {
        id: 'standard',
        name: 'Professional Plus',
        price: 199,
        description: 'The complete package for seamless operations and enhanced parent engagement.',
        isPopular: true,
    },
    {
        id: 'premium',
        name: 'Enterprise Ultra',
        price: 399,
        description: 'Unlimited capacity, advanced analytics, and priority support for large institutions.',
        isPopular: false,
    },
];
const TARGET_PLAN_ID: Plan['id'] = 'standard';
const features: Feature[] = [
    { id: 'admn', name: 'Student Admissions Management', basic: 'Limited', standard: 'Yes', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { id: 'fees', name: 'Online Fee Collection & Reporting', basic: 'Limited', standard: 'Yes', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { id: 'attend', name: 'Staff & Student Attendance', basic: 'Yes', standard: 'Yes', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h.01M15 11h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8c4.97 0 9 3.582 9 8z" /></svg> },
    { id: 'grade', name: 'Gradebook & Exam Management', basic: 'No', standard: 'Yes', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
    { id: 'parent', name: 'Dedicated Parent/Guardian Portal', basic: 'No', standard: 'Yes', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> },
    { id: 'lms', name: 'Integrated Learning Management System (LMS)', basic: 'No', standard: 'Limited', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
    { id: 'analytics', name: 'Advanced Reporting & Analytics', basic: 'No', standard: 'No', premium: 'Yes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8.7l-3.3-3.2c-.3-.3-.8-.3-1.1 0L12 8l-3-3.1c-.3-.3-.8-.3-1.1 0L3.3 9.4" /></svg> },
    { id: 'storage', name: 'Cloud Storage Capacity', basic: '5GB', standard: '20GB', premium: 'Unlimited', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.625" /></svg> },
];
const getFeatureIcon = (status: 'Yes' | 'No' | 'Limited' | string) => {
    if (status === 'Yes') return <LuCircleCheck />;
    if (status === 'Limited') return <LucideXCircle />;
    if (status === 'No') return <LuX />;
    return <span className="text-gray-600 font-medium text-sm">{status}</span>;
};



export default function FeatureComparePoints({ state: $state, setValue }: {
    state: SubscriptionPlanEditorState,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) {
    const [state, setState] = useState<{
        subscription_plans: any[],
        comparison_points: {
            id: number,
            name: string,
            sort_order: string
        }[]
    }>();
    const [loading, setLoading] = useState(true);


    const load = async () => {
        setLoading(true);
        var r = await SubscriptionPlanService.all({ keyword: '' });
        if (r.success) {
            setState(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [])


    if (loading || !state) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
                <tr>
                    {/* Note: sticky on mobile helps keep the feature name visible while scrolling horizontally */}
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap sticky left-0 bg-gray-50 z-10">
                        Feature Module
                    </th>
                    {state.subscription_plans.map(plan => (
                        <th key={plan.id} scope="col" className={`px-6 py-4 text-center text-sm font-bold uppercase tracking-wider ${plan.id === TARGET_PLAN_ID ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-700'}`}>
                            {plan.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {/* Price Row (Sticky on Mobile) */}
                <tr className="border-t border-gray-300">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 sticky left-0 bg-white z-10">Monthly Price</td>
                    {state.subscription_plans.map(plan => (
                        <td key={plan.id} className={`px-6 py-4 whitespace-nowrap text-center text-base font-extrabold ${plan.id === TARGET_PLAN_ID ? 'text-indigo-600 bg-indigo-50' : 'text-gray-900'}`}>
                            ${plan.price}
                            <span className="text-sm font-normal text-gray-500">/mo</span>
                        </td>
                    ))}
                </tr>

                {/* Feature Rows */}
                {state?.comparison_points?.map(feature => (
                    <tr key={feature.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                            <div className="flex items-center">
                                <span className="ml-2">{feature.name}</span>
                            </div>
                        </td>
                        {state.subscription_plans.map(plan => {

                            return (<td className="px-6 py-4 whitespace-nowrap text-center">
                                {/* {getFeatureIcon(feature.basic)} */}
                            </td>);
                        })}

                    </tr>
                ))}


            </tbody>
        </table>
    )
}
