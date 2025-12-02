import Api from '@/lib/api';

export class ClientService {
    private static endpoint = 'client';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }


    public static async createQuick(form: any) {
        return Api(`${this.endpoint}/create-quick`, form);
    }

    public static async createProfile(form: any) {
        return Api(`${this.endpoint}/create-profile`, form);
    }

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

}