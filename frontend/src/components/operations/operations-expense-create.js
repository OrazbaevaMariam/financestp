import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";

export class OperationsExpenseCreate {

    constructor() {


        // document.getElementById('createExpenseButton').addEventListener('click', this.saveOrder.bind(this));
        //
        document.getElementById('createExpenseButton').addEventListener('click', this.saveExpense.bind(this));
        document.getElementById('cancelExpenseButton').addEventListener('click', this.cancelExpense.bind(this));
        this.categoryExpense = null;

        this.findElements();
        this.init();

        // this.validations = [
        //     { element :this.expenseCreateInputSelectElement = document.getElementById('input-expense-type')},
        //     { element :this.expenseCreateISelectCategoryElement = document.getElementById('input-expense-category')},
        //     { element :this.expenseCreateInputAmountElement = document.getElementById('input-expense-sum')},
        //     { element :this.expenseCreateInputDateElement = document.getElementById('input-expense-date')},
        //     { element :this.expenseCreateInputCommentElement = document.getElementById('input-expense-message')},
        // ]

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
        // this.expenseCreateSelectCategoryElement = await this.getExpenses();
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
        // console.log(this.expenseCreateSelectIncomeCategoryElement.value)

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
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/operations');

        // this.incomeCreateISelectCategoryElement.value = ;

        // if (ValidationUtils.validateForm(this.validations)) {
        //     const createData = {
        //         type: this.expenseCreateInputSelectElement.value,
        //         category: this.expenseCreateISelectCategoryElement.value,
        //         sum: this.expenseCreateInputAmountElement.value,
        //         date: this.expenseCreateInputDateElement.toISOString(),
        //     };
        //
        //     if (this.expenseCreateInputCommentElement) {
        //         createData.message = this.expenseCreateInputCommentElement.value;
        //     }
        //     const response = await ExpenseService.createExpense(createData);
        //
        //     if (response.error) {
        //         alert(response.error);
        //         return response.redirect ? this.openNewRoute(response.redirect) : null;
        //     }
        //
        //     return this.openNewRoute('/operations');
        // }
    }
    async cancelExpense(e) {
        e.preventDefault();

        return this.openNewRoute('/operations');
    };


}