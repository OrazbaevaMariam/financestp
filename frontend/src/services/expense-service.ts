import {HttpUtils} from "../utils/http-utils";
import {DeleteReturnObjectType} from "../types/delete-return-object.type";
import {ReturnObjectExpenseType} from "../types/return-object-expense.type";
import {ReturnObjectData} from "../types/return-object-data.type";
import {CreateDataType} from "../types/create-data.type";
import {HttpResultType} from "../types/http-result.type";

export class ExpenseService {
   public static async getExpenses(): Promise<ReturnObjectExpenseType> {
        const returnObject: ReturnObjectExpenseType = {
            error: false,
            redirect: null,
            expenses: null
        };

        const result: HttpResultType = await HttpUtils.request('/categories/expense');

        if (result.response.redirect || result.error || !result.response || (result.response && (result.response.error))) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject
        }

        returnObject.expenses = result.response;
        return returnObject;
    }

    // static async getExpense(id: number): Promise<> {
    //
    //     const returnObject = {
    //         error: false,
    //         redirect: null,
    //         title: null
    //     };
    //
    //     const result: HttpResultType = await HttpUtils.request('/categories/expense/' + id);
    //
    //     if (result.response.redirect || result.error || !result.response || (result.response && result.response.error )) {
    //         returnObject.error = true;
    //         if (result.response.redirect) {
    //             returnObject.redirect = result.response.redirect;
    //         }
    //         return returnObject;
    //     }
    //
    //     returnObject.title = result.response;
    //     return returnObject;
    // }

    public static async createExpense(data: CreateDataType): Promise<ReturnObjectData> {

        const returnObject: ReturnObjectData = {
            error: false,
            redirect: null,
            id: null
        };

        const result: HttpResultType = await HttpUtils.request( '/categories/expense', 'POST', true, data);
        if (result.response.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    public static async updateExpense(id: number, data: any): Promise<DeleteReturnObjectType> {

        const returnObject: DeleteReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResultType = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, data);
        if (result.response.redirect || result.response.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteExpense(id: number): Promise<DeleteReturnObjectType> {

        const returnObject: DeleteReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResultType = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.response.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}