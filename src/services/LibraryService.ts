import Api from "@/lib/api";

type BookForm = {
    id?: string | number,
    title: string,
    category: string,
    isbn_code: string,
    author_name: string,
    quantity: string,
}

type IssueBookForm = {
    book_id: string | number,
    student_id: string | number,
    due_date: string,
    issue_date: string,
}

type ReturnBookForm = {
    issue_book_id: string | number,
    return_date: string,
    fine: string,
}

export class LibraryService {

    private static endpoint = '/admin';


    public static async getBooks (form: SearchFilters) {
        return Api(`${this.endpoint}/books/get`,form);
    }

    public static async addBooks(form: BookForm){
        return Api(`${this.endpoint}/books/create`,form);
    }

    public static async getBookDetails(id: string | number){
        return Api(`${this.endpoint}/books/details`,{id : id});
    }
    
    public static async updateBooks(form: BookForm){
        return Api(`${this.endpoint}/books/update`,form);
    }

    public static async deleteBook(id: string | number){
        return Api(`${this.endpoint}/books/delete`,{id : id});
    }

    public static async getIssueBooks (form: SearchFilters) {
        return Api(`${this.endpoint}/books-issue/get`,form);
    }

    public static async fetchBook(){
        return Api(`${this.endpoint}/books/list`);
    }

    public static async fetchStudents(){
        return Api(`${this.endpoint}/student/list`);
    }

    public static async issueBooks(form: IssueBookForm){
        return Api(`${this.endpoint}/books-issue/create`,form);
    }
    
    public static async returnBooks(form: ReturnBookForm){
        return Api(`${this.endpoint}/books-issue/return`,form);
    }

}