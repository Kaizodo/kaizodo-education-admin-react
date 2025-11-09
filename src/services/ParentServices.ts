import Api from "@/lib/api";

export class ParentServices {

  private static endpoint = '/admin';

  public static async searchParent(form: SearchFilters) {
    return Api(`${this.endpoint}/parent/get`, form);
  }

  public static async createParent(parentData: any, documents: { [key: string]: File | null }) {
    const formData = new FormData();

    Object.entries(parentData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    Object.entries(documents).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });
    return Api(`${this.endpoint}/parent/create`, formData);
  }

  public static async getParentDetails(id: number | string) {
    return Api(`${this.endpoint}/parent/details`, { id: id });
  }

  public static async updateParent(form: any) {
    return Api(`${this.endpoint}/parent/update`, form);
  }

  public static async deleteParent(id: string | number) {
    return Api(`${this.endpoint}/users/delete`, { id: id });
  }
}