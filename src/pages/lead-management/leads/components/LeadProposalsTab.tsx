import { LuArrowRight, LuPlus } from "react-icons/lu";
import { LeadState, Proposal, viewProposal } from "../LeadDetail";
import LeadSection from "./LeadSection";
import NewProposalTrigger from "./NewProposalTrigger";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, CalendarDays, Tag } from "lucide-react";
import Btn from "@/components/common/Btn";
import { formatDateTime, formatDays } from "@/lib/utils";

function ProposalItem({ proposal, onView }: {
    proposal: Proposal;
    onView?: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-6 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex items-start gap-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-700 rounded-lg">
                    <FileText size={24} />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{proposal.name}</h3>
                        {proposal.active ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                        ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Inactive</span>
                        )}
                    </div>

                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-3">
                        <span className="flex items-center gap-1">
                            <Tag size={14} /> #{proposal.internal_reference_number}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarDays size={14} /> {formatDateTime(proposal.created_at)}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                            <Clock size={14} /> Expires {formatDistanceToNow(new Date(proposal.datetime_expiry), { addSuffix: true })}
                        </span>
                    </div>

                    {proposal.features?.length > 0 && (
                        <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                            {proposal.features.slice(0, 3).map((f) => (
                                <li key={f.id}>{f.text}</li>
                            ))}
                            {proposal.features.length > 3 && (
                                <li className="text-gray-400">+{proposal.features.length - 3} more</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end  gap-2">
                <Btn size={'xs'} variant={'outline'} onClick={onView}>View <LuArrowRight /></Btn>

                <span className="text-2xl font-bold text-gray-900">₹{proposal.amount}</span>
                <span className="text-xs text-gray-500">{formatDays(proposal.duration_days)}</span>

            </div>
        </div>
    );
}

export default function LeadProposalsTab({ state, onUpdate }: { state: LeadState, onUpdate: () => void }) {




    return (
        <LeadSection title="Proposals" btn_title="Add Proposal" action={<NewProposalTrigger state={state} onUpdate={onUpdate}>
            <button
                className="text-sm text-green-600 hover:underline flex items-center">
                <LuPlus className="w-4 h-4 mr-1" /> Create Proposal
            </button>
        </NewProposalTrigger>}>


            <div className="space-y-3">
                {state.proposals.map(proposal => {
                    return <ProposalItem proposal={proposal} onView={() => viewProposal(proposal)} />
                })}
            </div>

        </LeadSection>
    )
}
