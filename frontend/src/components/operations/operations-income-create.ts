import {IncomeService} from "../../services/income-service";
import {OperationsService} from "../../services/operations-service";
import {ReturnObjectIncomeInputType} from "../../types/return-object-expense.type";
import {CreateOperationType} from "../../types/create-operation.type";
import {ReturnObjectData} from "../../types/return-object-data.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";

export class OperationsIncomeCreate {
    private categoryIncome: CategoriesIncomeType | null | undefined = null;
    private incomeCreateInputSelectElement: HTMLInputElement | null;
    private incomeCreateInputAmountElement: HTMLInputElement | null;
    private incomeCreateInputDateElement: HTMLInputElement | null;
    private incomeCreateInputCommentElement: HTMLInputElement | null;
    private incomeCreateSelectCategoryElement: HTMLOptionElement | null;
    private incomeCreateSelectOptionElement: HTMLOptionElement | null = null;


    constructor() {
        const createIncomeButton = document.getElementById('createIncomeButton');
        const cancelIncomeButton = document.getElementById('cancelIncomeButton');
        this.incomeCreateInputSelectElement = document.getElementById('input-income-type') as HTMLInputElement;
        this.incomeCreateSelectCategoryElement = document.getElementById('input-income-category') as HTMLOptionElement;
        // this.incomeCreateISelectIncomeCategoryElement = document.getElementById('selectIncomeCategory');
        // this.incomeCreateSelectOptionElement = document.getElementById('input-income-option');
        this.incomeCreateInputAmountElement = document.getElementById('input-income-sum') as HTMLInputElement;
        this.incomeCreateInputDateElement = document.getElementById('input-income-date') as HTMLInputElement;
        this.incomeCreateInputCommentElement = document.getElementById('input-income-message') as HTMLInputElement;
        createIncomeButton?.addEventListener('click', this.saveIncome.bind(this));
        cancelIncomeButton?.addEventListener('click', this.cancelIncome.bind(this));


        this.init();
    }


    private async init(): Promise<void> {
        await this.getIncomes();
    }

    private async getIncomes(): Promise<void> {
        const result: ReturnObjectIncomeInputType | CategoriesIncomeType = await IncomeService.getIncomes();

        this.categoryIncome = result.incomes;
        if (this.categoryIncome) {

            for (let value of Object.values(this.categoryIncome) as CategoriesIncomeType[]) {
                this.incomeCreateSelectOptionElement = document.createElement('option') as HTMLOptionElement;
                this.incomeCreateSelectOptionElement.value = value.id.toString();
                this.incomeCreateSelectOptionElement.innerText = value.title;
                this.incomeCreateSelectCategoryElement?.appendChild(this.incomeCreateSelectOptionElement);
            }
        }

    }


    private async saveIncome(e: Event): Promise<void | null | string> {
        e.preventDefault();

        const createData: CreateOperationType = {
            type: "income",
            amount: Number(this.incomeCreateInputAmountElement?.value),
            date: this.incomeCreateInputDateElement?.value as string,
            comment: this.incomeCreateInputCommentElement?.value as string,
            category_id: Number(this.incomeCreateSelectCategoryElement?.value)
        };

        const response: ReturnObjectData = await OperationsService.createOperation(createData);

        if (response.error) {
            alert(response.error);
            return response.redirect ? window.location.href = response.redirect : null;
        }
        window.location.href = '/operations';
        return


        // this.incomeCreateSelectCategoryElement.value = ;

        // if (ValidationUtils.validateForm(this.validations)) {
        //     const createData = {
        //         type: this.incomeCreateInputSelectElement.value,
        //         category: this.incomeCreateSelectCategoryElement.value,
        //         sum: this.incomeCreateInputAmountElement.value,
        //         date: this.incomeCreateInputDateElement.toISOString(),
        //     };
        //
        //     if (this.incomeCreateInputCommentElement) {
        //         createData.message = this.incomeCreateInputCommentElement.value;
        //     }
        //     const response = await IncomeService.createIncome(createData);
        //
        //     if (response.error) {
        //         alert(response.error);
        //         return response.redirect ? this.openNewRoute(response.redirect) : null;
        //     }
        //
        //     return this.openNewRoute('/operations');
        // }
    }

    private async cancelIncome(e: Event): Promise<void> {
        e.preventDefault();
        window.location.href = '/operations';
        return
    };


}