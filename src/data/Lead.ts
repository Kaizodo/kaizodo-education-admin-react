export enum LeadStatus {
    Outreach = 0,      // New lead, not contacted yet
    Prospect = 1,      // Lead responded or showed interest
    Qualified = 2,     // Lead fits criteria (budget/need/timeline/etc.)
    Engaged = 3,       // Active discussion (calls, demo, follow-ups)
    Negotiation = 4,   // Proposal/pricing/terms being finalized
    Closed = 5,     // Deal  closed (Won / Lost will be set on closure status)
}
export const LeadStatusArray = [
    { id: LeadStatus.Outreach, name: "Outreach" },
    { id: LeadStatus.Prospect, name: "Prospect" },
    { id: LeadStatus.Qualified, name: "Qualified" },
    { id: LeadStatus.Engaged, name: "Engaged" },
    { id: LeadStatus.Negotiation, name: "Negotiation" },
    { id: LeadStatus.Closed, name: "Closed" },
];

export function getLeadStatusName(id: number) {
    return LeadStatusArray.find(s => s.id === id)?.name ?? "";
}
