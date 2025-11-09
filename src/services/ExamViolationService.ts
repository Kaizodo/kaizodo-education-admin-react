import Api from '@/lib/api';


export class ExamViolationService {

    private static endpoint = 'exam-violation';



    public static async search(form: {
        class_id?: number,
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }


    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }



}