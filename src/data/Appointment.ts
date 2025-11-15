export const enum AppointmentStatus {
    Pending = 0,
    Rescheduled = 1,
    Completed = 2,
    Cancelled = 3,
    NoShow = 4,
}

export const AppointmentStatusArray = [
    { id: AppointmentStatus.Pending, name: 'Awaiting' },
    { id: AppointmentStatus.Rescheduled, name: 'Rescheduled' },
    { id: AppointmentStatus.Completed, name: 'Completed' },
    { id: AppointmentStatus.Cancelled, name: 'Cancelled' },
    { id: AppointmentStatus.NoShow, name: 'No Show' },
];

export function getAppointmentStatusName(status: AppointmentStatus) {
    return AppointmentStatusArray.find(a => a.id === status)?.name ?? '';
}

export const AppointmentStatusMeta = {
    [AppointmentStatus.Pending]: { name: "Pending", color: "gray" },
    [AppointmentStatus.Rescheduled]: { name: "Rescheduled", color: "orange" },
    [AppointmentStatus.Completed]: { name: "Completed", color: "green" },
    [AppointmentStatus.Cancelled]: { name: "Cancelled", color: "red" },
    [AppointmentStatus.NoShow]: { name: "No Show", color: "rose" },
} as const;


export function getAppointmentStatusMeta(status: AppointmentStatus) {
    return AppointmentStatusMeta[status] ?? { name: "Unknown", color: "gray" };
}