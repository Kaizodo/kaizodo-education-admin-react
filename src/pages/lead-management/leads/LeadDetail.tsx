import { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import {
    Mail,
    X, Phone,
} from 'lucide-react';
import StepBar from './components/LeadStatusStepper';
import CenterLoading from '@/components/common/CenterLoading';
import { useNavigate, useParams } from 'react-router-dom';
import { LeadService } from '@/services/LeadService';
import { Gender, User } from '@/data/user';
import { getLeadStatusName } from '@/data/Lead';
import { getOrganizationTypeName } from '@/data/Organization';
import { Badge } from '@/components/ui/badge';
import { GrUser, GrUserFemale } from 'react-icons/gr';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatDateTime, nameLetter } from '@/lib/utils';
import { LuFileText, LuMapPin, LuPencil, LuPlus, LuUserPlus, LuUserX } from 'react-icons/lu';
import { IconType } from 'react-icons/lib';
import { Modal } from '@/components/common/Modal';
import { SideDrawerClose } from '@/components/common/SideDrawer';
import Btn from '@/components/common/Btn';
import LeadActivityTab from './components/LeadActivityTab';
import LeadAppointmentsTab from './components/LeadAppointmentsTab';
import LeadProposalsTab from './components/LeadProposalsTab';
import LeadInvoicesTab from './components/LeadInvoicesTab';
import LeadNotificationsTab from './components/LeadNotificationsTab';
import LeadTasksTab from './components/LeadTasksTab';
import LeadNotesTab from './components/LeadNotesTab';
import { pickMultipleUsers } from '@/components/common/MultiUserPicker';
import { msg } from '@/lib/msg';
import { AppointmentStatus } from '@/data/Appointment';
const LazyLeadOrganizationEditor = lazy(() => import('./components/LeadOrganizationEditor'));
const LazyLeadContactEditor = lazy(() => import('../contacts/components/LeadContactEditor'));
const LazyLeadProposalDetail = lazy(() => import('./components/LeadProposalDetail'));




const AddBtn = ({ icon: Icon = LuPlus, children, onClick }: { icon?: IconType, children?: ReactNode, onClick?: () => void }) => {
    return (<div
        onClick={onClick}
        className='bg-orange-50 justify-center border border-orange-400 text-orange-600 rounded-xl p-3 gap-2 shadow flex flex-row items-center hover:bg-orange-100 cursor-pointer transition-all'
    >
        <Icon className='text-2xl' />
        <span className='text-sm font-bold'>{children}</span>
    </div>);
}

export type AppointmentUser = {
    id: number;
    appointment_id: number;
    user_id: number;
    is_contact: number;
}

export type ProposalTopup = {
    lead_id: number | null;
    proposal_id: number | null;
    topup_plan_id: number | null;
    name: string | null;
    topup_type: number;
    price: number;
    quantity: number;
    amount: number;
    cgst: number;
    sgst: number;
    igst: number;
    sac: string | null;
    hsn: string | null;
    created_at: string;
    updated_at: string;
};

export type Proposal = {
    id: number;
    internal_reference_number: string;
    lead_id: number | null;
    created_by_user_id: number | null;
    discount_plan_id: number | null;
    subscription_plan_id: number | null;
    subscription_plan_price_id: number | null;
    active: number;
    amount: number;
    duration_days: number;
    name: string | null;
    features: {
        id: number,
        text: string
    }[];
    purchase_token: string;
    datetime_expiry: string;
    created_at: string;
    updated_at: string;
    topup_plans: ProposalTopup[]
}

export type AppointmentLog = {
    id: number;
    appointment_id: number;
    created_by_user_id: number;
    status: AppointmentStatus;
    remarks?: string | null;
    datetime?: string | null;
    created_at: string;
    updated_at: string;
}

export type LeadUserRemark = {
    id: number;
    user_id: number;
    lead_id: number;
    is_private: boolean;
    remarks?: string | null;
    created_at: string;
    updated_at: string;
}

export type Appointment = {
    id: number;
    name: string;
    content: string;
    datetime: string;
    location: string;
    is_online: number;
    is_inbound: number;
    meeting_url: string;
    lead_id: number;
    created_by_user_id: string;
    status: number;
    created_at: string;
    updated_at: string | null;
    appointment_users: AppointmentUser[];
    appointment_logs: AppointmentLog[]
}


