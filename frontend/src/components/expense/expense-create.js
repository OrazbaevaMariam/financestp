import {ExpenseService} from "../../services/expense-service";

export class ExpenseCreate {

    constructor() {

        document.getElementById('saveExpenseButton').addEventListener('click', this.saveCategory.bind(this));
        document.getElementById('cancelButton').addEventListener('click', this.cancelCategory.bind(this));

        this.findElements();

    }

    findElements() {
        this.expenseInputElement = document.getElementById('expenseInput');
    };

    async saveCategory(e) {
        e.preventDefault();

        const createData = {
            title: this.expenseInputElement.value,
        };

        const response = await ExpenseService.createExpense(createData);

        if (response.error) {
            alert(response.error);
            return response.redirect ?   window.location.href = response.redirect : null;
        }
        return window.location.href = '/expense';

    };
    async cancelCategory(e) {
        e.preventDefault();
        return window.location.href = '/expense';

    };




}