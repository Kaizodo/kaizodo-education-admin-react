type FeeStructureForm = {
    categories: {
      name: string;
      amount: number;
      dueDate: string;
    }[];
    id?: number;
    className: string;
    isActive: boolean;
    totalAmount: number;
};
  