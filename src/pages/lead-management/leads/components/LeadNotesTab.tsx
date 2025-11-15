import NoRecords from "@/components/common/NoRecords";
import { LeadState } from "../LeadDetail";
import LeadSection from "./LeadSection";
import Btn from "@/components/common/Btn";
import { LuPlus } from "react-icons/lu";
import TextField from "@/components/common/TextField";
import { formatDateTime, nameLetter } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gender } from "@/data/user";
import { GrUser, GrUserFemale } from "react-icons/gr";
import { TbNotesOff } from "react-icons/tb";
import { useForm } from "@/hooks/use-form";
import { useState } from "react";
import { LeadService } from "@/services/LeadService";
import { msg } from "@/lib/msg";

export default function LeadNotesTab({ state, onUpdate }: { state: LeadState, onUpdate: () => void }) {


    const [form, setValue] = useForm();

    const [saving, setSaving] = useState(false);

    const save = async () => {
        setSaving(true);
        var r = await LeadService.addRemarks({ ...form, lead_id: state.lead.id });
        if (r.success) {
            msg.success('Note saved successfuly');
            onUpdate();
        }
        setSaving(false);

    }



    return (
        <LeadSection title="Notes">
            {/* Add New Note Section */}
            <div className="p-4 bg-gray-50 border-gray-200 shadow-lg rounded-lg border flex flex-col gap-3 mb-4">

                <TextField value={form.remarks} onChange={setValue('remarks')} rows={5} multiline placeholder="Add a new internal notes"></TextField>
                <div className="justify-end flex">
                    <Btn variant={'outline'} size={'sm'} onClick={save} loading={saving}><LuPlus /> Add Note</Btn>
                </div>

            </div>

            {/* Existing Notes List */}
            <div className="space-y-4">
                {state.lead_user_remarks.length > 0 ? (
                    state.lead_user_remarks.map(lead_user_remark => {
                        var user = state.users.find(u => u.id = lead_user_remark.user_id);
                        if (!user) {
                            return null;
                        }
                        return (<div key={lead_user_remark.id} className="p-5 border border-gray-300 hover:shadow-md transition rounded-lg">
                            <div className='flex flex-row gap-1'>
                                <Avatar >
                                    <AvatarImage src={user.image}></AvatarImage>
                                    <AvatarFallback className='bg-orange-200 text-orange-800 font-bold'>{nameLetter(user.first_name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center">
                                    {user.gender == Gender.Female && <GrUserFemale className="w-4 h-4 text-gray-400 mr-3" />}
                                    {user.gender == Gender.Male && <GrUser className="w-4 h-4 text-gray-400 mr-3" />}
                                    {user.gender == Gender.Other && <GrUser className="w-4 h-4 text-gray-400 mr-3" />}
                                    <span className="font-semibold text-gray-800">{user.first_name} {user.last_name}</span>
                                    <span className="ml-2 text-gray-500">{!!user.designation_name ? `(${user.designation_name})` : ''}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-wrap">{lead_user_remark.remarks}</p>
                            <div className="justify-end flex text-xs text-gray-500">
                                <span>{formatDateTime(lead_user_remark.created_at)}</span>
                            </div>
                        </div>);
                    })
                ) : (
                    <NoRecords icon={TbNotesOff} title="No Notes" subtitle="Notes created by you or other members in team will show here.." />
                )}
            </div>
        </LeadSection>
    );
}
