import Api from "@/lib/api";


export class TicketService {

    private static endpoint = 'ticket';

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form)
    }

    public static async show(id: number) {
        return Api(`${this.endpoint}/show`, { id })
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form)
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form)
    }

    public static async detail(internal_reference_number: string) {
        return Api(`${this.endpoint}/detail`, { internal_reference_number })
    }



}