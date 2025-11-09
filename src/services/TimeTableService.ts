import Api from "@/lib/api";

export class TimeTableService {

    private static endpoint = 'timetable';

    public static async load(form: {
        class_id: number,
        date: string,
        section_id?: number
    }) {
        return Api(`${this.endpoint}/load`, form);
    }

    public static async save(form: {
        class_id: number,
        date: string,
        section_id?: number,
        slots: any[],
        breaks: any[]
    }) {
        return Api(`${this.endpoint}/save`, form);
    }

}