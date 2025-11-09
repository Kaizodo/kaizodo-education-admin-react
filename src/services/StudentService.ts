import Api from '@/lib/api';

export class StudentService {

    private static endpoint = '/admin';

    public static async search(form: {
        page: number,
        limit: number,
        keyword: string,
        order_column: number,
        order_dir: 'asc' | 'desc',
        type: number
    }) {
        return Api(`${this.endpoint}/users/get`, form);
    }

    public static async parentClassData (){
        return Api(`${this.endpoint}/users/parent-class`);
    }

    public static async getSection (class_id: string | number) {
        return Api(`${this.endpoint}/class/get-sections`,{class_id: class_id});
    }

    public static async createStudent(form : StudentForm){
        return Api(`${this.endpoint}/users/create`,form);
    }

    public static async getStudent (student_id: string | number) {
        return Api(`${this.endpoint}/users/details`,{user_id: student_id});
    }

    public static async getProfile (student_id: string | number) {
        return Api(`${this.endpoint}/users/profile-details`,{user_id: student_id});
    }

    

    public static async updateStudent(form : StudentForm){
        return Api(`${this.endpoint}/users/update`,form)
    }

    public static async deleteStudent (student_id: string | number) {
        return Api(`${this.endpoint}/users/delete`,{user_id: student_id});
    }

    public static async getCredential (student_id: string | number) {
        return Api(`${this.endpoint}/users/get-credential`,{student_id: student_id});
    }
}