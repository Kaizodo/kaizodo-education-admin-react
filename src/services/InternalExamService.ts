import Api from "@/lib/api";

export class InternalExamService {

    private static endpoint = 'internal-exam';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async stats() {
        return Api(`${this.endpoint}/stats`);
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

    public static async publishExam(examIds: number[]) {
        return Api(`${this.endpoint}/publish`, { exam_ids: examIds });
    }

    public static async marks(form: any) {
        return Api(`${this.endpoint}/marks`, form);
    }

    public static async getMarks(exam_id: number, subject_id: number) {
        return Api(`${this.endpoint}/get-marks`, { exam_id, subject_id });
    }

    public static async getClass(id: number) {
        return Api(`${this.endpoint}/get-class`, { exam_type: id });
    }

    public static async publishResult(exam_type: number, exam_ids: number[]) {
        return Api(`${this.endpoint}/publish-result`, { exam_type, exam_ids });
    }

    public static async subjectDetails(exam_id: number) {
        return Api(`${this.endpoint}/subject-detail`, { exam_id });
    }

    public static async assignInvigilator(id: number, user_id: number) {
        return Api(`${this.endpoint}/assign-invigilator`, { id, user_id })
    }
    
    public static async unAssignInvigilator(id: number){
        return Api(`${this.endpoint}/unassign-invigilator`, {id});
    }

    public static async assignSeats(form: any){
        return Api(`${this.endpoint}/assign-seat`,form);
    }

    public static async subjects(id: number){
        return Api(`${this.endpoint}/subjects`,{id});
    }

    public static async assignSubjectAndStudents(form: any){
        return Api(`${this.endpoint}/assign-teacher`,form);
    }

    public static async removeAssignTeacher(form: any){
        return Api(`${this.endpoint}/remove-assign-teacher`, form);
    }

    public static async assignments(internal_exam_id: number){
        return Api(`${this.endpoint}/get-assign-teacher`,{internal_exam_id})
    }

    public static async getInternalResults(params: {
        class_id: number;
        exam_type: number;
        session_id: number;
    }){
        return Api(`${this.endpoint}/results`,params);
    }
}