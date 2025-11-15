import { lazy, ReactNode, Suspense } from "react";
import CenterLoading from "@/components/common/CenterLoading";
import { Modal } from "@/components/common/Modal";
import { LeadState } from "../LeadDetail";
const LazyLeadProposalEditor = lazy(() => import('./LeadProposalEditor'));


export default function NewProposalTrigger({ state, onUpdate, children, className }: { state: LeadState, onUpdate: () => void, children?: ReactNode, className?: string }) {
    const openEditor = () => {
        const modal_id = Modal.show({
            title: 'Add Proposal',
            subtitle: 'Add proposal for lead ' + state.lead.internal_reference_number,
            maxWidth: 600,
            content: () => {
                return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                    <LazyLeadProposalEditor
                        lead_id={state.lead.id}
                        onSuccess={() => {
                            Modal.close(modal_id);
                            onUpdate();
                        }}
                        onCancel={() => {
                            Modal.close(modal_id);
                        }} />
                </Suspense>
            }
        })
    }


    return (
        <div className={className} onClick={openEditor}>{children}</div>
    )
}
