import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";

export class OperationsExpenseCreate {

    constructor() {

        document.getElementById('createExpenseButton').addEventListener('click', this.saveExpense.bind(this));
        document.getElementById('cancelExpenseButton').addEventListener('click', this.cancelExpense.bind(this));
        this.categoryExpense = null;

        this.findElements();
        this.init();

    }
    findElements() {
        this.expenseCreateInputSelectElement = document.getElementById('input-expense-type');
        // this.expenseCreateSelectCategoryElement = document.getElementById('input-expense-category');
        this.expenseCreateSelectIncomeCategoryElement = document.getElementById('input-expense-category');
        // this.expenseCreateISelectOptionElement = document.getElementById('input-expense-option');
        this.expenseCreateInputAmountElement = document.getElementById('input-expense-sum');
        this.expenseCreateInputDateElement = document.getElementById('input-expense-date');
        this.expenseCreateInputCommentElement = document.getElementById('input-expense-message');
    };
    async init() {
        await this.getExpenses();
    }

    async getExpenses() {
        const result = await ExpenseService.getExpenses();
        this.categoryExpense = result.expenses;
        for (let value of Object.values(this.categoryExpense)) {
            this.expenseCreateSelectOptionElement = document.createElement('option');
            this.expenseCreateSelectOptionElement.value = value.id;
            this.expenseCreateSelectOptionElement.innerText = value.title;
            this.expenseCreateSelectIncomeCategoryElement.appendChild(this.expenseCreateSelectOptionElement);
        }

        return result.response;


    }
    async saveExpense(e) {
        e.preventDefault();

        const createData = {
            type: "expense",
            amount: this.expenseCreateInputAmountElement.value,
            date: this.expenseCreateInputDateElement.value,
            comment: this.expenseCreateInputCommentElement.value,
            category_id: Number(this.expenseCreateSelectIncomeCategoryElement.value)
        };

        const response = await OperationsService.createOperation(createData);
        console.log(response)

        if (response.error) {
            alert(response.error);
            return response.redirect ? window.location.href = response.redirect : null;
        }
        return window.location.href = '/operations';
    }
    async cancelExpense(e) {
        e.preventDefault();
        return window.location.href = '/operations';

    };


}