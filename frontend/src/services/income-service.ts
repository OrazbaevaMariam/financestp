import {HttpUtils} from "../utils/http-utils";
import {ReturnObjectData} from "../types/return-object-data.type";
import {CreateDataType} from "../types/create-data.type";
import {DeleteReturnObjectType} from "../types/delete-return-object.type";
import {ReturnObjectIncomeInputType} from "../types/return-object-expense.type";
import {HttpResultType} from "../types/http-result.type";

export class IncomeService {
    public static async getIncomes(): Promise<ReturnObjectIncomeInputType> {
        const returnObject: ReturnObjectIncomeInputType = {
            error: false,
            redirect: null,
            incomes: null
        };

        const result: HttpResultType = await HttpUtils.request('/categories/income');

        if (result.response.redirect || result.error || !result.response || (result.response && (result.response.error))) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        returnObject.incomes = result.response;
        return returnObject;
    }

    // static async getIncome(id) {
    //
    //     const returnObject = {
    //         error: false,
    //         redirect: null,
    //         income: null
    //     };
    //
    //     const result = await HttpUtils.request( '/categories/income/' + id);
    //
    //     if (result.redirect || result.error || !result.response || (result.response && result.response.error )) {
    //         returnObject.error = 'Возникла ошибка при запросе дохода. Обратитесь в поддержку';
    //         if (result.redirect) {
    //             returnObject.redirect = result.redirect;
    //         }
    //         return returnObject;
    //     }
    //
    //     returnObject.order = result.response;
    //     return returnObject;
    // }

    public static async createIncome(data: CreateDataType): Promise<ReturnObjectData> {

        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result: HttpResultType = await HttpUtils.request( '/categories/income', 'POST', true, data);
        if (result.response.redirect || result.error || !result.response) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

   public static async updateIncome(id: number, data: CreateDataType): Promise<DeleteReturnObjectType> {

        const returnObject: DeleteReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResultType = await HttpUtils.request( '/categories/income/' + id, 'PUT', true, data);
        if (result.response.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

  public  static async deleteIncome(id: number): Promise<DeleteReturnObjectType> {

        const returnObject: DeleteReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResultType = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);
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