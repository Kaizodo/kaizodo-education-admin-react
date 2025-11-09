import Api from '@/lib/api';


export class SectionService {

    private static endpoint = 'section';

    public static async all() {
        return Api(`${this.endpoint}/all`);
    }

    public static async search(form: {
        class_id?: number,
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


    public static async fetchClass() {
        return Api(`${this.endpoint}/class/fetch`);
    }

    public static async createSection(form: {
        section_name: string;
        class_id: string;
        total_students: number;
        capacity: number;
        location: string;
        teacher_id: string;
    }) {
        return Api(`${this.endpoint}/class-section/create`, form);
    }

    public static async fetchSectionById(sectionId: string | number) {
        return Api(`${this.endpoint}/class-section/details`, { id: sectionId });
    }

    public static async updateSection(form: {
        id: number,
        section_name: string,
        class_id: string,
        total_students: number,
        capacity: number,
        location: string,
        teacher_id: string,
    }) {
        return Api(`${this.endpoint}/class-section/update`, form);
    }

    public static async deleteSectionById(sectionId: string | number) {
        return Api(`${this.endpoint}/class-section/delete`, { id: sectionId });
    }
}