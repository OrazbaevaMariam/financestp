import {HttpUtils} from "../../utils/http-utils";
import {ExpenseService} from "../../services/expense-service";
import {UrlUtils} from "../../utils/url-utils";

export class ExpenseUpdate {

    constructor() {
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
             location.href = "/";
        }
        this.categoryExpense = null;


        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));
        document.getElementById('cancelButton').addEventListener('click', this.updateOrder.bind(this));
        this.findElements();

        this.init(id).then();
    }

    findElements() {
        this.expenseInputElement = document.getElementById('expenseInput');
    }

    async init(id) {
        this.categoryExpense = await this.getExpense(id);
    }

    async getExpense(id) {
        const result = await HttpUtils.request('/categories/expense/' + id);
        console.log(result)
        this.expenseInputElement.setAttribute('value', result.response.title)

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.categoryExpense = result.response;
        console.log(this.categoryExpense.title)

        return result.response;
    }

    async updateOrder(e) {
        e.preventDefault();

            const changedData = {};

            if (this.expenseInputElement.value !== this.categoryExpense.title) {
                changedData.title = this.expenseInputElement.value;
            }


                const response = await ExpenseService.updateExpense(this.categoryExpense.id, changedData);

                if (response.error) {
                    alert(response.error);
                    // return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/expense')


    }
}