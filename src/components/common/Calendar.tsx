import { ClassValue } from "clsx";
import moment, { Moment } from "moment";
import { ReactNode, useState } from "react";
import { FaChevronLeft, FaRegCalendarAlt, FaChevronRight } from "react-icons/fa";
import Btn from "./Btn";
import { openDitto } from "./Ditto";
import { cn } from "@/lib/utils";


type TileProps = {
    children?: React.ReactNode,
    disabled?: boolean,
    className?: ClassValue,
    onClick: () => void
}

export const Tile = ({ children, disabled, className, onClick }: TileProps) => {
    return (<div
        onClick={onClick}
        className={cn(
            'flex flex-col',
            `relative transition cursor-pointer`,
            disabled && `bg-gray-300 cursor-not-allowed`,
            className
        )}
        style={{
            minHeight: 150
        }}
    >{children}</div>);
}





type CalendarProps = {
    groups?: {
        className: ClassValue,
        dates: moment.Moment[]
    }[],
    className?: string,
    date: number,
    onChange: (m: Moment) => void,
    cell: (m: Moment) => React.ReactNode,
    showNavs?: boolean,

    actions?: ReactNode,
    actionsAfter?: ReactNode,
    actionsClass?: string
};

export const Calendar: React.FC<CalendarProps> = ({ date, onChange, cell, className, actions, showNavs = true, actionsAfter, actionsClass }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState<Moment>(moment(date));

    const startOfMonth = currentDate.clone().startOf('month').startOf('week');
    const endOfMonth = currentDate.clone().endOf('month').endOf('week');

    const days: Moment[] = [];
    let day = startOfMonth.clone();
    while (day.isBefore(endOfMonth)) {
        days.push(day.clone());
        day.add(1, 'day');
    }

    const prevMonth = () => {
        var m = currentDate.clone().subtract(1, 'month')
        setCurrentDate(m);
        onChange(m);
    };
    const nextMonth = () => {
        var m = currentDate.clone().add(1, 'month');
        setCurrentDate(m);
        onChange(m);
    };

    return (
        <div className={className}>
            <div className={cn(
                "flex  items-center w-full  p-3 gap-3",
                actionsClass
            )}>
                <div className="flex-1">{actions}</div>
                {!!showNavs && <>
                    <Btn size={'sm'} onClick={prevMonth} variant={'outline'}>
                        <FaChevronLeft />
                    </Btn>
                    <Btn size={'sm'} onClick={nextMonth} variant={'outline'}>
                        <FaChevronRight />
                    </Btn>
                    <Btn
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => {
                            openDitto({
                                mode: 'yearmonth',
                                callback: (m) => {
                                    setCurrentDate(m);
                                    onChange(m);
                                }
                            })
                        }}>
                        <FaRegCalendarAlt />
                        {currentDate.format('MMMM YYYY')}
                    </Btn>
                </>}
                {actionsAfter}
            </div>

            <div className="grid grid-cols-7 w-full  ">
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            'text-center font-semibold text-primary border border-s-0     border-e-1 border-b-1 py-2',
                            i === 6 && 'border-e-0'
                        )}
                    >
                        {moment().day(i).format('ddd')}
                    </div>
                ))}

                {days.map((day, index) => {

                    return (
                        <div
                            key={'d_' + index}
                            className={cn(
                                'border  border-s-0 border-t-0 border-b-1 border-e-1 hover:bg-accent cursor-pointer transition-colors duration-200',
                                (index + 1) % 7 === 0 && 'border-e-0',
                                index >= days.length - 7 && 'border-b-0'
                            )}
                        >
                            {cell(day)}

                        </div>
                    );
                })}
            </div>




        </div>
    );
}