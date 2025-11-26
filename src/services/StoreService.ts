import Api from '@/lib/api';


export class StoreService {

    private static endpoint = 'store';

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async saveBasicDetails(form: any) {
        return Api(`${this.endpoint}/save-basic-details`, form);
    }
    public static async loadBasicDetails(id: number) {
        return Api(`${this.endpoint}/load-basic-details`, { id });
    }



    public static async saveBillingDetails(form: any) {
        return Api(`${this.endpoint}/save-billing-details`, form);
    }
    public static async loadBillingDetails(id: number) {
        return Api(`${this.endpoint}/load-billing-details`, { id });
    }


    public static async saveProductCategoryDetails(form: any) {
        return Api(`${this.endpoint}/save-product-category-details`, form);
    }
    public static async loadProductCategoryDetails(id: number) {
        return Api(`${this.endpoint}/load-product-category-details`, { id });
    }



    public static async assignEmployee(form: any) {
        return Api(`${this.endpoint}/assign-employee`, form);
    }
    public static async removeEmployee(form: any) {
        return Api(`${this.endpoint}/remove-employee`, form);
    }


    public static async saveDomainDetails(form: any) {
        return Api(`${this.endpoint}/save-domain-details`, form);
    }
    public static async loadDomainDetails(id: number) {
        return Api(`${this.endpoint}/load-domain-details`, { id });
    }

    public static async uploadDocument(form: {
        id: number,
        file: File
    }, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload-document`, form, {
            onUploadProgress
        });
    }

    public static async deleteDocument(form: any) {
        return Api(`${this.endpoint}/delete-document`, form);
    }

    public static async loadDocuments(id: number) {
        return Api(`${this.endpoint}/load-documents`, { id });
    }

    public static async updatePublishStatus(form: any) {
        return Api(`${this.endpoint}/update-publish-status`, form);
    }
    public static async loadPublishStatus(id: number) {
        return Api(`${this.endpoint}/load-publish-status`, { id });
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