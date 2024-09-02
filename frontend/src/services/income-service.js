import {HttpUtils} from "../utils/http-utils";

export class IncomeService {
    static async getIncomes() {
        const returnObject = {
            error: false,
            redirect: null,
            incomes: null
        };

        const result = await HttpUtils.request('/categories/income');

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error))) {
            returnObject.error = 'Возникла ошибка при запросе доходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.incomes = result.response;
        return returnObject;
    }

    static async getIncome(id) {

        const returnObject = {
            error: false,
            redirect: null,
            income: null
        };

        const result = await HttpUtils.request( '/categories/income/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error )) {
            returnObject.error = 'Возникла ошибка при запросе дохода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.order = result.response;
        return returnObject;
    }

    static async createIncome(data) {

        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result = await HttpUtils.request( '/categories/income', 'POST', true, data);
        if (result.redirect || result.error || !result.response) {
            returnObject.error = 'Возникла ошибка при создании дохода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateIncome(id, data) {

        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request( '/categories/income/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении дохода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteIncome(id) {

        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении дохода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}