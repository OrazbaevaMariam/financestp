import {HttpUtils} from "../../utils/http-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationsService} from "../../services/operations-service";

export class OperationsIncomeCreate {

    constructor() {


        document.getElementById('createIncomeButton').addEventListener('click', this.saveIncome.bind(this));
        document.getElementById('cancelIncomeButton').addEventListener('click', this.cancelIncome.bind(this));
        this.categoryIncome = null;

        this.findElements();

        this.init();
        //
        // this.validations = [
        //     {element: this.incomeCreateInputSelectElement = document.getElementById('input-income-type')},
        //     {element: this.incomeCreateSelectCategoryElement = document.getElementById('input-income-category')},
        //     {element: this.incomeCreateInputAmountElement = document.getElementById('input-income-sum')},
        //     {element: this.incomeCreateInputDateElement = document.getElementById('input-income-date')},
        //     {element: this.incomeCreateInputCommentElement = document.getElementById('input-income-message')},
        // ]

    }

    findElements() {
        this.incomeCreateInputSelectElement = document.getElementById('input-income-type');
        this.incomeCreateSelectCategoryElement = document.getElementById('input-income-category');
        // this.incomeCreateISelectIncomeCategoryElement = document.getElementById('selectIncomeCategory');
        // this.incomeCreateSelectOptionElement = document.getElementById('input-income-option');
        this.incomeCreateInputAmountElement = document.getElementById('input-income-sum');
        this.incomeCreateInputDateElement = document.getElementById('input-income-date');
        this.incomeCreateInputCommentElement = document.getElementById('input-income-message');
    };
    async init() {
        await this.getIncomes();
    }
    async getIncomes() {
        const result = await IncomeService.getIncomes();
        console.log(result)

            this.categoryIncome = result.incomes;
            for (let value of Object.values(this.categoryIncome)) {
                this.incomeCreateSelectOptionElement = document.createElement('option');
                this.incomeCreateSelectOptionElement.value = value.id;
                this.incomeCreateSelectOptionElement.innerText = value.title;
                this.incomeCreateSelectCategoryElement.appendChild(this.incomeCreateSelectOptionElement);
            }

    }


    async saveIncome(e) {
        e.preventDefault();

        const createData = {
            type: "income",
            amount: this.incomeCreateInputAmountElement.value,
            date: this.incomeCreateInputDateElement.value,
            comment: this.incomeCreateInputCommentElement.value,
            category_id: Number(this.incomeCreateSelectCategoryElement.value)
        };

        const response = await OperationsService.createOperation(createData);
        console.log(response)

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/operations');

        // this.incomeCreateSelectCategoryElement.value = ;

        // if (ValidationUtils.validateForm(this.validations)) {
        //     const createData = {
        //         type: this.incomeCreateInputSelectElement.value,
        //         category: this.incomeCreateSelectCategoryElement.value,
        //         sum: this.incomeCreateInputAmountElement.value,
        //         date: this.incomeCreateInputDateElement.toISOString(),
        //     };
        //
        //     if (this.incomeCreateInputCommentElement) {
        //         createData.message = this.incomeCreateInputCommentElement.value;
        //     }
        //     const response = await IncomeService.createIncome(createData);
        //
        //     if (response.error) {
        //         alert(response.error);
        //         return response.redirect ? this.openNewRoute(response.redirect) : null;
        //     }
        //
        //     return this.openNewRoute('/operations');
        // }
    }
    async cancelIncome(e) {
        e.preventDefault();

        return this.openNewRoute('/operations');
    };


}