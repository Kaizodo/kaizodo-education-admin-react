import Api from "@/lib/api";

export class InvigilatorService {

    private static endpoint = 'invigilator-exam/';

    public static getExam(form: any){
        return Api(`${this.endpoint}exam`,form);
    }

    public static getStudent(form: any){
        return Api(`${this.endpoint}get-student`,form);
    }

    public static getExamDetails(id: number){
        return Api(`${this.endpoint}get-exam`,{id});
    }

    // public static markAttendance(student_id: number, status: number, exam_subject_id: number){
    //     return Api(`${this.endpoint}mark-attendance`,{student_id, status, exam_subject_id});
    // }

    public static markAttendance(form: any){
        return Api(`${this.endpoint}mark-attendance`,form);
    }
}