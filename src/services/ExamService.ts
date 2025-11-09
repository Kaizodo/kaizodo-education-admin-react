import Api from '@/lib/api';


export class ExamService {

    private static endpoint = 'exam/';

    public static async getExamCategory() {
        return Api(`${this.endpoint}category`);
    }

    public static async createExam(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async details(id: number) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}update`, form);
    }

    public static async publish(id: number) {
        return Api(`${this.endpoint}publish`, { id });
    }


    public static async createSimpleExam(form: any) {
        return Api(`${this.endpoint}simple-create`, form);
    }

    public static async detailsSimpleExam(id: number) {
        return Api(`${this.endpoint}simple-details`, { id });
    }

    public static async updateSimpleExam(form: any) {
        return Api(`${this.endpoint}simple-update`, form);
    }

    public static async deleteExam(id: number) {
        return Api(`${this.endpoint}delete`, { id })
    }

    public static async stats() {
        return Api(`${this.endpoint}stats`);
    }

    public static async getStudents(id: number, exam_id: number) {
        return Api(`${this.endpoint}get-students`, { id, exam_id });
    }

    public static async markGrades(form: any) {
        return Api(`${this.endpoint}grade`, form);
    }

}