import Api from "@/lib/api";

export class ThreadService {

    private static endpoint = 'thread';


    public static async connect(form: {
        thread_id?: number,
        user_id?: number
    }) {
        return Api(`${this.endpoint}/connect`, form);
    }


    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }


    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async createMessage(form: any) {
        return Api(`${this.endpoint}/message/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }


    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }


}
