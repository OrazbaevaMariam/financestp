import {HttpUtils} from "../utils/http-utils";

export class ExpenseService {
    static async getExpenses() {
        const returnObject = {
            error: false,
            redirect: null,
            expenses: null
        };

        const result = await HttpUtils.request('/categories/expense');

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error))) {
            returnObject.error = 'Возникла ошибка при запросе расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject
        }

        returnObject.expenses = result.response;
        return returnObject;
    }

    static async getExpense(id) {

        const returnObject = {
            error: false,
            redirect: null,
            title: null
        };

        const result = await HttpUtils.request('/categories/expense/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error )) {
            returnObject.error = 'Возникла ошибка при запросе расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.title = result.response;
        return returnObject;
    }

    static async createExpense(data) {

        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result = await HttpUtils.request( '/categories/expense', 'POST', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при создании расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateExpense(id, data) {

        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteExpense(id) {

        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}