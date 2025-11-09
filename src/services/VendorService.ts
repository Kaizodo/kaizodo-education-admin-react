import Api from "@/lib/api";

export class VendorService {

    private static endpoint = 'vendor/';

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}update`, form);
    }

    public static async details(id: any) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async delete(id: any) {
        return Api(`${this.endpoint}delete`, { id });
    }

    public static async approval(data: any) {
        return Api(`${this.endpoint}approval`, data);
    }

    public static async searchDocument(form: {
            vendor_id: number,
            page: number,
            keyword: string
        }) {
            return Api(`${this.endpoint}search-document`, form);
        }
    

    public static async uploadDocument(form: any, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}upload-documents`, form, {
            onUploadProgress
        });
    }

    public static async deleteDocs(id: any) {
        return Api(`${this.endpoint}delete-documents`, { id });
    }
}