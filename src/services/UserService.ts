import { Permissions } from '@/data/Permissions';
import { CredentialTypeEnum, UserClassPromotionType } from '@/data/user';
import Api from '@/lib/api';

export class UserService {

    public static permissions: Permissions[] = [];

    public static async getCurrentProfile() {
        return Api('profile');
    }


    public static async studentsForPromotion(class_id: number) {
        return Api('user/students-for-promotion', { class_id });
    }

    public static async promoteStudent(form: {
        user_id: number,
        class_id: number,
        session_id: number,
        section_id: number,
        promotion_type: UserClassPromotionType
    }) {
        return Api('user/promote-student', form);
    }


    public static async bulkPromoteStudents(promotions: {
        user_id: number,
        class_id: number,
        session_id: number,
        section_id: number,
        promotion_type: UserClassPromotionType
    }[]) {
        return Api('user/bulk-promote-students', { promotions });
    }

    public static async getStudentsExitDocuments(form: {
        class_id: number,
        session_id: number
    }) {
        return Api('user/get-students-exit-documents', form);
    }


    public static async search(form: any) {
        return Api('user/search', form);
    }

    public static async getCredentials(id: number) {
        return Api('user/get-credentials', { id });
    }

    public static async setCredentials(form: {
        user_id: number,
        username: string,
        password: string,
        credential_type: CredentialTypeEnum,
        allow_login: boolean
    }) {
        return Api('user/set-credentials', form);
    }



    public static async detail(id: number) {
        return Api('user/detail', { id });
    }

    public static async employeeDetails(id: number) {
        return Api('user/employee-detail', { id });
    }

    public static async create(form: any, onUploadProgress?: (progress: number) => void) {
        return Api('user/create', form, {
            onUploadProgress
        });
    }

    public static async update(form: any, onUploadProgress?: (progress: number) => void) {
        return Api('user/update', form, {
            onUploadProgress
        });
    }


    public static async loadWeekOffConfiguration(id: number) {
        return Api('user/load-weekoff-configuration', { id });
    }

    public static async saveWeekOffConfiguration(form: {
        user_id: number,
        mode: string,
        fixed_days: any[],
        alternate_days: any,
    }) {
        return Api('user/save-weekoff-configuration', form);
    }

    public static async loadSalaryConfiguration(id: number) {
        return Api('user/load-salary-configuration', { id });
    }

    public static async saveSalaryConfiguration(form: {
        user_id: number,
        daily_work_hour: number,
        daily_spread_hour: number,
        components: {
            id: number,
            amount: number,
            percentage: number
        }[]
    }) {
        return Api('user/save-salary-configuration', form);
    }


    public static async loadStatutoryConfiguration(id: number) {
        return Api('user/load-statutory-configuration', { id });
    }

    public static async saveStatutoryConfiguration(form: any) {
        return Api('user/save-statutory-configuration', form);
    }

    public static async loadLeaveConfiguration(id: number) {
        return Api('user/load-leave-configuration', { id });
    }

    public static async saveLeaveConfiguration(form: {
        user_id: number,
        leave_types: {
            id: number,
            quota: number
        }[]
    }) {
        return Api('user/save-leave-configuration', form);
    }



    public static async loadAssignedClasses(user_id: number) {
        return Api('user/get-assigned-classes', { user_id });
    }

    public static async loadAssignedSubjects(user_id: number) {
        return Api('user/get-assigned-subjects', { user_id });
    }

    public static async loadAddressDetails(user_id: number) {
        return Api('user/get-address-details', { user_id });
    }

    public static async saveAddressDetails(form: any) {
        return Api('user/save-address-details', form);
    }

    public static async loadMedicalConfiguration(user_id: number) {
        return Api('user/load-medical-configuration', { user_id });
    }

    public static async saveMedicalConfiguration(form: any) {
        return Api('user/save-medical-configuration', form);
    }

    public static async loadAcademicConfiguration(user_id: number) {
        return Api('user/load-academic-configuration', { user_id });
    }

    public static async saveAcademicConfiguration(form: any) {
        return Api('user/save-academic-configuration', form);
    }

    public static async updatePersonalDetails(form: any, onUploadProgress?: (progress: number) => void) {
        return Api('user/update-personal-details', form, {
            onUploadProgress
        });
    }

    public static async loadPersonalDetails(user_id: number) {
        return Api('user/get-personsal-details', { user_id });
    }

    public static async assignSubject(form: {
        user_id: number,
        subject_id: number
    }) {
        return Api('user/assign-subject', form);
    }

    public static async assignClassSection(form: {
        user_id: number,
        class_id: number,
        section_id?: number,
    }) {
        return Api('user/assign-class-section', form);
    }

    public static async unassignClassSection(form: {
        user_id: number,
        class_id: number,
        section_id: number,
    }) {
        return Api('user/unassign-class-section', form);
    }

    public static async assignUserRole(form: {
        user_id: number,
        user_role_id: number
    }) {
        return Api('user/assign-user-role', form);
    }

    public static async unassignSubject(form: {
        user_id: number,
        subject_id: number
    }) {
        return Api('user/unassign-subject', form);
    }

    public static async getFeeConfiguration(form: {
        user_id: number
    }) {
        return Api('user/get-fee-configuration', form);
    }

    public static async setFeeConfiguration(form: {
        user_id: number,
        installment_count: number
    }) {
        return Api('user/set-fee-configuration', form);
    }

    public static async getTransportDetail(id: number) {
        return Api('user/transport/detail', { id });
    }

    public static async saveTransportDetail(form: {
        user_id: number,
        route_id: number,
        pickup_point_id: number,
        months: number[]
    }) {
        return Api('user/transport/save', form);
    }


    public static async getOnboardingOffer(user_id: number) {
        return Api('user/get-onboarding-offer', { user_id });
    }


    public static async createOnboardingOffer(form: any) {
        return Api('user/create-onboarding-offer', form);
    }

    public static async updateOnboardingOffer(form: any) {
        return Api('user/update-onboarding-offer', form);
    }

    public static async updateOnboardingJoining(form: any) {
        return Api('user/update-onboarding-joining', form);
    }

    public static async getTeacher(class_id: number) {
        return Api('user/assign-teacher', { class_id });
    }

    public static async getReleventStudents(form: any) {
        return Api('user/search-relevent-students', form);
    }

    public static async getReleventParents(form: any) {
        return Api('user/search-relevent-parents', form);
    }

    public static async getReleventColleagues(form: any) {
        return Api('user/search-relevent-colleagues', form);
    }


}