import Api from '@/lib/api';


export class ClassService {

    private static endpoint = 'class';

    public static async search(form: any) {
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


    public static async fetchLocation() {
        return Api(`${this.endpoint}/location/fetch`);
    }

    public static async fetchTeacher() {
        return Api(`${this.endpoint}/teacher/get-list`);
    }

    public static async createClass(form: {
        class_name: string;
        short_code: string;
        students: number;
        description: string;
        location: string;
        teacher: string;
    }) {
        return Api(`${this.endpoint}/class/create`, form);
    }

    public static async fetchClassById(classId: string | number) {
        return Api(`${this.endpoint}/class/details`, { class_id: classId });
    }

    public static async updateClass(form: {
        class_id: number;
        class_name: string;
        short_code: string;
        students: number;
        description: string;
        location: string;
        teacher: string;
    }) {
        return Api(`${this.endpoint}/class/update`, form);
    }



}