import Api from '@/lib/api';


export class InterviewRoundPointSlabService {

    private static endpoint = 'interview-round-point-slab';



    public static async search(form: {
        page: number,
        keyword: string
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


    public static async updateOrder(order: {
        interview_round_id: number,
        sort_order: number
    }[]) {
        return Api(`${this.endpoint}/update-order`, order);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }



}