import { formatDateTime } from "@/lib/utils";
import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { GoOrganization } from "react-icons/go";

import { Link } from "react-router-dom";
import { getOrganizationTypeName } from "@/data/Organization";
import { GrUserFemale, GrUser } from "react-icons/gr";
import { Gender } from "@/data/user";
import LeadStatusStepper from "./LeadStatusStepper";


export default function LeadCard({ lead, onClick }: { lead: any, onClick: () => void }) {
    return (
        <Link to={'/lead-management/leads/' + lead.internal_reference_number} onClick={onClick}>
            <div className="bg-white p-4  rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg">
                <div className="flex items-center text-xs text-gray-500 justify-between">
                    <span className="text-purple-500 font-medium">{lead.internal_reference_number}</span>
                    <span>{formatDateTime(lead.created_at)}</span>
                </div>
                {lead.organization && <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-900 flex items-center text-sm gap-2">
                        <GoOrganization className="text-2xl" />
                        <div className="flex flex-col">
                            <span className="text-sm truncate">{lead.organization.name}</span>
                            <span className="text-xs   text-gray-500">{getOrganizationTypeName(lead.organization.organization_type)}</span>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-50 rounded-full font-medium">
                        Via {lead.lead_source_name}
                    </span>
                </div>}
                {!!lead.contact_user && !lead.organization && <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-900 flex items-center text-sm gap-2">
                        {lead.contact_user.gender == Gender.Female && <GrUserFemale className="text-2xl" />}
                        {lead.contact_user.gender == Gender.Male && <GrUser className="text-2xl" />}
                        {lead.contact_user.gender == Gender.Other && <GrUser className="text-2xl" />}
                        <div className="flex flex-col">
                            <span>{lead.contact_user.first_name} {lead.contact_user.last_name}</span>
                            <span className="flex flex-row items-center gap-1 text-xs text-gray-500"><LuPhone />{lead.contact_user.mobile}</span>
                            {!!lead.contact_user.email && <span className="flex flex-row items-center gap-1 text-xs text-gray-500"><LuMail />{lead.contact_user.email}</span>}
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-50 rounded-full font-medium">
                        Via {lead.lead_source_name}
                    </span>
                </div>}



                <div className="text-sm text-gray-700 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                        {!!lead.organization && !!lead.contact_user && <div className="flex flex-row items-center gap-3">
                            <div className="flex items-center gap-1">
                                <LuPhone />
                                <span>{lead.contact_user.mobile}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LuMail />
                                <span>{lead.contact_user.email}</span>
                            </div>
                        </div>}
                    </div>
                    {!!lead.organization && <div className="flex items-center justify-between text-xs">
                        {[lead.organization.country_name, lead.organization.state_name, lead.organization.city_name, lead.organization.locality_name, lead.organization.pincode].filter(Boolean).length > 0 && <div className="flex items-center gap-1">
                            <LuMapPin />
                            <span>{[lead.organization.country_name, lead.organization.state_name, lead.organization.city_name, lead.organization.locality_name, lead.organization.pincode].filter(Boolean).join(', ')}</span>
                        </div>}
                    </div>}

                </div>


                <LeadStatusStepper size="sm" status={lead.status} />
            </div>
        </Link>
    );
}