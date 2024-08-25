import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";

export class IncomeUpdate {

    constructor() {

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            location.href = "/";
        }
        this.categoryIncome = null;


        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));
        document.getElementById('cancelButton').addEventListener('click', this.updateOrder.bind(this));
        this.findElements();

        this.init(id);
    }

    findElements() {
        this.incomeInputElement = document.getElementById('incomeInput');
    }

    async init(id) {
        this.categoryIncome = await this.getIncome(id);

    }

    async getIncome(id) {
        const result = await HttpUtils.request('/categories/income/' + id);
        this.incomeInputElement.setAttribute('value', result.response.title)

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.categoryIncome = result.response;
        for (let key in this.categoryIncome) {
            console.log(key)
            // var obj = data.messages[key];
            // ...
        }
        // for (let value of Object.values(this.categoryIncome)) {
        //     console.log(this.categoryIncome)
        //
        // }
        // console.log(this.categoryIncome.title)

        return result.response;
    }

    async updateOrder(e) {
        e.preventDefault();

        const changedData = {};

        if (this.incomeInputElement.value !== this.categoryIncome.title) {
            changedData.title = this.incomeInputElement.value;
        }


        const response = await IncomeService.updateIncome(this.categoryIncome.id, changedData);

        if (response.error) {
            console.log('error', response.error)
            // alert(response.error);
            // return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income')


    }
}