import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {OperationsService} from "../../services/operations-service";
import {ExpenseService} from "../../services/expense-service";

export class OperationsUpdate {

    type

    constructor() {

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            location.href = "/";
        }
        this.operationData = null;
        this.categoryExpense = null;



        document.getElementById('updateOperationButton').addEventListener('click', this.updateOperation.bind(this));
        document.getElementById('cancelOperationButton').addEventListener('click', this.updateOperation.bind(this));
        this.findElements();

        this.init(id).then();
    }

    findElements() {
        this.OperationType = document.getElementById('operation-type');
        this.OperationCategory = document.getElementById('operation-category');
        this.OperationSum = document.getElementById('operation-sum');
        this.OperationDate = document.getElementById('operation-date');
        this.OperationMessage = document.getElementById('operation-message');
    }

    async init(id) {
        this.operationData = await this.getOperation(id);

    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id);
        this.currentOperation = result.response;
        if (result.response.type === "income") {
            this.OperationType.value = '1';
        } else {
            this.OperationType.value = '2';
        }
         this.showCategories();

        this.OperationSum.setAttribute('value', result.response.amount)
        this.OperationDate.setAttribute('value', result.response.date)
        this.OperationMessage.setAttribute('value', result.response.comment)


        if (result.redirect) {
            return window.location.href = result.redirect;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.operationData = result.response;

        return result.response;
    }

    async showCategories() {
        if (this.OperationType.value === '1') {
            const categories = await IncomeService.getIncomes();
            this.showCurrentCategories(categories.incomes)
        } else {
            const categories = await ExpenseService.getExpenses();
            this.showCurrentCategories(categories.expenses)
        }
    }

    async showCurrentCategories(categories){
        this.OperationCategory.innerHTML = '';
        categories.forEach(item => {
            const operationOptionElement = document.createElement('option');
            operationOptionElement.innerText = item.title;
            operationOptionElement.value = item.id;
            operationOptionElement.setAttribute('value', item.id);
            this.OperationCategory.appendChild(operationOptionElement);


        });
        const currentCategory = categories.find(item => item.title === this.currentOperation.category);
        if (currentCategory) {
            this.OperationCategory.value = currentCategory.id;
        }

    }



    async updateOperation(e) {
        e.preventDefault();

        const changedData = {};

        changedData.type = this.OperationType.value === '1' ? 'income' : 'expense';
        changedData.category_id = Number(this.OperationCategory.value);
        changedData.amount = Number(this.OperationSum.value);
        changedData.date = this.OperationDate.value;
        changedData.comment = this.OperationMessage.value;

        console.log(this.operationData)

        const response = await OperationsService.updateOperation(this.operationData.id, changedData);

        if (response.error) {
            console.log('error', response.error)
            // alert(response.error);
            // return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        return window.location.href = '/operations';



    }
}