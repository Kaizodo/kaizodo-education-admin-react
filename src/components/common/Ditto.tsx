import moment from 'moment';
import { useEffect, useState } from 'react';
import { padInt } from '@/lib/utils';
import { Button } from '../ui/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Btn from './Btn';
import { Modal, ModalBody } from '@/components/common/Modal';



type DittoPickerProps = {
    value: moment.MomentInput,
    callback: (m: moment.Moment) => void
};

const AmPmPicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    const m = moment(timestamp);

    const setAM = () => m.hour(m.hour() % 12);
    const setPM = () => m.hour((m.hour() % 12) + 12);

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])

    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick AM / PM</span>
            <div className="flex items-center justify-center p-1.25">
                <div
                    className="p-1.25 cursor-pointer"
                    onClick={() => {
                        const mx = setAM();
                        callback(mx);
                        setTimestamp(mx.valueOf());
                    }}
                >
                    <span
                        className={`text-[30px] w-[80px] font-bold text-center rounded p-1.25 ${m.format('a') === 'am' ? 'bg-primary text-white' : 'bg-grey text-black'
                            }`}
                    >
                        AM
                    </span>
                </div>
                <div
                    className="p-1.25 cursor-pointer"
                    onClick={() => {
                        const mx = setPM();
                        callback(mx);
                        setTimestamp(mx.valueOf());
                    }}
                >
                    <span
                        className={`text-[30px] w-[80px] font-bold text-center rounded p-1.25 ${m.format('a') === 'pm' ? 'bg-primary text-white' : 'bg-grey text-black'
                            }`}
                    >
                        PM
                    </span>
                </div>
            </div>
        </div>
    );
};

const HourPicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    const m = moment(timestamp);
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);

    const setHour12 = (hour12: number) => {
        const isPM = m.hour() >= 12;
        return m.hour((hour12 % 12) + (isPM ? 12 : 0));
    };

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])


    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick Hour</span>
            <div className="grid grid-cols-3">
                {hours.map((h) => (
                    <div
                        key={`hour_${h}`}
                        className="cursor-pointer"
                        onClick={() => {
                            const mx = setHour12(h);
                            callback(mx);
                            setTimestamp(mx.valueOf());
                        }}
                    >
                        <span
                            className={`flex items-center justify-center text-lg text-center font-bold rounded p-2 w-full ${m.format('h') === `${h}` ? 'bg-primary text-white' : 'bg-grey text-black'
                                }`}
                        >
                            {padInt(h, 2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
const MinutePicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    const m = moment(timestamp);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])

    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick Minute</span>
            <div className="grid grid-cols-6">
                {minutes.map((minute) => (
                    <div
                        key={`minute_${minute}`}
                        className="cursor-pointer"
                        onClick={() => {
                            const mx = m.set('m', minute);
                            callback(mx);
                            setTimestamp(mx.valueOf());
                        }}
                    >
                        <span
                            className={`flex items-center justify-center text-center font-bold rounded p-0.5 text-lg w-full ${m.format('m') === `${minute}` ? 'bg-primary text-white' : 'bg-grey text-black'
                                }`}
                        >
                            {padInt(minute, 2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SecondPicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    const m = moment(timestamp);
    const seconds = Array.from({ length: 60 }, (_, i) => i);

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])

    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick Second</span>
            <div className="flex flex-wrap p-1.25">
                {seconds.map((second) => (
                    <div
                        key={`second_${second}`}
                        className="w-[16.66%] p-1.25 cursor-pointer"
                        onClick={() => {
                            const mx = m.set('s', second);
                            callback(mx);
                            setTimestamp(mx.valueOf());
                        }}
                    >
                        <span
                            className={`text-center font-bold rounded p-1.25 w-full ${m.format('s') === `${second}` ? 'bg-primary text-white' : 'bg-grey text-black'
                                }`}
                        >
                            {padInt(second, 2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const YearPicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());

    const getYears = (year = moment().year()) => Array.from({ length: 30 }, (_, i) => year - 15 + i);
    const [years, setYears] = useState<number[]>(getYears(moment(timestamp).year()));

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])


    const m = moment(timestamp);


    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick Year</span>

            <div className="flex items-center">
                <Button variant={'outline'} onClick={() => setYears(getYears(years[0] - 15))} ><FaChevronLeft /></Button>
                <span className="flex-1 text-center text-[20px]">
                    {years[0]} - {years[years.length - 1]}
                </span>
                <Button variant={'outline'} onClick={() => setYears(getYears(years[years.length - 1] + 16))}><FaChevronRight /></Button>
            </div>

            <div className="flex flex-wrap p-1.25">
                {years.map((y) => (
                    <div
                        key={`year_${y}`}
                        className="w-[20%] p-1.25 cursor-pointer"
                        onClick={() => {
                            const mx = m.set('y', y);
                            callback(mx);
                            setTimestamp(mx.valueOf());
                        }}
                    >
                        <span
                            className={`text-center font-bold rounded p-1.25 w-full ${m.year() === y ? 'bg-primary text-white' : 'bg-grey text-black'
                                }`}
                        >
                            {y}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const MonthPicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    const months = moment.months();

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])


    const m = moment(timestamp);

    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick Month</span>

            <div className="grid grid-cols-2 gap-2">
                {months.map((month, index) => (
                    <div
                        key={month}
                        className="cursor-pointer w-full"
                        onClick={() => {
                            const mx = m.set('M', index);
                            callback(mx);
                            setTimestamp(mx.valueOf());
                        }}
                    >
                        <span
                            className={` text-center font-bold rounded-sm p-1 w-full items-center justify-center flex ${m.format('MMMM') === month ? 'bg-primary text-white' : 'bg-grey text-black hover:bg-accent'
                                }`}
                        >
                            {month}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const DatePicker = ({ value, callback }: DittoPickerProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());

    useEffect(() => {
        setTimestamp(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());
    }, [value])


    const m = moment(timestamp);
    const weeks = moment.weekdaysShort();
    const firstDayOfMonth = moment(m).startOf('month').day();
    const lastDayOfMonth = moment(m).endOf('month').day();
    const prevMonth = moment(m).subtract(1, 'month');
    const nextMonth = moment(m).add(1, 'month');

    const prevDays = Array.from({ length: firstDayOfMonth }, (_, i) =>
        prevMonth.daysInMonth() - firstDayOfMonth + i + 1
    );

    const days = Array.from({ length: m.daysInMonth() }, (_, i) => i + 1);

    const nextDays = Array.from({ length: 6 - lastDayOfMonth }, (_, i) => i + 1);

    const renderDay = (d: number, mode: 'current' | 'next' | 'previous') => {
        const mx = mode === 'current' ? m : mode === 'next' ? nextMonth : prevMonth;

        const isToday = moment(mx).set('D', d).isSame(moment(), 'day');
        const isSelected = moment(mx).set('D', d).isSame(moment(value).isValid() ? moment(value) : moment(), 'day');

        return (
            <div
                key={`${mode}_${d}`}
                className={` p-1.25 text-center cursor-pointer rounded ${mode !== 'current' ? 'text-gray-400' : ''
                    } ${isToday ? 'bg-primary text-white' : ''} ${isSelected ? 'bg-primary text-white' : 'bg-grey text-black'}`}
                onClick={() => callback(moment(mx).set('D', d))}
            >
                {d}
            </div>
        );
    };

    return (
        <div className="p-2">
            <span className="pl-2.5 pt-2.5 font-bold text-primary text-[18px]">Pick Date</span>

            <div className="flex items-center">
                <Button size={'sm'} variant={'outline'} onClick={() => setTimestamp(m.subtract(1, 'M').valueOf())}>
                    <FaChevronLeft />
                </Button>
                <span className="flex-1 text-center text-[20px]">
                    {m.format('MMMM')} - {m.format('Y')}
                </span>
                <Button size={'sm'} onClick={() => setTimestamp(m.add(1, 'M').valueOf())}>
                    <FaChevronRight />
                </Button>
            </div>

            <div className=" border-b border-gray-400 grid grid-cols-7">
                {weeks.map(w => (
                    <div key={w} className=" p-1.25 text-center font-bold">{w}</div>
                ))}
            </div>

            <div className=" border-b border-gray-400 grid grid-cols-7">
                {prevDays.map(d => renderDay(d, 'previous'))}
                {days.map(d => renderDay(d, 'current'))}
                {nextDays.map(d => renderDay(d, 'next'))}
            </div>
        </div>
    );
};






export type DittoMode = 'date' | 'time' | 'datetime' | 'year' | 'month' | 'yearmonth' | 'hour' | 'minute' | 'second' | 'ampm';


type DittoProps = {
    mode: DittoMode,
    autoApply?: boolean,
    enableRange?: boolean,
    close: (m?: moment.Moment) => void,
    value?: moment.MomentInput,
    callback?: (m: moment.Moment) => void
};

const Ditto = ({ mode, close, callback, value, autoApply = true }: DittoProps) => {
    const [timestamp, setTimestamp] = useState(moment(value).isValid() ? moment(value).valueOf() : moment().valueOf());

    const getInitialInternalMode = (): DittoMode => {
        if (mode == 'datetime') {
            return 'date';
        } else if (mode == 'time') {
            return 'hour';
        } else if (mode == 'yearmonth') {
            return 'year';
        }
        return mode;
    }

    const [internalMode, setInternalMode] = useState<DittoMode>(getInitialInternalMode());

    const setAM = () => m.hour(m.hour() % 12);
    const setPM = () => m.hour((m.hour() % 12) + 12);
    const handlePickerCallback = (mx: moment.Moment) => {
        setTimestamp(mx.valueOf());
        if (['datetime', 'yearmonth', 'date'].includes(mode) && internalMode == 'year') {
            setInternalMode('month');
        } else if (['datetime', 'date'].includes(mode) && internalMode == 'month') {
            setInternalMode('date');
        } else if (mode == 'datetime' && internalMode == 'date') {
            setInternalMode('hour');
        } else if (['datetime', 'time'].includes(mode) && internalMode == 'hour') {
            setInternalMode('minute');
        } else if ((['datetime', 'time', 'minute'].includes(mode) && internalMode == 'minute')
            || (mode == 'yearmonth' && internalMode == 'month')
            || (mode == internalMode)
        ) {
            if (autoApply) {
                apply(mx);
            }
        }
    }

    const apply = (mx: any) => {
        if (callback) {
            callback(mx);
        }
        close(mx);
    }
    const m = moment(timestamp);

    console.log(m.format('LT'));

    return <div className="flex justify-center">
        <div className="w-full max-w-[320px] bg-white shadow-md">
            {['datetime', 'date', 'datetime', 'time', 'yearmonth'].includes(mode) && (
                <div className="p-2.5 bg-primary">
                    {mode === 'datetime' && (
                        <div className="w-[50px]" onClick={() => setInternalMode('year')}>
                            <span className={`hover:bg-red-400 cursor-pointer rounded-sm p-1 text-sm ${internalMode === 'year' ? 'font-bold text-white' : 'text-gray-100'}`}>{m.format('Y')}</span>
                        </div>
                    )}
                    <div className={`flex ${['datetime'].includes(mode) ? 'justify-between' : 'justify-center'} items-center`}>
                        {['date', 'yearmonth', 'datetime'].includes(mode) && (
                            <div className="flex text-3xl">
                                {['date', 'yearmonth'].includes(mode) && (
                                    <div onClick={() => setInternalMode('year')}>
                                        <span className={`${internalMode === 'year' ? 'font-bold text-white' : 'text-gray-100'} cursor-pointer hover:bg-red-400 rounded-sm px-2`}>{m.format('Y')}</span>
                                    </div>
                                )}
                                <div onClick={() => setInternalMode('month')}>
                                    <span className={`${internalMode === 'month' ? 'font-bold text-white' : 'text-gray-100'} cursor-pointer hover:bg-red-400 rounded-sm px-2`}>{m.format('MMM')}</span>
                                </div>
                                {['date', 'datetime'].includes(mode) && (
                                    <div onClick={() => setInternalMode('date')}>
                                        <span className={`${internalMode === 'date' ? 'font-bold text-white' : 'text-gray-100 cursor-pointer'}  cursor-pointer hover:bg-red-400 rounded-sm px-2`}>{m.format('DD')}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {['datetime', 'time'].includes(mode) && (
                            <div className="flex  text-3xl">
                                <div onClick={() => setInternalMode('hour')}>
                                    <span className={`${internalMode === 'hour' ? 'font-bold text-white' : 'text-gray-100'}  cursor-pointer hover:bg-red-400 rounded-sm px-2`}>{m.format('hh')}</span>
                                </div>
                                <span className="text-gray-100">:</span>
                                <div onClick={() => setInternalMode('minute')}>
                                    <span className={`${internalMode === 'minute' ? 'font-bold text-white' : 'text-gray-100'} cursor-pointer hover:bg-red-400 rounded-sm px-2`}>{m.format('mm')}</span>
                                </div>
                                <div className="ml-2.5 text-sm">
                                    <div onClick={() => setTimestamp(setAM().valueOf())}>
                                        <span className={`text-center ${m.format('a') === 'am' ? 'font-bold text-white' : 'text-gray-100'} cursor-pointer hover:bg-red-400 rounded-sm px-2`}>AM</span>
                                    </div>
                                    <div onClick={() => setTimestamp(setPM().valueOf())}>
                                        <span className={`text-center ${m.format('a') === 'pm' ? 'font-bold text-white' : 'text-gray-100'} cursor-pointer hover:bg-red-400 rounded-sm px-2`}>PM</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {internalMode === 'ampm' && <AmPmPicker value={timestamp} callback={handlePickerCallback} />}
            {internalMode === 'date' && <DatePicker value={timestamp} callback={handlePickerCallback} />}
            {internalMode === 'month' && <MonthPicker value={timestamp} callback={handlePickerCallback} />}
            {internalMode === 'year' && <YearPicker value={timestamp} callback={handlePickerCallback} />}
            {internalMode === 'hour' && <HourPicker value={timestamp} callback={handlePickerCallback} />}
            {internalMode === 'minute' && <MinutePicker value={timestamp} callback={handlePickerCallback} />}
            {internalMode === 'second' && <SecondPicker value={timestamp} callback={handlePickerCallback} />}

            <div className="flex justify-between p-2.5">
                <Btn size="sm" onClick={() => close(undefined)}>Cancel</Btn>
                <Btn size="sm" onClick={() => apply(m)}>Apply</Btn>
            </div>
        </div>
    </div>
        ;
}

type OpenDittoProps = {
    mode: DittoMode,
    autoApply?: boolean,
    enableRange?: boolean,
    value?: string | Date | number,
    callback?: (m: moment.Moment) => void
};

export const openDitto = async ({ mode, autoApply = true, enableRange = false, value, callback }: OpenDittoProps): Promise<moment.Moment | undefined> => {
    return new Promise((resolve) => {
        const modal_id = Modal.show({
            header: false,
            maxWidth: 320,
            onClose: (m) => {
                resolve(m);
            },
            content: () => {
                return <ModalBody className='p-0'>
                    <Ditto
                        close={(m) => {
                            Modal.close(modal_id, m);
                            resolve(m);
                        }}
                        mode={mode}
                        autoApply={autoApply}
                        enableRange={enableRange}
                        callback={callback}
                        value={value}
                    />
                </ModalBody>
            }
        })

    });
};

