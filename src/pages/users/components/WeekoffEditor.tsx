import { CalendarDaysIcon, Cog } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
import { UserService } from "@/services/UserService";
import CenterLoading from "@/components/common/CenterLoading";
import { msg } from "@/lib/msg";
import Btn from "@/components/common/Btn";

type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7; // Monday=1 ... Sunday=7
type WeekNumber = 1 | 2 | 3 | 4 | 5;

type WeekOffMode = 'fixed' | 'alternate';

type WeekOffState = {
    user_id: number,
    mode: WeekOffMode;
    fixed_days: DayNumber[];
    alternate_days: Partial<Record<DayNumber, WeekNumber[]>>; // <-- use Partial
};

const dayNumberToName = (day: DayNumber) => moment().day(day).format('dddd');

type FixedDayOffCardProps = {
    day: DayNumber;
    isSelected: boolean;
    onClick: () => void;
};

const FixedDayOffCard = ({ day, isSelected, onClick }: FixedDayOffCardProps) => (
    <div
        onClick={onClick}
        className={`
      flex flex-col items-center justify-center p-4 cursor-pointer rounded-lg transition-all duration-300
      ${isSelected ? 'bg-blue-100 ring-2 ring-blue-600' : 'bg-white hover:bg-gray-50'}
    `}
    >
        <div
            className={`
        w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full transition-colors duration-300
        ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
      `}
        >
            {dayNumberToName(day).slice(0, 1)}
        </div>
        <span className="mt-2 text-sm font-medium">{dayNumberToName(day)}</span>
    </div>
);
type Props = {
    user_id: number,
    registerCallback?: (callback: () => Promise<boolean>) => void
};

export default function WeekoffEditor({ user_id, registerCallback }: Props) {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const load = async () => {
        setLoading(true);
        var r = await UserService.loadWeekOffConfiguration(user_id);
        if (r.success) {
            setState(r.data);
        }
        setLoading(false);
    }

    const [state, setState] = useState<WeekOffState>({
        user_id: user_id,
        mode: 'fixed',
        fixed_days: [],
        alternate_days: {},
    });


    const save = async () => {
        setSaving(true);
        var r = await UserService.saveWeekOffConfiguration(state);
        if (r.success) {
            msg.success('Weekoff configuration saved');
        }
        setSaving(false);
        return r.success;
    }

    useEffect(() => {
        load();
    }, [user_id])




    useEffect(() => {
        registerCallback?.(async () => {
            setSaving(true);
            var r = await UserService.saveWeekOffConfiguration(state);
            if (r.success) {
                msg.success('Weekoff configuration saved');
            }
            setSaving(false);
            return r.success;
        });

    });


    const days: DayNumber[] = [1, 2, 3, 4, 5, 6, 7]; // Mon=1, ..., Sun=7
    const weeks: WeekNumber[] = [1, 2, 3, 4, 5];

    // Toggle fixed day
    const handleFixedDayToggle = (day: DayNumber) => {
        setState((prev) => ({
            ...prev,
            fixed_days: prev.fixed_days.includes(day)
                ? prev.fixed_days.filter((d) => d !== day)
                : [...prev.fixed_days, day],
        }));
    };

    // Toggle alternate week
    const handleAlternateWeekToggle = (day: DayNumber, week: WeekNumber) => {
        setState((prev) => {
            const newAlternate = { ...prev.alternate_days };
            if (!newAlternate[day]) newAlternate[day] = [];
            if (newAlternate[day].includes(week)) {
                newAlternate[day] = newAlternate[day].filter((w) => w !== week);
                if (newAlternate[day].length === 0) delete newAlternate[day];
            } else {
                newAlternate[day] = [...newAlternate[day], week].sort((a, b) => a - b);
            }
            return { ...prev, alternate_days: newAlternate };
        });
    };

    const handleModeChange = (mode: WeekOffMode) => {
        setState((prev) => ({ ...prev, mode }));
    };



    return (
        <>
            {loading && <CenterLoading className='relative h-[400px]' />}
            {!loading && <>
                {/* Mode selection */}
                <div className="flex justify-center p-1 bg-gray-200 rounded-full">
                    <button
                        onClick={() => handleModeChange('fixed')}
                        className={`
                      flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all duration-300
                      ${state.mode === 'fixed' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:text-gray-800'}
                    `}
                    >
                        <CalendarDaysIcon className="h-5 w-5" />
                        <span>Fixed Week Offs</span>
                    </button>
                    <button
                        onClick={() => handleModeChange('alternate')}
                        className={`
                      flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all duration-300
                      ${state.mode === 'alternate' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:text-gray-800'}
                    `}
                    >
                        <Cog className="h-5 w-5" />
                        <span>Alternate Week Offs</span>
                    </button>
                </div>

                {/* Content */}
                {state.mode === 'fixed' ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 text-center">Select your fixed days off</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                            {days.map((day) => (
                                <FixedDayOffCard
                                    key={day}
                                    day={day}
                                    isSelected={state.fixed_days.includes(day)}
                                    onClick={() => handleFixedDayToggle(day)}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 text-center">Select alternating weeks for your days off</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-separate border-spacing-2">
                                <thead>
                                    <tr className="bg-gray-100 rounded-lg">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 rounded-tl-lg rounded-bl-lg">Day</th>
                                        {weeks.map((week) => (
                                            <th key={week} className="p-3 text-center text-sm font-semibold text-gray-600">
                                                Week {week}
                                            </th>
                                        ))}
                                        <th className="rounded-tr-lg rounded-br-lg"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {days.map((day) => (
                                        <tr key={day} className="bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg shadow-sm">
                                            <td className="p-3 font-semibold text-gray-900 rounded-l-lg whitespace-nowrap">{dayNumberToName(day)}</td>
                                            {weeks.map((week) => (
                                                <td key={week} className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={state.alternate_days[day]?.includes(week) || false}
                                                        onChange={() => handleAlternateWeekToggle(day, week)}
                                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                    />
                                                </td>
                                            ))}
                                            <td className="rounded-r-lg"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!registerCallback && <Btn size="sm" onClick={save} loading={saving}>Save Plan</Btn>}
            </>}
        </>
    );
}
