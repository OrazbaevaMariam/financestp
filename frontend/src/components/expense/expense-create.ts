import {ExpenseService} from "../../services/expense-service";
import {CreateDataType} from "../../types/create-data.type";
import {ReturnObjectData} from "../../types/return-object-data.type";

export class ExpenseCreate {
    private expenseInputElement: HTMLInputElement | null;

    constructor() {

        const save: HTMLElement | null = document.getElementById('saveExpenseButton');
        const cancelButton: HTMLElement | null = document.getElementById('cancelButton');
        this.expenseInputElement = document.getElementById('expenseInput') as HTMLInputElement;


        save?.addEventListener('click', this.saveCategory.bind(this));
        cancelButton?.addEventListener('click', this.cancelCategory.bind(this));
    }

    private async saveCategory(e: Event): Promise<void> {
        e.preventDefault();

        const createData: CreateDataType = {
            title: this.expenseInputElement?.value,
        };

        const response: ReturnObjectData = await ExpenseService.createExpense(createData);

        if (response.error) {
            alert(response.error);
             response.redirect ? window.location.href = response.redirect : null;
            return
        }
         window.location.href = '/expense';
        return

    };

   private async cancelCategory(e: Event): Promise<void> {
        e.preventDefault();
         window.location.href = '/expense';
        return
    };


}