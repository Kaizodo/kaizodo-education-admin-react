import Api from '@/lib/api';


export class ExamSubmissionService {

    private static endpoint = 'exam-submission';



    public static async search(form: {
        class_id?: number,
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async getAnswerSheet(id: number) {
        return Api(`${this.endpoint}/answer-sheet`, { id });
    }



}