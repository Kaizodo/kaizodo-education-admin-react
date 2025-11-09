import AppCard from "@/components/app/AppCard";
import DateTimeField from "@/components/common/DateTimeField";
import SuggestBatch from "@/components/common/suggest/SuggestBatch";
import SuggestClass from "@/components/common/suggest/SuggestClass";
import SuggestSection from "@/components/common/suggest/SuggestSection";
import TextField from "@/components/common/TextField";
import { useSetValue } from "@/hooks/use-set-value";
import NoRecords from "@/components/common/NoRecords";
import { MdTimeline } from "react-icons/md";
import { StudentAdmissionCard, StudentExitCard, StudentPromotionCard } from "./UserPromotionTimelineCard";
import { UserClassPromotion, UserClassPromotionType } from "@/data/user";
import { useGlobalContext } from "@/hooks/use-global-context";
import moment from "moment";
import { useEffect, useState } from "react";
import { UserService } from "@/services/UserService";
import Btn from "@/components/common/Btn";
import { msg } from "@/lib/msg";
import CenterLoading from "@/components/common/CenterLoading";

type Props = {
    id: number
};

export default function UserAcademicInformationCard({ id }: Props) {
    const { context } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        var r = await UserService.saveAcademicConfiguration(form);
        if (r.success) {
            msg.success('Academic details saved');
            setForm(r.data);
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await UserService.loadAcademicConfiguration(id);
        if (r.success) {
            setForm(r.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [id])

    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }



    return (
        <div className="space-y-3">
            <AppCard
                title='Academic Information'
                actions={<div className='me-6'><Btn size={'sm'} onClick={save} loading={saving}>Save Academic Information</Btn></div>}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
                    <SuggestBatch value={form.batch_id} selected={{ id: form.batch_id, name: form.batch_name }} onChange={setValue('batch_id')} />
                    <TextField value={form.code} onChange={setValue('code')}>Admission Number</TextField>
                    <DateTimeField outputFormat='Y-MM-D' previewFormat='DD MMMM, Y' value={form.joining_date} onChange={setValue('joining_date')} mode='date'>Admission Date</DateTimeField>
                    <TextField value={form.previous_organization_name} onChange={setValue('previous_organization_name')}>Previous School</TextField>
                </div>
                {!form?.promotions?.length && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
                    <SuggestClass value={form.class_id} selected={{ id: form.class_id, name: form.class_name }} onChange={setValue('class_id')} />
                    <SuggestSection class_id={form.class_id} value={form.section_id} selected={{ id: form.section_id, name: form.section_name }} onChange={setValue('section_id')} />
                    <TextField value={form.roll_no} onChange={setValue('roll_no')}>Roll Number</TextField>
                </div>}
            </AppCard>
            <AppCard title='Class Information' subtitle="Student promotion timeline ">
                {!form?.promotions?.length && <NoRecords icon={MdTimeline} title="No Promotion records yet" subtitle="Try assigning  a class / section to student " />}
                {!!form?.promotions?.length && <div className="flex flex-col  gap-3 px-3 mb-6">
                    {form.promotions.map((promotion: UserClassPromotion) => {
                        const fromClass = context.classes.find(c => c.id == promotion.from_class_id);
                        const toClass = context.classes.find(c => c.id == promotion.to_class_id);
                        const toSection = context.sections.find(c => c.id == promotion.to_section_id);
                        if (promotion.promotion_type === UserClassPromotionType.Enter) {
                            return (<StudentAdmissionCard
                                date={moment(promotion.promotion_date).format('DD MMM, Y')}
                                className={toClass?.name || '--'}
                                section={toSection?.name || ''}
                                rollNo={promotion.to_roll_no || '--'}
                            />)
                        }

                        if (promotion.promotion_type === UserClassPromotionType.Promotion) {
                            return (
                                <StudentPromotionCard
                                    date={moment(promotion.promotion_date).format('DD MMM, Y')}
                                    toClass={toClass?.name || '--'}
                                    fromClass={fromClass?.name || '--'}
                                    toRollNo={promotion.to_roll_no || '--'}
                                    fromRollNo={promotion.from_roll_no || '--'}
                                />)
                        }

                        if (promotion.promotion_type === UserClassPromotionType.Exit) {
                            return (<StudentExitCard
                                date={moment(promotion.promotion_date).format('DD MMM, Y')}
                                className={toClass?.name || '--'}
                            />)
                        }
                        return <></>;
                    })}







                </div>}

            </AppCard>
        </div>
    )
}
