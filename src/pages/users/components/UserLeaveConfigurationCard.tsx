import AppCard from "@/components/app/AppCard";
import LeavesQuotaEditor from "./LeavesQuotaEditor";

type Props = {
    id: number
};
export default function UserLeaveConfigurationCard({ id }: Props) {
    return (
        <AppCard
            title="Leave Quota"
            subtitle="Configure how many leaves of each type an employee can avail from date of joining up to 1 year">
            <LeavesQuotaEditor user_id={id} />
        </AppCard>
    )
}
