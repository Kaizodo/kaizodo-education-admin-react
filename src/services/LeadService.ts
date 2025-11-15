import Api from '@/lib/api';


export class LeadService {

    private static endpoint = 'lead';

    public static async all() {
        return Api(`${this.endpoint}/all`);
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async searchUsers(form: any) {
        return Api(`${this.endpoint}/search-users`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(internal_reference_number: string) {
        return Api(`${this.endpoint}/detail`, { internal_reference_number });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async addRemarks(form: any) {
        return Api(`${this.endpoint}/add-remarks`, form);
    }

    public static async addProposal(form: any) {
        return Api(`${this.endpoint}/add-proposal`, form);
    }

    public static async loadOrganization(id: number) {
        return Api(`${this.endpoint}/load-organization`, { id });
    }

    public static async saveOrganization(form: any) {
        return Api(`${this.endpoint}/save-organization`, form);
    }

    public static async loadContact(form: { id: number, lead_id: number }) {
        return Api(`${this.endpoint}/load-contact`, form);
    }

    public static async saveContact(form: any) {
        return Api(`${this.endpoint}/save-contact`, form);
    }

    public static async assignTeam(form: {
        lead_id: number,
        user_ids: number[]
    }) {
        return Api(`${this.endpoint}/assign-team`, form);
    }

    public static async removeTeamMember(form: { lead_id: number, user_id: number }) {
        return Api(`${this.endpoint}/remove-team-member`, form);
    }


    public static async loadProposalMetaData() {
        return Api(`${this.endpoint}/load-proposal-meta-data`);
    }

    public static async uploadDocument(form: any, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload-document`, form, {
            onUploadProgress
        });
    }

    public static async deleteDocument(form: { lead_id: number, lead_document_id: number }) {
        return Api(`${this.endpoint}/delete-document`, form);
    }


}