export function viewProposal(proposal: Proposal) {
    Modal.show({
        title: `Proposal :- ${proposal.internal_reference_number}`,
        subtitle: `${proposal.name} | ${formatDateTime(proposal.created_at)}`,
        maxWidth: 1000,
        content: () => {

            return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                <LazyLeadProposalDetail proposal={proposal} />
            </Suspense>
        }
    })
}


export type Lead = {
    id: number
    internal_reference_number: string
    prev_internal_reference_number: string,
    next_internal_reference_number: string,
    organization_id: number
    created_by_user_id: number
    lead_source_id: number
    contact_user_id: number
    status: number
    created_at: string
    updated_at: string
    lead_source_name: string
}

export type LeadOrganization = {
    id: number
    name: string
    logo_short: string | null
    logo_full: string | null
    organization_type: number
    address: string
    pincode: string
    country_name: string
    state_name: string
    city_name: string
    district_name: string | null
    locality_name: string
}



export type LeadState = {
    lead: Lead,
    users: User[],
    lead_users: {
        id: number,
        user_id: number,
        is_contact: number,
        created_at: string
    }[]
    organization: LeadOrganization | null,
    appointments: Appointment[],
    lead_user_remarks: LeadUserRemark[],
    proposals: Proposal[]
}

export default function LeadDetail() {
    const navigate = useNavigate();
    const { internal_reference_number } = useParams();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<LeadState>();
    const [tab, setTab] = useState<string>('activity');
    const [choosingTeam, setChoosingTeam] = useState(false);

    const pickTeam = async () => {
        setChoosingTeam(true);
        var picked_users = await pickMultipleUsers({
            title: 'Select team members',
            subtitle: 'Pick team members from existing employees',
            exclude_ids: state?.lead_users?.map?.(lu => lu.user_id) ?? [],

        });
        if (picked_users.length > 0) {
            var r = await LeadService.assignTeam({
                lead_id: state?.lead?.id ?? 0,
                user_ids: picked_users.map(u => u.id)
            });
            if (r.success) {
                msg.success('Team assigned');
                load();
            }
        }
        setChoosingTeam(false);
    }

    const openContactEditor = (user_id?: number) => {
        const modal_id = Modal.show({
            title: user_id ? 'Update Contact' : 'Add Contact',
            subtitle: state?.lead.internal_reference_number,
            maxWidth: 500,
            content: () => {

                return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                    <LazyLeadContactEditor
                        lead_id={state?.lead.id ?? 0}
                        user_id={user_id}
                        onSuccess={() => {
                            load();
                            Modal.close(modal_id);
                        }}
                        onCancel={() => {
                            Modal.close(modal_id);
                        }} />
                </Suspense>
            }
        })
    }


    const openOrganizationEditor = () => {
        const modal_id = Modal.show({
            title: state?.organization ? 'Update Organization' : 'Add Organization',
            subtitle: state?.lead.internal_reference_number,
            maxWidth: 1200,
            content: () => {

                return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                    <LazyLeadOrganizationEditor
                        lead_id={state?.lead.id ?? 0}
                        organization_id={state?.organization?.id}
                        onSuccess={() => {
                            load();
                            Modal.close(modal_id);
                        }}
                        onCancel={() => {
                            Modal.close(modal_id);
                        }} />
                </Suspense>
            }
        })
    }

    const load = async () => {
        setLoading(true);
        var r = await LeadService.detail(internal_reference_number as string);
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            navigate('/lead-management/leads');
        }
    }


    useEffect(() => {
        load();
    }, [internal_reference_number])

    if (!state || !internal_reference_number || loading) {
        return <CenterLoading className="h-screen relative" />
    }


    var active_proposal = state.proposals.find(p => !!p.active);


    return (
        <div className="h-screen bg-white shadow-2xl flex flex-col w-full">
            {/* Header / Top Bar */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="text-gray-700 font-medium">#{state.lead.internal_reference_number}</span>
                    <span className="text-green-600 font-medium">{getLeadStatusName(state.lead.status)}</span>
                    <span>Stage</span>
                </div>
                <SideDrawerClose>
                    <button className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors">
                        Close <X className="w-4 h-4 ml-1" />
                    </button>
                </SideDrawerClose>

            </div>

            <div className="flex overflow-auto flex-1 ">
                {/* Left Column (Details) */}
                <div className="w-[350px] flex-shrink-0 space-y-6 border-e p-6">
                    {state?.organization && <div
                        onClick={openOrganizationEditor}
                        className="space-y-2 bg-sky-50 border border-sky-300 rounded-lg p-2"
                    >
                        <div className='flex flex-row justify-between items-center gap-2'>
                            <h2 className="text-lg font-bold text-gray-900">{state.organization.name}</h2>
                            <Btn size='xs' variant={'outline'}><LuPencil /></Btn>
                        </div>
                        <span className='text-xs text-gray-500'>{getOrganizationTypeName(state.organization.organization_type)}</span>
                        {[state.organization.country_name, state.organization.state_name, state.organization.city_name, state.organization.locality_name, state.organization.pincode].filter(Boolean).length > 0 && <div className="flex items-center gap-1 text-xs">
                            <LuMapPin />
                            <span>{[state.organization.country_name, state.organization.state_name, state.organization.city_name, state.organization.locality_name, state.organization.pincode].filter(Boolean).join(', ')}</span>
                        </div>}
                    </div>}



                    {!state?.organization && <AddBtn onClick={openOrganizationEditor}>Add Organization</AddBtn>}




                    {!!active_proposal && (
                        <div className="p-2 bg-gradient-to-br from-yellow-50 to-white border border-yellow-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
                                    <LuFileText /> Proposal Sent
                                </span>
                                <Btn variant="outline" size="xs" onClick={() => active_proposal ? viewProposal(active_proposal) : {}}>View</Btn>
                            </div>

                            <div className="space-y-1">
                                <p className="text-base font-medium text-gray-700">
                                    Plan: <span className="text-yellow-700">{active_proposal.name}</span>
                                </p>
                                <p className="text-3xl font-bold text-gray-900">₹{active_proposal.amount}</p>
                                <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                                    <span>Created: {formatDateTime(active_proposal.created_at)}</span>
                                    <span>ID: #{active_proposal.internal_reference_number}</span>
                                    <span className="text-red-600">
                                        Expires: {formatDateTime(active_proposal.datetime_expiry)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Contact Details */}
                    <div className="pt-2 space-y-4">
                        <h3 className="text-lg font-semibold justify-between flex items-center text-gray-800 border-b border-gray-100 pb-2 mb-3">
                            <span>Contact Details</span>
                            {state.lead_users.length > 1 && <Badge>{state.lead_users.length}</Badge>}
                        </h3>
                        {state.lead_users.filter(lu => lu.is_contact == 1).map(contact => {
                            const user = state.users.find(u => u.id == contact.user_id);
                            if (!user) {
                                return null;
                            }
                            return (<div className={cn(
                                "flex   text-sm border rounded-lg p-2 ",
                                user.id === state.lead.contact_user_id && "bg-orange-50 border-orange-300 "
                            )} key={contact.id}>
                                <div className='flex flex-col flex-1'>
                                    <div className="flex items-center">
                                        {user.gender == Gender.Female && <GrUserFemale className="w-4 h-4 text-gray-400 mr-3" />}
                                        {user.gender == Gender.Male && <GrUser className="w-4 h-4 text-gray-400 mr-3" />}
                                        {user.gender == Gender.Other && <GrUser className="w-4 h-4 text-gray-400 mr-3" />}
                                        <span className="font-semibold text-gray-800">{user.first_name} {user.last_name}</span>
                                        <span className="ml-2 text-gray-500">{!!user.designation_name ? `(${user.designation_name})` : ''}</span>
                                    </div>
                                    {!!user.email && <div className="flex items-center">
                                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                                        <span className="text-blue-600 hover:underline cursor-pointer">
                                            {user.email}
                                        </span>
                                    </div>}
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                                        <span className="text-gray-700">{user.mobile}</span>
                                    </div>
                                </div>
                                <Btn size={'xs'} variant={'outline'} onClick={() => openContactEditor(user.id)}><LuPencil /></Btn>
                            </div>);
                        })}

                        <Btn onClick={() => openContactEditor()} size={'sm'} variant={'outline'}><LuUserPlus /> Add Contacts</Btn>
                    </div>

                    {/* Salesperson */}
                    <div className="pt-2">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3">
                            Team
                        </h3>
                        {state.lead_users.filter(lu => lu.is_contact == 0).map(contact => {
                            const user = state.users.find(u => u.id == contact.user_id);
                            if (!user) {
                                return null;
                            }
                            return (<div className={cn(
                                "flex   text-sm border rounded-lg p-2 mb-3",
                                user.id === state.lead.created_by_user_id && "bg-orange-50 border-orange-300 "
                            )} key={contact.id}>
                                <div className='flex flex-col flex-1'>
                                    <div className='flex flex-row gap-1'>
                                        <Avatar >
                                            <AvatarImage src={user.image}></AvatarImage>
                                            <AvatarFallback className='bg-orange-200 text-orange-800 font-bold'>{nameLetter(user.first_name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center">
                                            {user.gender == Gender.Female && <GrUserFemale className="w-4 h-4 text-gray-400 mr-3" />}
                                            {user.gender == Gender.Male && <GrUser className="w-4 h-4 text-gray-400 mr-3" />}
                                            {user.gender == Gender.Other && <GrUser className="w-4 h-4 text-gray-400 mr-3" />}
                                            <span className="font-semibold text-gray-800">{user.first_name} {user.last_name}</span>
                                            <span className="ml-2 text-gray-500">{!!user.designation_name ? `(${user.designation_name})` : ''}</span>
                                        </div>
                                    </div>
                                    {!!user.email && <div className="flex items-center">
                                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                                        <span className="text-blue-600 hover:underline cursor-pointer">
                                            {user.email}
                                        </span>
                                    </div>}
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                                        <span className="text-gray-700">{user.mobile}</span>
                                    </div>
                                    {user.id === state.lead.created_by_user_id && <p className="text-xs text-gray-500">
                                        Lead created {formatDateTime(state.lead.created_at)}
                                    </p>}
                                </div>
                                <Btn size={'xs'} variant={'destructive'} onClick={() => openContactEditor(user.id)}><LuUserX /></Btn>
                            </div>);
                        })}

                        <Btn onClick={pickTeam} loading={choosingTeam} size={'sm'} variant={'outline'}><LuUserPlus /> Add Team Members</Btn>
                    </div>
                </div>

                {/* Right Column (Activity/Timeline) */}
                <div className="flex-1 space-y-6 p-6">
                    <div className="pb-4 border-b border-gray-100 w-full">
                        <div className="flex items-center text-sm mb-3">
                            <span className="text-gray-500">Stage:</span>
                            <span className="font-medium text-gray-800 ml-1 mr-4">{getLeadStatusName(state.lead.status)}</span>
                            <span className="text-gray-500">Been this stage for:</span>
                            <span className="font-bold text-gray-800 ml-1">48 minutes</span>
                        </div>
                        <StepBar status={state.lead.status} />
                    </div>
                    {/* Action Tabs */}
                    <div className="flex  border-b border-gray-100">
                        {[
                            { id: 'activity', name: 'Activity', count: 0 },
                            { id: 'appointments', name: 'Appointments', count: state.appointments.length },
                            { id: 'proposals', name: 'Proposals', count: state.proposals.length },
                            { id: 'invoices', name: 'Invoices', count: 0 },
                            { id: 'notifications', name: 'Notifications', count: 0 },
                            { id: 'tasks', name: 'Tasks', count: 0 },
                            { id: 'notes', name: 'Notes', count: state.lead_user_remarks.length }].map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`py-2 flex-1 text-center text-sm cursor-pointer ${tab === t.id
                                        ? 'border-b-2 border-green-600 text-green-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {t.name} {t.count > 0 && (
                                        <span className="ml-1 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{t.count}</span>
                                    )}
                                </div>
                            ))}
                    </div>

                    {tab == 'activity' && <LeadActivityTab state={state} onUpdate={load} />}
                    {tab == 'appointments' && <LeadAppointmentsTab state={state} onUpdate={load} />}
                    {tab == 'proposals' && <LeadProposalsTab state={state} onUpdate={load} />}
                    {tab == 'invoices' && <LeadInvoicesTab />}
                    {tab == 'notifications' && <LeadNotificationsTab />}
                    {tab == 'tasks' && <LeadTasksTab />}
                    {tab == 'notes' && <LeadNotesTab state={state} onUpdate={load} />}
                </div>
            </div>
        </div>
    );
};



