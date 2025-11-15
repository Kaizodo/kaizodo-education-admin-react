import { lazy, Suspense } from "react";
import { Appointment, LeadState } from "../LeadDetail";
import LeadSection from "./LeadSection";
import {
    Clock, MapPin, Calendar,
} from 'lucide-react';
import CenterLoading from "@/components/common/CenterLoading";
import { Modal, ModalBody } from "@/components/common/Modal";
import NoRecords from "@/components/common/NoRecords";
import { LuCalendarX2, LuClipboardList, LuMessageSquareQuote, LuPencil, LuPlus } from "react-icons/lu";
import Btn from "@/components/common/Btn";
import { cn, formatDate, formatDateTime, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SafeHtml from "@/components/common/SafeHtml";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { AppointmentStatus, getAppointmentStatusMeta, getAppointmentStatusName } from "@/data/Appointment";


const LazyAppointmentEditorDialog = lazy(() => import('../../../appointments/components/AppointmentEditorDialog'));
const LazyAppointmentStatusDialog = lazy(() => import('../../../appointments/components/AppointmentStatusDialog'));



const AppointmentItem = ({ appointment, state, onEditClick, onStatusClick }: {
    appointment: Appointment, state: LeadState,
    onEditClick: () => void,
    onStatusClick: () => void
}) => {
    const contacts = state.users.filter(u => appointment.appointment_users.filter(au => au.is_contact == 1).map(au => au.user_id).includes(u.id));
    const employees = state.users.filter(u => appointment.appointment_users.filter(au => au.is_contact == 0).map(au => au.user_id).includes(u.id));

    const showAgenda = () => {
        Modal.show({
            title: appointment.name,
            subtitle: formatDateTime(appointment.datetime),
            maxWidth: 500,
            content: () => {
                return (<>
                    <ModalBody>
                        <SafeHtml html={appointment.content} />
                    </ModalBody>
                </>);
            }
        })
    }

    const canAddLogs = ![
        AppointmentStatus.Cancelled,
        AppointmentStatus.Completed,
        AppointmentStatus.NoShow
    ].includes(appointment.status);

    return (
        <div className="p-4 border border-gray-200 rounded-xl space-y-2 relative">
            <div className="flex flex-row items-start gap-3">
                <div className="flex flex-row flex-1 items-start gap-3">
                    <span className="font-medium">{appointment.name}</span>
                    <Btn size={'xs'} variant={'outline'} onClick={showAgenda}>View Agenda <LuClipboardList /></Btn>
                    <Badge className="bg-sky-100 text-sky-600">{getAppointmentStatusName(appointment.status)}</Badge>
                </div>
                <Badge>{appointment.is_inbound ? 'Client Visit' : 'Team Visit'}</Badge>
                {canAddLogs && <>
                    <Btn size={'xs'} variant={'outline'} onClick={onStatusClick}><LuPlus /> Status</Btn>
                    <Btn size={'xs'} variant={'outline'} onClick={onEditClick}><LuPencil /></Btn>
                </>}

            </div>
            <div className="text-sm">
                <span className="font-semibold text-orange-500">{appointment.is_online ? 'Online Meeting' : 'On-Site Meeting'}</span>
                <span className="text-gray-500 ml-1">with {contacts.map(u => `${u.first_name} ${u.last_name}`).join(', ')}</span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
                <div className="flex flex-row flex-wrap gap-2">
                    {appointment.appointment_logs.map(log => {
                        const user = state.users.find(u => u.id === log.created_by_user_id);
                        const meta = getAppointmentStatusMeta(log.status);

                        return (
                            <div
                                key={log.id}
                                className={cn(
                                    `p-2 rounded-lg border flex flex-col self-start bg-${meta.color}-50 border-${meta.color}-500`
                                )}
                            >
                                <div className="flex flex-row gap-3 items-center">
                                    <span className={`text-${meta.color}-800 font-medium`}>
                                        {meta.name}
                                    </span>
                                    {!!log.datetime && <span>{formatDateTime(log.datetime)}</span>}
                                </div>

                                {!!log.remarks && (
                                    <div className="text-xs text-primary flex flex-row items-center gap-1">
                                        <LuMessageSquareQuote />
                                        <span>{log.remarks}</span>
                                    </div>
                                )}

                                <span className="text-xs">
                                    Updated by {user?.first_name} {user?.last_name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-row gap-3">
                    {appointment.appointment_logs.filter(al => al.status === AppointmentStatus.Rescheduled).length > 0 && <span>Initial time was :- </span>}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(appointment.datetime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatTime(appointment.datetime, 'Y-MM-DD HH:mm:ss')}</span>
                    </div>
                </div>
                {!appointment.is_online && <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{appointment.location}</span>
                </div>}
                {!!appointment.is_online && <div className="flex items-start">
                    <TbDeviceComputerCamera className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <a className="text-blue-500 hover:underline cursor-pointer" href={appointment.meeting_url} target="_blank">{appointment.meeting_url}</a>
                </div>}
            </div>
            <div className="flex flex-row justify-between">
                <span className="text-sm font-medium text-gray-800">{employees.map(u => `${u.first_name} ${u.last_name}`).join(', ')}</span>
                <span className="text-xs text-gray-500">Created at - {formatDateTime(appointment.created_at)}</span>
            </div>
        </div>
    )
};


export default function LeadAppointmentsTab({ state, onUpdate }: { state: LeadState, onUpdate: () => void }) {


    const openEditor = (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Update Appointment' : 'Add Appointment',
            subtitle: 'Provide appointment details and track',
            maxWidth: 600,
            content: () => {

                return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                    <LazyAppointmentEditorDialog
                        id={id}
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


    const openStatusEditor = (appointment: Appointment) => {
        const modal_id = Modal.show({
            title: appointment.name,
            subtitle: 'Add update on appointment',
            maxWidth: 400,
            content: () => {

                return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                    <LazyAppointmentStatusDialog
                        id={appointment.id}
                        onSuccess={() => {
                            Modal.close(modal_id);
                            onUpdate();
                        }}
                    />
                </Suspense>
            }
        })
    }

    return (<LeadSection title="Appointments" btn_title="Create appointment" onBtnClick={() => openEditor()}>
        {state.appointments.length == 0 && <NoRecords className="min-h-40" icon={LuCalendarX2} title="No Appointments" subtitle="" action={<Btn size={'xs'} variant={'outline'} onClick={() => openEditor()}><LuPlus />Add New</Btn>} />}
        {state.appointments.length > 0 && <div className="space-y-4">
            {state.appointments.map((appointment, index) => (
                <AppointmentItem
                    key={index}
                    appointment={appointment}
                    state={state}
                    onEditClick={() => openEditor(appointment.id)}
                    onStatusClick={() => openStatusEditor(appointment)}
                />
            ))}
        </div>}
    </LeadSection>)
}
