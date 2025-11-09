import Api from "@/lib/api";

export class CircularService {

    private static endpoint = 'circular';

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


    public static async uploadMedia(form: {
        file: File,
        circular_id: number
    }, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload-media`, form, {
            onUploadProgress
        });
    }

    public static async deleteMedia(form: {
        circular_media_id: number,
        circular_id: number
    }) {
        return Api(`${this.endpoint}/delete-media`, form);
    }

    public static async viewer(form: any){
        return Api(`${this.endpoint}/viewer`,form);
    }


}