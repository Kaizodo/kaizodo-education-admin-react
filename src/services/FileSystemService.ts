import { MediaType } from '@/components/common/media-manager/media';
import Api from '@/lib/api';

export class FileSystemService {
    private static endpoint = 'media-manager';

    public static async ls(form: {
        page?: number,
        per_page?: number,
        keyword?: string,
        category_id?: number
    }) {
        return Api(`${this.endpoint}/ls`, form);
    }

    public static async mkdir(form: {
        name: string,
        media_type: MediaType,
        parent_id?: number
    }) {
        return Api(`${this.endpoint}/mkdir`, form);
    }

    public static async rmdir(form: {
        id: number
    }) {
        return Api(`${this.endpoint}/rmdir`, form);
    }

    public static async upload(form: FormData) {
        return Api(`${this.endpoint}/upload`, form);
    }

    public static async rmfile(form: {
        id: number
    }) {
        return Api(`${this.endpoint}/rmfile`, form);
    }
}