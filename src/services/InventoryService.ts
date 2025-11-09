import Api from "@/lib/api";

type InventoryForm = {
    id?: string;
    brand: string;
    category: string;
    itemName: string;
    location: string;
    minimumStock: string;
    quantity: string;
    unit: string;
    unitPrice: string;
}

export class InventoryService {


    public static async create(form: InventoryForm) {
        return Api(`inventory/create`, form)
    }

    public static async search(form: any) {
        return Api(`inventory/search`, form)
    }

    public static async details(Id: string | number) {
        return Api(`inventory/detail`, { id: Id })
    }

    public static async update(form: InventoryForm) {
        return Api(`inventory/update`, form)
    }

    public static async delete(Id: string | number) {
        return Api(`inventory/delete`, { id: Id })
    }

    public static async fetchAll(form: any){
        return Api('inventory/fetch',form)
    }

    public static async issueItem(form: any) {
        return Api('inventory/issue', form);
    }

    public static async issueSearch(form: any) {
        return Api('inventory/issue-search', form);
    }

    public static async issuedItemDetails(id: number) {
        return Api('inventory/issued-items-details', { id });
    }

    public static async returnIssuedItems(form: any) {
        return Api('inventory/return-issued-items', form);
    }

    public static async verifyReturnIssuedItems(form: {
        id: number,
        otp: string
    }) {
        return Api('inventory/verify-return-issued-items', form);
    }

    public static async setRequestedItemsApprovalStatus(form: any) {
        return Api('inventory/set-requested-items-approval-status', form);
    }

    public static async stock(form: any){
        return Api('inventory/stock',form);
    }



    public static async issueStats() {
        return Api('inventory/issue-stats');
    }

    public static async bookStats() {
        return Api('inventory/book-stats');
    }
}