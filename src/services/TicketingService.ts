import Api from "@/lib/api";


export class TicketingService {

    private static endpoint = 'ticket';

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form)
    }

    public static async show(id: number) {
        return Api(`${this.endpoint}/show`, {id})
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form)
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form)
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id })
    }

    public static async createMessage(form: any, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/create-message`, form, {
            onUploadProgress
        });
    }

    public static async transferEmplyee(form: any) {
        return Api(`${this.endpoint}/transfer`, form);
    }

    public static async assignEmplyee(form: any) {
        return Api(`${this.endpoint}/include`, form);
    }

    public static async closeTicket(form: any) {
        return Api(`${this.endpoint}/close`, form);
    }

    public static async stats() {
        return Api(`${this.endpoint}/stats`);
    }

    public static async getUser(form: any) {
        return Api(`${this.endpoint}/get-user`,form);
    }

}