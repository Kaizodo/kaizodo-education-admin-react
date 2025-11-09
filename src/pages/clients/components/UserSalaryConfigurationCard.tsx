import AppCard from "@/components/app/AppCard";
import { useModal } from "@/components/common/Modal";
import { useEffect } from "react";
import SalaryEditor from "./SalaryEditor";

type Props = {
    id: number
};


export default function UserSalaryConfigurationCard({ id }: Props) {
    const { update } = useModal();






    useEffect(() => {
        update({
            maxWidth: 1400
        });
        return () => {
            update({
                maxWidth: 1000,
            });
        }
    }, [id])





    return (
        <AppCard
            title="Monthly Salary"
            subtitle="Configure monthly salary breakdown and work hours"
        >

            <SalaryEditor user_id={id} />
        </AppCard>
    )
}
