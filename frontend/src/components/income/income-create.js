import {IncomeService} from "../../services/income-service";

export class IncomeCreate {

    constructor() {


        document.getElementById('saveIncomeButton').addEventListener('click', this.saveCategory.bind(this));
        document.getElementById('cancelButton').addEventListener('click', this.cancelCategory.bind(this));

        this.findElements();

    }

    findElements() {
        this.incomeInputElement = document.getElementById('create-input');
    };

    async saveCategory(e) {
        e.preventDefault();

        const createData = {
            title: this.incomeInputElement.value,
        };

        const response = await IncomeService.createIncome(createData);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income');
    };
    async cancelCategory(e) {
        e.preventDefault();

        return this.openNewRoute('/income');
    };


}