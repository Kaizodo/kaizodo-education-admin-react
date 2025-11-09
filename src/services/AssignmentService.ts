import Api from "@/lib/api";

type AssignForm = {
    id?: string;
    title: string,
    teacher: string;
    class: string;
    section: string;
    subject: string;
    description: string;
    due_date: string;
    marks: string;
}

export class AssignmentService {

    private static endpoint = 'assignment';

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

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async submissions(form: {
        assignment_id: number
    }) {
        return Api(`${this.endpoint}/submissions`, form);
    }


    public static async fetchTeacher(Id: string) {
        return Api(`${this.endpoint}/subject/teacher`, { subject_id: Id });
    }

    public static async createAssignment(form: AssignForm) {
        return Api(`${this.endpoint}/assignment/create`, form);
    }

    public static async getAssignment(form: SearchFilters) {
        return Api(`${this.endpoint}/assignment/get`, form);
    }

    public static async getAssignmentDetails(Id: string) {
        return Api(`${this.endpoint}/assignment/fetch`, { assignment_id: Id })
    }

    public static async updateAssignment(form: AssignForm) {
        return Api(`${this.endpoint}/assignment/update`, form);
    }

    public static async deleteAssignment(Id: string) {
        return Api(`${this.endpoint}/assignment/delete`, { assignment_id: Id })
    }

    public static async fetchAssignmentDetails(Id: string) {
        return Api(`${this.endpoint}/assignment/fetch-details`, { assignment_id: Id })
    }


    public static async uploadMedia(form: {
        file: File,
        assignment_id: number
    }, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload-media`, form, {
            onUploadProgress
        });
    }

    public static async deleteMedia(form: {
        assignment_media_id: number,
        assignment_id: number
    }) {
        return Api(`${this.endpoint}/delete-media`, form);
    }

    public static async updateMarks(form: any){
        return Api(`${this.endpoint}/update-marks`,form);
    }
}