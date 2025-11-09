import Api from '@/lib/api';


export class UserDocumentService {

    private static endpoint = 'user-document';

    public static async all(form: { user_id: number }) {
        return Api(`${this.endpoint}/all`, form);
    }

    public static async search(form: {
        user_id: number,
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/create`, form, {
            onUploadProgress
        });
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



}