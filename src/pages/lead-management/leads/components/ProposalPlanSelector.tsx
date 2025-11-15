import { useState } from 'react';
import { SubscriptionPlan } from './LeadProposalEditor';
import { formatDays } from '@/lib/utils';
import { LuCircle, LuCircleCheck } from 'react-icons/lu';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';



export default function ProposalPlanSelector({ searching, subscription_plans, subscription_plan_id, subscription_plan_price_id, setValue }: {
    searching?: boolean,
    subscription_plans: SubscriptionPlan[],
    subscription_plan_id: number,
    subscription_plan_price_id: number,
    setValue: (...keys: string[]) => (...values: any[]) => void
}) {


    const [showFeatures, setShowFeatures] = useState(false);

    const active_subscription_plan = subscription_plans.find(p => p.id === subscription_plan_id) ?? subscription_plans[0];


    return (
        <div className="flex bg-white  rounded-2xl border border-gray-200">
            {!searching && subscription_plans.length == 0 && <NoRecords title='No Plans found' className="w-full" />}
            {searching && <CenterLoading className="relative h-[400px] w-full" />}
            {!searching && subscription_plans.length > 0 && <>
                <div className="w-2/6   border-r border-gray-200 p-2 space-y-2 flex-shrink-0">
                    <h3 className="text-xs font-semibold uppercase text-gray-500 px-2 pt-1 mb-2 tracking-wider">Plan Options</h3>
                    {subscription_plans.map(subscription_plan => {
                        const isActive = subscription_plan.id === active_subscription_plan?.id;
                        const baseClasses = "w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
                        const activeClasses = `bg-indigo-600 text-white shadow-lg shadow-gray-400/30 transform scale-[1.02]`;
                        const inactiveClasses = "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700";

                        return (
                            <button
                                key={subscription_plan.id}
                                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                onClick={() => setValue('subscription_plan_id')(subscription_plan.id)}
                            >
                                {subscription_plan.name}
                            </button>
                        );
                    })}
                </div>


                {!!active_subscription_plan && <div className="w-3/5 p-5 flex-grow">
                    <h2 className="text-xl font-extrabold text-gray-800">{active_subscription_plan.name} Package</h2>
                    <span className='text-xs mb-4 flex'>{active_subscription_plan.description}</span>
                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase text-gray-600 mb-2">Pricing Details</h3>

                        <div className="grid grid-cols-2 gap-3">
                            {active_subscription_plan.pricing.map(pricing => {
                                return (<label onClick={() => setValue('subscription_plan_price_id')(pricing.id)} key={pricing.id} className="flex hover:bg-gray-100 cursor-pointer items-center  gap-2 flex-1 p-3 rounded-xl bg-white shadow border border-gray-100">
                                    {pricing.id === subscription_plan_price_id && <LuCircleCheck className='text-xl' />}
                                    {pricing.id !== subscription_plan_price_id && <LuCircle className='text-xl' />}
                                    <div>
                                        <p className={`text-sm font-medium`}>₹{pricing.price}</p>
                                        <span className="text-xs">{formatDays(pricing.duration_days)}</span>
                                    </div>
                                </label>);
                            })}

                        </div>
                    </div>
                    {!showFeatures && <Btn onClick={() => setShowFeatures(true)} size={'xs'} variant={'outline'}>Show Features </Btn>}
                    {!!showFeatures && <div>
                        <h3 className="text-xs font-bold uppercase text-gray-600 mb-3">Included Features</h3>
                        <ul className="space-y-2">
                            {active_subscription_plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-700">
                                    <svg className={`w-4 h-4 mr-2 mt-1 flex-shrink-0 `} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className='leading-tight'>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>}


                </div>}
            </>}


        </div>
    );
};

