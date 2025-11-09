import Api from "@/lib/api";

export class VehicleService {

    private static endpoint = 'vehicle';

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

}