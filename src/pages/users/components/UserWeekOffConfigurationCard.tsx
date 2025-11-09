import AppCard from "@/components/app/AppCard";
import WeekoffEditor from "./WeekoffEditor";


type Props = { id: number };

export default function UserWeekOffConfigurationCard({ id }: Props) {




    return (
        <AppCard
            title="Weekoff Plan"
            subtitle="Fixed + nth day per week week offs"
            contentClassName="px-6 pb-6"
        >
            <WeekoffEditor user_id={id} />
        </AppCard>
    );
}
