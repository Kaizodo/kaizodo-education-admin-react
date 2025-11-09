
export const enum UserQuotaTypeEnum {
    SubscriptionPlan = 0,
    TopupPlan = 1,
    Module = 2,
    Feature = 3
}

export const enum UserQuotaCodeEnum {
    // INTERNAL REFERENCE - 0 - 499
    IR_SubscriptionPlan = 0,
    IR_TopupPlan = 1,


    // TOPUP PLANS - 500 - 999
    TP_PromotionalSms = 501,
    TP_TransactionalSms = 502,
    TP_Email = 503,
    TP_Push = 504,
    TP_PromotionalWhatsApp = 505,
    TP_TransactionalWhatsApp = 506,
    TP_Other = 507,


    // MODULES - 1000 1999
    M_AttendanceModule = 1000,
    M_StudentManagement = 1002,
    M_FeeManagment = 1003,
    M_HRMS = 1004,
    M_Libarary = 1005,


    // FEATURES - 2000 +
    F_AttendanceReports = 2000,
    F_AdmissionProcess = 2001,
    F_StudentProfile = 2002,
    F_PromotionManagement = 2003,
    F_DailyAttendance = 2004,

}

export const TopupTypeArray = [
    { id: UserQuotaCodeEnum.TP_PromotionalSms, name: 'Promotional Sms' },
    { id: UserQuotaCodeEnum.TP_TransactionalSms, name: 'Transactional Sms' },
    { id: UserQuotaCodeEnum.TP_Email, name: 'Email' },
    { id: UserQuotaCodeEnum.TP_Push, name: 'Push Notifications' },
    { id: UserQuotaCodeEnum.TP_PromotionalWhatsApp, name: 'Promotional WhatsApp' },
    { id: UserQuotaCodeEnum.TP_TransactionalWhatsApp, name: 'Transactional WhatsApp' },
    { id: UserQuotaCodeEnum.TP_Other, name: 'Other' }
];

export function getTopupTypeName(type: UserQuotaCodeEnum) {
    return TopupTypeArray.find(t => t.id == type)?.name ?? 'Unknown';
}

