import {IncomeService} from "../../services/income-service";

export class OperationsDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
    }


    async deleteCategory() {

        const response = await IncomeService.deleteIncome(this.currentId);

        console.log(response)

        if (response.error){
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        // return this.openNewRoute('/income');
    }
}