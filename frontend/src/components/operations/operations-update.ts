import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {OperationsService} from "../../services/operations-service";
import {ExpenseService} from "../../services/expense-service";
import {OperationsFilterResponseType} from "../../types/operations-filter-response.type";
import {ReturnObjectExpenseType, ReturnObjectIncomeInputType} from "../../types/return-object-expense.type";
import {CreateOperationType} from "../../types/create-operation.type";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";
import {HttpResultType} from "../../types/http-result.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";

export class OperationsUpdate {

   private operationData: OperationsFilterResponseType | void | undefined | HttpResultType;
   private categoryExpense = null;
    private OperationType: HTMLInputElement | null;
    private OperationCategory: HTMLInputElement | null;
    private OperationSum: HTMLInputElement | null;
    private OperationDate: HTMLInputElement | null;
    private OperationMessage: HTMLInputElement | null;
    private currentOperation: HttpResultType | undefined;
    constructor() {

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            location.href = "/";
        }
        const updateOperationButton = document.getElementById('updateOperationButton');
        const cancelOperationButton = document.getElementById('cancelOperationButton');
        this.OperationType = document.getElementById('operation-type') as HTMLInputElement;
        this.OperationCategory = document.getElementById('operation-category') as HTMLInputElement;
        this.OperationSum = document.getElementById('operation-sum') as HTMLInputElement;
        this.OperationDate = document.getElementById('operation-date') as HTMLInputElement;
        this.OperationMessage = document.getElementById('operation-message') as HTMLInputElement;

        updateOperationButton?.addEventListener('click', this.updateOperation.bind(this));
        cancelOperationButton?.addEventListener('click', this.updateOperation.bind(this));

        this.init(Number(id)).then();
    }



    public async init(id: number): Promise<void> {
        this.operationData = await this.getOperation(id);

    }

   public async getOperation(id: number): Promise<OperationsFilterResponseType | void | undefined | HttpResultType> {
        const result: HttpResultType = await HttpUtils.request('/operations/' + id);
        this.currentOperation = result;
        if (result.response.type === "income") {
            (this.OperationType as HTMLInputElement).value = '1';
        } else {
            (this.OperationType as HTMLInputElement).value = '2';
        }
         this.showCategories();
        if (result.response.amount && result.response.date && result.response.comment) {
                this.OperationSum?.setAttribute('value', result.response.amount?.toString());
                this.OperationDate?.setAttribute('value', result.response.date)
                this.OperationMessage?.setAttribute('value', result.response.comment)
        }

        // if (result.redirect) {
        //     return window.location.href = result.redirect;
        // }

        if (result.error) {
             alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
            return
        }
        if (result){
            this.operationData = result;
        }

        return result;
    }

    private async showCategories(): Promise<void> {
        if (this.OperationType?.value === '1') {
            const categories: ReturnObjectIncomeInputType = await IncomeService.getIncomes();
            if (categories.incomes){
                await this.showCurrentCategories(categories.incomes)
            }
        } else {
            const categories: ReturnObjectExpenseType = await ExpenseService.getExpenses();
            if (categories.expenses) {
                await this.showCurrentCategories(categories.expenses)
            }
        }
    }

   private async showCurrentCategories(categories: CategoriesIncomeType[]): Promise<void> {
       (this.OperationCategory as HTMLInputElement).innerHTML = '';
       if (Array.isArray(categories)) {
        categories?.forEach((item: CategoriesIncomeType) => {
            const operationOptionElement = document.createElement('option');
            operationOptionElement.innerText = item.title;
            operationOptionElement.value = item.id.toString();
            operationOptionElement.setAttribute('value', item.id.toString());
            this.OperationCategory?.appendChild(operationOptionElement);
        })
       }
        const currentCategory: CategoriesIncomeType | undefined = categories.find((item: CategoriesIncomeType) => item.title === this.currentOperation?.response.category);
        if (currentCategory) {
            (this.OperationCategory as HTMLInputElement).value = currentCategory.id.toString();
        }
    }



    private async updateOperation(e: Event): Promise<void> {
        e.preventDefault();

        const changedData: {} | CreateOperationType = {};

        (changedData as CreateOperationType).type = this.OperationType?.value === '1' ? 'income' : 'expense';
        (changedData as CreateOperationType).category_id = Number(this.OperationCategory?.value);
        (changedData as CreateOperationType).amount = Number((this.OperationSum as HTMLInputElement)?.value);
        (changedData as CreateOperationType).date = (this.OperationDate as HTMLInputElement)?.value;
        (changedData as CreateOperationType).comment = this.OperationMessage?.value as string;

        const response: DeleteReturnObjectType = await OperationsService.updateOperation(Number((this.operationData as OperationsFilterResponseType)?.id), changedData);

        if (response.error) {
            console.log('error', response.error)
        }
         window.location.href = '/operations';
        return

    }
}