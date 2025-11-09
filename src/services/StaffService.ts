import Api from "@/lib/api";

export class StaffService {

    private static endpoint = '/admin';

    public static async searchStaff(form: SearchFilters){
        return Api(`${this.endpoint}/user/search`,form);
    }

    public static async fetchSubject(){
        return Api(`${this.endpoint}/subject/list`);
    }

    public static async fetchType(){
        return Api(`${this.endpoint}/staff-type/fetch`);
    }

    public static async fetchClass(){
        return Api(`${this.endpoint}/class/fetch`);
    }

    public static async createStaff(staffData: any) {
        return await Api(`${this.endpoint}/user/create`, staffData);
    }

    public static async fetchStaffById(staffId: string | number) {
        return Api(`${this.endpoint}/user-profile`, { user_id: staffId });
    }

    public static async updateStaff(staffId: string, staffData: any) {
        return await Api(`${this.endpoint}/user/update/`, {...staffData,u_id : staffId}); 
      }
      
    public static async deleteStaff(userId: string | number) {
        return Api(`${this.endpoint}/user/delete`, { user_id: userId });
    }

}