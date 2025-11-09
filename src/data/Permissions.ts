type PermissionECRUD = {
    enable: boolean;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
};

export const enum Permission {
    ENABLE = 16,
    CREATE = 8,
    READ = 4,
    UPDATE = 2,
    DELETE = 1,
}

export function decodePermissions(value: number): PermissionECRUD {
    return {
        enable: (value & Permission.ENABLE) !== 0,
        create: (value & Permission.CREATE) !== 0,
        read: (value & Permission.READ) !== 0,
        update: (value & Permission.UPDATE) !== 0,
        delete: (value & Permission.DELETE) !== 0,
    };
}

export function encodePermissions(p: PermissionECRUD): number {
    let v = 0;
    if (p.enable) v |= Permission.ENABLE;
    if (p.create) v |= Permission.CREATE;
    if (p.read) v |= Permission.READ;
    if (p.update) v |= Permission.UPDATE;
    if (p.delete) v |= Permission.DELETE;
    return v;
}

export enum Permissions {
    StudentAccountCreate = 3,
    StudentAccountUpdate = 4,
    StudentAccountSearch = 5,
    StudentAccountDelete = 6,
    StudentAccountDetail = 7,
    EmployeeAccountCreate = 8,
    EmployeeAccountUpdate = 9,
    EmployeeAccountSearch = 10,
    EmployeeAccountDelete = 11,
    EmployeeAccountDetail = 12,
    ParentAccountCreate = 13,
    ParentAccountUpdate = 14,
    ParentAccountSearch = 15,
    ParentAccountDelete = 16,
    ParentAccountDetail = 17,
    AdminAccountCreate = 23,
    AdminAccountUpdate = 24,
    AdminAccountSearch = 25,
    AdminAccountDelete = 26,
    AdminAccountDetail = 27,
    SelfAttendance = 28,
    StudentAttendance = 29,
    ManageSelfAttendance = 30,
    ManageEmployeeAttendance = 31,
    ExamModuleCreate = 32,
    ExamModuleUpdate = 33,
    ExamModuleSearch = 34,
    ExamModuleDelete = 35,
    ExamModuleDetail = 36,
    WithoutGroupPermission = 37,
}
