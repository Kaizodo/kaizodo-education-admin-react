import Api from '@/lib/api';


export class OrganizationService {

    private static endpoint = 'organization';


    public static async quickCreate(form: {
        gst_number: number
    }) {
        return Api(`${this.endpoint}/quick-create`, form);
    }

    public static async gstSearch(form: {
        gst_number: number
    }) {
        return Api(`${this.endpoint}/gst-search`, form);
    }

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async saveBasicDetails(form: any) {
        return Api(`${this.endpoint}/save-basic-details`, form);
    }


    public static async loadBasicDetails(id: number) {
        return Api(`${this.endpoint}/load-basic-details`, { id });
    }

    public static async setupDomain(form: any) {
        return Api(`${this.endpoint}/setup-domain`, form);
    }

    public static async setupComunication(form: any) {
        return Api(`${this.endpoint}/setup-comunication`, form);
    }

    public static async setupPayment(form: any) {
        return Api(`${this.endpoint}/setup-payment`, form);
    }

    public static async setupAdmin(form: any) {
        return Api(`${this.endpoint}/setup-admin`, form);
    }


    public static async setupPanels(form: any) {
        return Api(`${this.endpoint}/setup-panels`, form);
    }

    public static async setupAcademics(form: any) {
        return Api(`${this.endpoint}/setup-academics`, form);
    }

    public static async locationDetails(form: {
        id: number,
        location_id: number
    }) {
        return Api(`${this.endpoint}/location-detail`, form);
    }


    public static async deleteLocationImage(id: number) {
        return Api(`${this.endpoint}/delete-location-image`, { id });
    }

    public static async saveLocationContent(form: {
        id: number,
        location_id: number,
        content: string
    }) {
        return Api(`${this.endpoint}/save-location-content`, form);
    }



    public static async uploadInfrasturcutreImage(form: {
        id: number,
        file: File,
        location_id: number
    }, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload-location-image`, form, {
            onUploadProgress
        });
    }



    public static async deploy(id: number) {
        return Api(`${this.endpoint}/deploy`, { id });
    }


    public static async usersDetail(id: number) {
        return Api(`${this.endpoint}/users-detail`, { id });
    }

    public static async academicDetail(id: number) {
        return Api(`${this.endpoint}/academic-detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async saveUser(form: any) {
        return Api(`${this.endpoint}/save-user`, form);
    }


    public static async deleteUser(form: any) {
        return Api(`${this.endpoint}/delete-user`, form);
    }

}