import Api from '@/lib/api';


export class ProductService {

    private static endpoint = 'product';


    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async clone(form: any) {
        return Api(`${this.endpoint}/clone`, form);
    }

    public static async stats() {
        return Api(`${this.endpoint}/stats`);
    }

    public static async saveBasicInformation(form: any) {
        return Api(`${this.endpoint}/save-basic-information`, form);
    }

    public static async saveModuleInformation(form: any) {
        return Api(`${this.endpoint}/save-module-information`, form);
    }

    public static async savePriceInformation(form: any) {
        return Api(`${this.endpoint}/save-price-information`, form);
    }

    public static async saveVariantInformation(form: any) {
        return Api(`${this.endpoint}/save-variant-information`, form);
    }

    public static async saveFeaturesInformation(form: any) {
        return Api(`${this.endpoint}/save-features-information`, form);
    }

    public static async saveProductFeaturesInformation(form: any) {
        return Api(`${this.endpoint}/save-product-features-information`, form);
    }

    public static async saveAddonInformation(form: any) {
        return Api(`${this.endpoint}/save-addon-information`, form);
    }

    public static async savePhasesInformation(form: any) {
        return Api(`${this.endpoint}/save-phases-information`, form);
    }

    public static async saveShippingInformation(form: any) {
        return Api(`${this.endpoint}/save-shipping-information`, form);
    }

    public static async saveReferralInformation(form: any) {
        return Api(`${this.endpoint}/save-referral-information`, form);
    }

    public static async uploadMedia(form: any, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload-media`, form, {
            onUploadProgress
        });
    }
    public static async featureMedia(form: any) {
        return Api(`${this.endpoint}/feature-media`, form);
    }

    public static async deleteMedia(form: any) {
        return Api(`${this.endpoint}/delete-media`, form);
    }



    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { product_id: id });
    }


}