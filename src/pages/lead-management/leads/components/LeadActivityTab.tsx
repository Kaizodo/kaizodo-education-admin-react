import {
    Mail,
    Repeat, Zap,
} from 'lucide-react';
import LeadAppointmentsTab from './LeadAppointmentsTab';
import { LeadState } from '../LeadDetail';
import LeadProposalsTab from './LeadProposalsTab';








const ActivityItem: React.FC<{
    type: string;
    details: string;
    description: string;
    time: string;
    icon: React.ElementType;
    iconColor: string;
    dotColor: string;
    isStageChange?: boolean;
}> = ({ type, details, description, time, icon: Icon, iconColor, dotColor, isStageChange }) => (
    <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center pt-1">
            <div className={`w-4 h-4 rounded-full ${dotColor} flex items-center justify-center text-white`}>
                <Icon className={`w-2 h-2 ${iconColor === 'text-green-500' ? 'text-white' : iconColor}`} />
            </div>
            <div className="w-px h-full bg-gray-200 my-1"></div>
        </div>
        <div className="flex-1 flex justify-between text-sm pb-2">
            <div>
                <p className="font-semibold text-gray-800">
                    {isStageChange && <span className="text-green-600 mr-1">→ Stage:</span>}
                    {type}
                    <span className="text-gray-500 font-normal ml-1">Received → {details}</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">{description}</p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{time}</span>
        </div>
    </div>
);


export default function LeadActivityTab({ state, onUpdate }: { state: LeadState, onUpdate: () => void }) {
    return (
        <>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-blue-800">
                        <Repeat className="w-4 h-4 mr-2" />
                        <span className="font-semibold">Active Sequence</span>
                        <span className="ml-1 font-medium text-gray-700">: Proposals Sequence</span>
                    </div>
                    <span className="text-blue-600 hover:underline cursor-pointer">Change</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                    <div className="flex justify-between mt-1 pt-2 border-t border-blue-100">
                        <span>Next drip</span>
                        <span className="font-semibold text-gray-800">Follow up proposal</span>
                    </div>
                    <p className="text-xs mt-1 text-gray-500">Scheduled for Tomorrow 12:39 PM</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3">
                    Latest Activity
                </h3>
                <div className="space-y-4">
                    {/* Activity 1 */}
                    <ActivityItem
                        type="Email Delivered"
                        details="Proposal Sent"
                        description="Proposal has been sent the message to the customer's email."
                        time="Today 9:48 AM"
                        icon={Mail}
                        iconColor="text-blue-500"
                        dotColor="bg-blue-500"
                    />

                    {/* Activity 2 */}
                    <ActivityItem
                        type="Stage: Request Received"
                        details="Proposal Sent"
                        description="Deal #192748 has been moved to the Proposal Sent stage."
                        time="Today 9:48 AM"
                        icon={Zap}
                        iconColor="text-green-500"
                        dotColor="bg-green-500"
                        isStageChange
                    />
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                        Show more
                    </span>
                </div>
            </div>

            <LeadAppointmentsTab state={state} onUpdate={onUpdate} />
            <LeadProposalsTab state={state} onUpdate={onUpdate} />

        </>
    )
}
