import {HttpUtils} from "../utils/http-utils";
import {CreateOperationType} from "../types/create-operation.type";
import {ReturnObjectData} from "../types/return-object-data.type";
import {DeleteReturnObjectType} from "../types/delete-return-object.type";
import {DefaultResponseType} from "../types/default-response.type";
import {ResultsFilter} from "../types/results-filter.type";
import {HttpResultType} from "../types/http-result.type";
import {ReturnObjectIncomeInputType} from "../types/return-object-expense.type";

export class OperationsService {
    // static async getOperations() {
    //     const returnObject = {
    //         error: false,
    //         redirect: null,
    //         incomes: null
    //     };
    //     const result = await HttpUtils.request('/operations');
    //
    //     if (result.redirect || result.error || !result.response || (result.response && (result.response.error))) {
    //         returnObject.error = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
    //         if (result.redirect) {
    //             returnObject.redirect = result.redirect;
    //         }
    //         return returnObject;
    //     }
    //
    //     returnObject.orders = result.response.orders;
    //     return returnObject;
    // }

    public static async getOperationsFilter(interval: string, firstDate: HTMLInputElement, secondDate: HTMLInputElement, filterType: string | null): Promise<ResultsFilter> {
        const returnObject: ResultsFilter = {
            error: false,
            redirect: null,
            response: null

        };
        const result: HttpResultType = await HttpUtils.request('/operations?period=' + (interval ? ('interval&dateFrom=' + firstDate?.value as string + '&dateTo=' + secondDate?.value as string) : filterType));

        if (!result && !(result as ResultsFilter).response  && (result as ResultsFilter).redirect || (result as HttpResultType).error) {
            returnObject.error = true;
            if ((result as ResultsFilter).redirect) {
                returnObject.redirect = (result as ResultsFilter).redirect;
            }
            return returnObject;
        }

        returnObject.response = (result as ResultsFilter).response;
        return returnObject;
    }

  // public  static async getOperation(id: number): Promise<ReturnObjectIncomeInputType> {
  //
  //       const returnObject: ReturnObjectIncomeInputType = {
  //           error: false,
  //           redirect: null,
  //           incomes: null
  //       };
  //
  //       const result: HttpResultType = await HttpUtils.request('/operations/' + id);
  //
  //       if (result.response.redirect || result.error || !result.response || (result.response && result.response.error)) {
  //           returnObject.error = true;
  //           if (result.response.redirect) {
  //               returnObject.redirect = result.response.redirect;
  //           }
  //           return returnObject;
  //       }
  //
  //       returnObject.incomes = result.response;
  //       return returnObject;
  //   }

    public static async createOperation(data: CreateOperationType): Promise<ReturnObjectData> {

        const returnObject: ReturnObjectData = {
            error: false,
            redirect: null,
            id: null
        };

        const result: HttpResultType = await HttpUtils.request('/operations', 'POST', true, data);
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

    public static async updateOperation(id: number, data: {}): Promise<DeleteReturnObjectType> {

        const returnObject: DeleteReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResultType = await HttpUtils.request('/operations/' + id, 'PUT', true, data);
        if (result.response.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = true;
            if (result.response.redirect) {
                returnObject.redirect = result.response.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    public static async deleteOperation(id: number): Promise<DeleteReturnObjectType | undefined> {

        const returnObject: DeleteReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResultType = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if (result.error) {
            returnObject.error = true;
            return returnObject;
        }
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