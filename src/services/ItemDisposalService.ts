import Api from "@/lib/api";

export class ItemDisposalService {

    private static endpoint = "medicine-disposal/";

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async details(id: any) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async uploadMedia(form: {
        file: File,
        item_disposal_id: number
    }, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}upload-media`, form, {
            onUploadProgress
        });
    }

    public static async deleteMedia(form: {
        item_disposal_media_id: number,
        item_disposal_id: number
    }) {
        return Api(`${this.endpoint}delete-media`, form);
    }

    public static async changeStatus(id: number, status: number, remark: string){
        return Api(`${this.endpoint}change-status`,{id, status, remark});
    }
}