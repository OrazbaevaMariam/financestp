import {IncomeService} from "../../services/income-service";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";

export class OperationsDelete {
    private currentId: number | null = null;

    constructor() {
    }

    private async deleteCategory(): Promise<void> {
        if (this.currentId) {

            const response: DeleteReturnObjectType = await IncomeService.deleteIncome(this.currentId);

            if (response.error) {
                alert(response.error);
                 response.redirect ? location.href = response.redirect : null;
                return
            }
            window.location.href = '/income';
            return

        }
    }
}