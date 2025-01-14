import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";
import {ReturnObjectExpenseType} from "../../types/return-object-expense.type";
import {CreateOperationType} from "../../types/create-operation.type";
import {ReturnObjectData} from "../../types/return-object-data.type";
import {CategoriesExpenseType} from "../../types/categories-expense.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";

export class OperationsExpenseCreate {
    private categoryExpense: CategoriesExpenseType | null | undefined = null;
    private expenseCreateSelectIncomeCategoryElement: HTMLInputElement | null;
    private expenseCreateInputSelectElement: HTMLInputElement | null;
    private expenseCreateInputAmountElement: HTMLInputElement | null;
    private expenseCreateInputDateElement: HTMLInputElement | null;
    private expenseCreateInputCommentElement: HTMLInputElement | null;
    private expenseCreateSelectOptionElement: HTMLOptionElement | undefined;

    constructor() {
        this.expenseCreateInputSelectElement = document.getElementById('input-expense-type') as HTMLInputElement;
        // this.expenseCreateSelectCategoryElement = document.getElementById('input-expense-category');
        this.expenseCreateSelectIncomeCategoryElement = document.getElementById('input-expense-category') as HTMLInputElement;
        // this.expenseCreateISelectOptionElement = document.getElementById('input-expense-option');
        this.expenseCreateInputAmountElement = document.getElementById('input-expense-sum') as HTMLInputElement;
        this.expenseCreateInputDateElement = document.getElementById('input-expense-date') as HTMLInputElement;
        this.expenseCreateInputCommentElement = document.getElementById('input-expense-message') as HTMLInputElement;
        const createExpenseButton = document.getElementById('createExpenseButton');
        const cancelExpenseButton = document.getElementById('cancelExpenseButton');
        createExpenseButton?.addEventListener('click', this.saveExpense.bind(this));
        cancelExpenseButton?.addEventListener('click', this.cancelExpense.bind(this));

        this.init();
    }

    private async init(): Promise<void> {
        await this.getExpenses();
    }

    private async getExpenses(): Promise<void> {
        const result: ReturnObjectExpenseType |  CategoriesExpenseType = await ExpenseService.getExpenses();
        this.categoryExpense = result.expenses;
        if (this.categoryExpense) {
            for (let value of Object.values(this.categoryExpense) as CategoriesIncomeType[]) {
                this.expenseCreateSelectOptionElement = document.createElement('option');
                this.expenseCreateSelectOptionElement.value = value.id.toString();
                this.expenseCreateSelectOptionElement.innerText = value.title;
                this.expenseCreateSelectIncomeCategoryElement?.appendChild(this.expenseCreateSelectOptionElement);
            }
        }

        // return result.response;


    }

    private async saveExpense(e: Event): Promise<void | null | string> {
        e.preventDefault();

        const createData: CreateOperationType = {
            type: "expense",
            amount: Number(this.expenseCreateInputAmountElement?.value),
            date: this.expenseCreateInputDateElement?.value as string,
            comment: this.expenseCreateInputCommentElement?.value as string,
            category_id: Number(this.expenseCreateSelectIncomeCategoryElement?.value)
        };

        const response: ReturnObjectData = await OperationsService.createOperation(createData);

        if (response.error) {
            alert(response.error);
            return response.redirect ? window.location.href = response.redirect : null;
        }
        window.location.href = '/operations';
        return
    }

    private async cancelExpense(e: Event): Promise<void> {
        e.preventDefault();
        window.location.href = '/operations';
        return

    };
}