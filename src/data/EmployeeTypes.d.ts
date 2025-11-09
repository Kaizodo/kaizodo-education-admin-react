type EmployeeTypeForm = {
  id?: number;
  user_type: string;
  teaching: 'true' | 'false';
  leaves: number;
  tag: string,
  workingDays: string[];
  status: 'Active' | 'Inactive';
  permission: string[];
};
