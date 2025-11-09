import { MediaType } from '@/components/common/media-manager/media';
import Api from '@/lib/api';

export class MediaManagerService {
    private static endpoint = 'media-manager';

    public static async search(form: {
        page?: number,
        per_page?: number,
        keyword?: string,
        media_manager_category_id?: number
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async mkdir(form: {
        name: string,
        media_type: MediaType,
        media_manager_category_id?: number
    }) {
        return Api(`${this.endpoint}/mkdir`, form);
    }

    public static async rmdir(form: {
        id: number
    }) {
        return Api(`${this.endpoint}/rmdir`, form);
    }

    public static async upload(form: {
        media: File,
        media_manager_category_id?: number
    }, onUploadProgress: (progress: number) => void) {
        return Api(`${this.endpoint}/upload`, form, { onUploadProgress });
    }

    public static async rmfile(ids: number[]) {
        return Api(`${this.endpoint}/rmfile`, { ids });
    }
}