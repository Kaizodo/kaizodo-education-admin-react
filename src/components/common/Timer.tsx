import React, { useEffect, useState } from "react";
import moment from "moment";

type TimerProps = {
    datetime: string | Date;
    className?: string;
};

const Timer: React.FC<TimerProps> = ({ datetime, className }) => {
    const [duration, setDuration] = useState("");

    useEffect(() => {
        const start = moment(datetime);

        const interval = setInterval(() => {
            const diff = moment.duration(moment().diff(start));
            const formatted = [
                diff.hours().toString().padStart(2, "0"),
                diff.minutes().toString().padStart(2, "0"),
                diff.seconds().toString().padStart(2, "0"),
            ].join(":");

            setDuration(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, [datetime]);

    return <span className={className}>{duration}</span>;
};

export default Timer;
