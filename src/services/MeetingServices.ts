import Api from "@/lib/api";

type MeetingForm = {
    id?: string,
    student_id: number | string,
    parent_id: number | string,
    teacher_id: number | string,
    meeting_type: number | string,
    meeting_mode: string,
    meeting_date: string,
    start_time: string,
    end_time: string,
    venue: string,
    agenda: string,
}

export class MeetingServices {


    public static async create(form: MeetingForm)
    {
        return Api(`meeting/create`,form);
    }

    public static async update(form: MeetingForm)
    {
        return Api(`meeting/update`,form);
    }

    public static async search(form: any)
    {
        return Api(`meeting/search`,form);
    }

    public static async detail(Id:string | number) {
        return Api(`meeting/detail`,{id : Id});
    }

    public static async getParents(id: number){
        return Api(`meeting/fetch-parent`,{id: id});
    }

    public static async stats ()
    {
        return Api('meeting/stats');
    }

    public static async changeStatus(id: number, status: number){
        return Api('meeting/change-status',{id, status})
    }
}