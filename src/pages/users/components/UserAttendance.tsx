import { useEffect, useState } from 'react';

import {
    CheckCircle,
    XCircle,
    CalendarX,
    Coffee,
    Sun,

} from 'lucide-react';
import { AttendanceStatus, getDefaultUser, User, UserType } from '@/data/user';
import { useSetValue } from '@/hooks/use-set-value';
import { UserAttendanceService } from '@/services/UserAttendanceService';
import moment from 'moment';
import CenterLoading from '@/components/common/CenterLoading';
import StatsSkeleton from '@/components/common/skeletons/StatsSkeleton';
import { Calendar } from '@/components/common/Calendar';
import { ModalBody } from '@/components/common/Modal';



type Props = {
    user_type: UserType,
    user_id: number,
    title?: string,
    subtitle?: string
}



export default function UserAttendance({ user_id, user_type }: Props) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<{
        user: User,
        data: {
            date: string,
            type: "present" | "absent" | "holiday" | "weekoff" | "leave"
        }[],
        leaves: {
            id: number;
            leave_type_name: string;
            start_date: string;
            end_date: string;
            reason: string;
            created_at: string;
            updated_at: string;
        }[],
        holidays: {
            id: number,
            date: string,
            holiday_name: string
        }[],
        attendance: {
            id: number,
            status: AttendanceStatus,
            in_datetime: string,
            out_datetime: string
        }[]
    }>({
        user: getDefaultUser(),
        data: [],
        leaves: [],
        holidays: [],
        attendance: []
    });

    const [filters, setFilters] = useState<any>({
        date: new Date(),
        debounce: true,
        page: 1,
        keyword: '',
        user_id: user_id,
        user_type: user_type == UserType.Student ? UserType.Student : undefined,
    });

    const setFilter = useSetValue(setFilters);

    const load = async () => {
        setLoading(true);

        let r;
        if (user_type == UserType.Student) {
            r = await UserAttendanceService.searchStudentMonthly({ ...filters, date: moment(filters.date).format('Y-MM-DD') });
        } else {
            r = await UserAttendanceService.searchMonthly({ ...filters, date: moment(filters.date).format('Y-MM-DD') });
        }
        if (r.success) {
            setState(r.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (user_id) {
            load();
        }
    }, [filters, user_id]);


    return (
        <ModalBody>
            {loading && <StatsSkeleton cols={5} className={"h-[200px]"} />}
            {!loading && <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="text-center bg-white shadow rounded p-3">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{state.data.filter(d => d.type == 'present').length}</p>
                    <p className="text-sm text-gray-600">Present</p>
                </div>
                <div className="text-center bg-white shadow rounded p-3">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{state.data.filter(d => d.type == 'absent').length}</p>
                    <p className="text-sm text-gray-600">Absent</p>
                </div>
                <div className="text-center bg-white shadow rounded p-3">
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CalendarX className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{state.data.filter(d => d.type == 'leave').length}</p>
                    <p className="text-sm text-gray-600">Leaves</p>
                </div>
                <div className="text-center bg-white shadow rounded p-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sun className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{state.data.filter(d => d.type == 'holiday').length}</p>
                    <p className="text-sm text-gray-600">Holidays</p>
                </div>
                <div className="text-center bg-white shadow rounded p-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Coffee className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-600">{state.data.filter(d => d.type == 'weekoff').length}</p>
                    <p className="text-sm text-gray-600">Week Off's</p>
                </div>
            </div>}


            {loading && <CenterLoading className='absolute' />}
            <div className='flex flex-row gap-3'>
                <div className='flex-1'>
                    <Calendar
                        actionsClass="items-end"
                        className="w-full bg-white rounded-lg border"
                        date={moment().valueOf()}
                        onChange={(m) => setFilter("date")(m.format("Y-MM-DD"))}
                        cell={(date) => {
                            const dateStr = date.format("YYYY-MM-DD");

                            const data = state.data.find((d) => d.date === dateStr);
                            const holiday = state.holidays.find((h) =>
                                moment(h.date).isSame(dateStr, "day")
                            );
                            const leave = state.leaves.find((l) =>
                                moment(dateStr).isBetween(
                                    moment(l.start_date),
                                    moment(l.end_date),
                                    "day",
                                    "[]"
                                )
                            );
                            const attendance = state.attendance.find((a) =>
                                moment(a.in_datetime).isSame(dateStr, "day")
                            );



                            let bgColor = "";
                            let textColor = "text-black";

                            switch (data?.type) {
                                case "present":
                                    bgColor = "bg-green-100";
                                    textColor = "text-green-800";
                                    break;
                                case "absent":
                                    bgColor = "bg-red-100";
                                    textColor = "text-red-800";
                                    break;
                                case "holiday":
                                    bgColor = "bg-blue-100";
                                    textColor = "text-blue-800";
                                    break;
                                case "weekoff":
                                    bgColor = "bg-yellow-100";
                                    textColor = "text-yellow-800";
                                    break;
                                case "leave":
                                    bgColor = "bg-purple-100";
                                    textColor = "text-purple-800";
                                    break;
                                default:
                                    bgColor = "";
                                    textColor = "text-black";
                            }

                            return (
                                <div
                                    className={`flex flex-col items-center justify-center px-0 py-2 h-full text-[11px] ${bgColor} ${textColor}`}>
                                    <div className="text-sm font-semibold">{date.format("DD")}</div>

                                    {/* Attendance */}
                                    {attendance && (
                                        <div className="text-[10px] text-gray-700">
                                            {moment(attendance.in_datetime).isValid() && (
                                                <>In:{moment(attendance.in_datetime).format("LT")}</>
                                            )}
                                            {moment(attendance.out_datetime).isValid() && (
                                                <> - Out:{moment(attendance.out_datetime).format("LT")}</>
                                            )}
                                        </div>

                                    )}

                                    {/* Leave */}
                                    {leave && (
                                        <div className="text-[10px] text-purple-700 font-medium">
                                            {leave.leave_type_name}
                                        </div>
                                    )}

                                    {/* Holiday */}
                                    {holiday && (
                                        <div className="text-[10px] text-blue-700 font-medium">
                                            {holiday.holiday_name}
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    />

                </div>


                <div className="min-w-[300px] space-y-4 rounded-lg bg-white shadow border p-3">
                    {/* Leaves */}
                    <div>
                        <h3 className="font-semibold text-sm text-gray-700 mb-2 border-b pb-1">
                            Leaves
                        </h3>
                        {state.leaves.length === 0 ? (
                            <p className="text-gray-500 text-xs italic">No leaves</p>
                        ) : (
                            <ul className="space-y-2 text-xs">
                                {Object.entries(
                                    state.leaves.reduce((acc, leave) => {
                                        const key = moment(leave.start_date).format("YYYY-MM-DD");
                                        acc[key] = acc[key] || [];
                                        acc[key].push(leave);
                                        return acc;
                                    }, {} as Record<string, typeof state.leaves>)
                                )
                                    .sort(([a], [b]) => moment(a).diff(moment(b)))
                                    .map(([date, leaves]) => (
                                        <li
                                            key={date}
                                            className="p-2 rounded-md bg-purple-50 border border-purple-100"
                                        >
                                            <div className="font-medium text-purple-800 text-sm">
                                                {moment(date).format("DD MMM, YYYY")}
                                            </div>
                                            <ul className="mt-1 space-y-1">
                                                {leaves.map((leave) => (
                                                    <li key={leave.id}>
                                                        <span className="font-medium">{leave.leave_type_name}</span>
                                                        {leave.end_date !== leave.start_date && (
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                → {moment(leave.end_date).format("DD MMM, YYYY")}
                                                            </span>
                                                        )}
                                                        {leave.reason && (
                                                            <div className="text-gray-500 text-[11px]">
                                                                Reason: {leave.reason}
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>

                    {/* Holidays */}
                    <div>
                        <h3 className="font-semibold text-sm text-gray-700 mb-2 border-b pb-1">
                            Holidays
                        </h3>
                        {state.holidays.length === 0 ? (
                            <p className="text-gray-500 text-xs italic">No holidays</p>
                        ) : (
                            <ul className="space-y-2 text-xs">
                                {Object.entries(
                                    state.holidays.reduce((acc, holiday) => {
                                        const key = moment(holiday.date).format("YYYY-MM-DD");
                                        acc[key] = acc[key] || [];
                                        acc[key].push(holiday);
                                        return acc;
                                    }, {} as Record<string, typeof state.holidays>)
                                )
                                    .sort(([a], [b]) => moment(a).diff(moment(b)))
                                    .map(([date, holidays]) => (
                                        <li
                                            key={date}
                                            className="p-2 rounded-md bg-blue-50 border border-blue-100"
                                        >
                                            <div className="font-medium text-blue-800 text-sm">
                                                {moment(date).format("DD MMM, YYYY")}
                                            </div>
                                            <ul className="mt-1 space-y-1">
                                                {holidays.map((holiday) => (
                                                    <li key={holiday.id}>{holiday.holiday_name}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                </div>


            </div>


        </ModalBody>
    );
};

