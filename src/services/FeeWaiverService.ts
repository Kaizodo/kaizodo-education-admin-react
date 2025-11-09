import Api from '@/lib/api';


export class FeeWaiverService {

    private static endpoint = 'fee-waiver';


    public static async search(form: {
        page: number,
        keyword: string,
        session_id?: number
    }) {
        return Api(`${this.endpoint}/search`, form);
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





}