import Api from '@/lib/api';


export class ExamQuestionGroupService {

    private static endpoint = 'exam-question-group';




    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }


    public static async saveQuestion(form: any) {
        return Api(`${this.endpoint}/save-question`, form);
    }


    public static async detail(form: any) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async delete(form: any) {
        return Api(`${this.endpoint}/delete`, form);
    }

    public static async useAi(form: any) {
        return Api(`${this.endpoint}/use-ai`, form);
    }

}