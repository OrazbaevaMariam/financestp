import {HttpUtils} from "../../utils/http-utils";
import {ExpenseService} from "../../services/expense-service";
import {UrlUtils} from "../../utils/url-utils";
import {HttpResultType} from "../../types/http-result.type";
import {CreateDataType} from "../../types/create-data.type";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";
import {CategoriesExpenseType} from "../../types/categories-expense.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class ExpenseUpdate {
    private id: string | null | undefined;
    private categoryExpense: HttpResultType | undefined | string;
    private expenseInputElement: HTMLInputElement | null | undefined ;

    constructor() {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            location.href = "/";
        }

        const updateButton = document.getElementById('updateButton');
        const cancelButton = document.getElementById('cancelButton');
        updateButton?.addEventListener('click', this.updateOrder.bind(this));
        cancelButton?.addEventListener('click', this.updateOrder.bind(this));
        this.expenseInputElement = document.getElementById('expenseInput') as HTMLInputElement;


        this.init(Number(id)).then();
    }

    private async init(id: number): Promise<void> {
        this.categoryExpense = await this.getExpense(id);
    }

    private async getExpense(id: number): Promise<HttpResultType | undefined | string> {
        const result: HttpResultType = await HttpUtils.request('/categories/expense/' + id);
        if (result && result.response as CategoriesExpenseType) {
            this.expenseInputElement?.setAttribute('value', (result as unknown as CategoriesExpenseType).title)
        }
        if ((result as unknown as DefaultResponseType).error) {
             window.location.href = '/expense';
            return
        }

        if (result.response.error || !result.response.title || !result.response.id || (result.response.id && result.response.error) || result.response.title && result.response.error) {
             alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
            return

        }

        this.categoryExpense = result;
        console.log(this.categoryExpense.response.title)

        return result.response.message;

    }

    private async updateOrder(e: Event): Promise<void> {
        e.preventDefault();

        const changedData: {} | CreateDataType = {};

        if (this.expenseInputElement?.value !== (this.categoryExpense as HttpResultType).response.title) {
            (changedData as CreateDataType).title = this.expenseInputElement?.value;
        }

        const response: DeleteReturnObjectType = await ExpenseService.updateExpense((this.categoryExpense as HttpResultType).response.id, changedData);

        if (response.error) {
            alert(response.error);
            // return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        window.location.href = '/expense';
        return

    }
}