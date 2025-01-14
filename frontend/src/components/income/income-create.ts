import {IncomeService} from "../../services/income-service";
import {CreateDataType} from "../../types/create-data.type";
import {ReturnObjectData} from "../../types/return-object-data.type";

export class IncomeCreate {
    private incomeInputElement: HTMLInputElement | null;

    constructor() {
        const saveIncomeButton: HTMLElement | null = document.getElementById('saveIncomeButton');
        const cancelButton: HTMLElement | null = document.getElementById('cancelButton');

        saveIncomeButton?.addEventListener('click', this.saveCategory.bind(this));
        cancelButton?.addEventListener('click', this.cancelCategory.bind(this));
        this.incomeInputElement = document.getElementById('create-input') as HTMLInputElement;

    }

    private async saveCategory(e: Event): Promise<void> {
        e.preventDefault();

        const createData: CreateDataType = {
            title: this.incomeInputElement?.value,
        };

        const response: ReturnObjectData = await IncomeService.createIncome(createData);

        if (response.error) {
            alert(response.error);
            response.redirect ? window.location.href = response.redirect : null;
            return
        }
        window.location.href = '/income';
        return

    };

    private async cancelCategory(e: Event): Promise<void> {
        e.preventDefault();
         window.location.href = '/income';
        return
    };


}