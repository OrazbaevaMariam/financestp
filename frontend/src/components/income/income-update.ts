import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpResultType} from "../../types/http-result.type";
import {CreateDataType} from "../../types/create-data.type";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";

export class IncomeUpdate {
    private categoryIncome: HttpResultType | void | undefined | CategoriesIncomeType;
    private incomeInputElement: HTMLInputElement | null;

    constructor() {

        const id: string | null = UrlUtils.getUrlParam('id');
        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        const cancelButton: HTMLElement | null = document.getElementById('cancelButton');
        if (!id) {
            location.href = "/";
        }
        this.incomeInputElement = document.getElementById('incomeInput') as HTMLInputElement;

        updateButton?.addEventListener('click', this.updateOrder.bind(this));
        cancelButton?.addEventListener('click', this.updateOrder.bind(this));

        this.init(Number(id));
    }

    private async init(id: number): Promise<void> {
        this.categoryIncome = await this.getIncome(Number(id));

    }

    private async getIncome(id: number): Promise<HttpResultType | void > {
        const result: HttpResultType = await HttpUtils.request('/categories/income/' + id);
        if (result && result.response as CategoriesIncomeType) {
            this.incomeInputElement?.setAttribute('value', (result as unknown as CategoriesIncomeType).title)
        }


        if ((result as unknown as DefaultResponseType).error) {
            window.location.href = '/income';
            return;
        }

        if (result.response.error || !result.response.title || !result.response.id || (result.response.id && result.response.error) || result.response.title && result.response.error) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.categoryIncome = result;
        return result;
    }

   private async updateOrder(e: Event): Promise<void> {
        e.preventDefault();

        const changedData: {} | CreateDataType = {};

        if (this.incomeInputElement?.value !== (this.categoryIncome as CategoriesIncomeType).title) {
            (changedData as CreateDataType).title = this.incomeInputElement?.value;
        }

        const response: DeleteReturnObjectType = await IncomeService.updateIncome((this.categoryIncome as CategoriesIncomeType).id, changedData as CreateDataType);

        if (response.error) {
            console.log('error', response.error)
            // alert(response.error);
             response.redirect ? window.location.href = response.redirect : null;
            return
        }
         window.location.href = '/income';
       return


    }
}