import Api from '@/lib/api';


export class FeeStructureService {

    private static endpoint = 'fee-structure';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async save(form: any) {
        return Api(`${this.endpoint}/save`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async copy(form: {
        from_session_id: number,
        from_class_id: number,
        to_session_id: number,
        to_class_id: number
    }) {
        return Api(`${this.endpoint}/copy`, form);
    }

    public static async copySession(form: {
        from_session_id: number,
        to_session_id: number,
    }) {
        return Api(`${this.endpoint}/copy-session`, form);
    }

    public static async update(form: {
        installment: number,
        installment_count: number,
        class_id: number,
        session_id: number,
        due_date: string,
        start_date: string,
        fine_id?: number
    }) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(form: { class_id: number, session_id: number }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async detailBySessionAndClass(form: {
        class_id: number,
        session_id: number
    }) {
        return Api(`${this.endpoint}/detail-by-session-and-class`, form, { handleError: false });
    }

    public static async createInstallments(form: {
        class_id: number,
        session_id: number,
        installment_count: number
    }) {
        return Api(`${this.endpoint}/installment/create`, form);
    }

    public static async installmentDetail(form: {
        class_id: number,
        session_id: number,
        installment_count: number
    }) {
        return Api(`${this.endpoint}/installment/detail`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }



}