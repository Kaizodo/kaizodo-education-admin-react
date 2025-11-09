import Api from '@/lib/api';


export class EmployeeOnboardingService {

    private static endpoint = 'employee-onboarding';

    public static async load(id: number) {
        return Api(`${this.endpoint}/load`, { id });
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async saveEmployeeData(form: any) {
        return Api(`${this.endpoint}/save-employee-data`, form);
    }

    public static async loadEmployeeData(user_id: number) {
        return Api(`${this.endpoint}/load-employee-data`, { user_id });
    }

    public static async saveEmploymentData(form: any) {
        return Api(`${this.endpoint}/save-employment-data`, form);
    }

    public static async downloadJoiningLetter(form: {
        user_id: number,
        as_pdf: number,
    }) {
        return Api(`${this.endpoint}/download-joining-letter`, form, {
            responseType: 'blob'
        });
    }


    public static async loadEmploymentData(user_id: number) {
        return Api(`${this.endpoint}/load-employment-data`, { user_id });
    }

    public static async completeCurrentStep(user_id: number) {
        return Api(`${this.endpoint}/complete-current-step`, { user_id });
    }

    public static async issueJoiningLetter(user_id: number) {
        return Api(`${this.endpoint}/issue-joining-letter`, { user_id });
    }

    public static async getBackgroundChecks(user_id: number) {
        return Api(`${this.endpoint}/get-background-checks`, { user_id });
    }

    public static async setBackgroundCheck(form: {
        user_id: number,
        background_check_id: number,
    }) {
        return Api(`${this.endpoint}/set-background-checks`, form);
    }


    public static async loadOrientationData(user_id: number) {
        return Api(`${this.endpoint}/load-orientation-data`, { user_id });
    }

    public static async saveOrientationData(form: any) {
        return Api(`${this.endpoint}/save-orientation-data`, form);
    }


    public static async loadTrainingData(user_id: number) {
        return Api(`${this.endpoint}/load-training-data`, { user_id });
    }

    public static async saveTrainingData(form: any) {
        return Api(`${this.endpoint}/save-training-data`, form);
    }

    public static async loadMentorData(user_id: number) {
        return Api(`${this.endpoint}/load-mentor-data`, { user_id });
    }

    public static async saveMentorData(form: any) {
        return Api(`${this.endpoint}/save-mentor-data`, form);
    }
}