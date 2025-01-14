import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";

export class ExpenseDelete {

    constructor() {
        const expenseCategoryDelete: HTMLElement | null = document.getElementById('expenseCategoryDelete');

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            location.href = "/";
        }
        expenseCategoryDelete?.addEventListener('click', ()=> {this.deleteExpense(id).then()});

    }

   private async deleteExpense(id: string | null): Promise<void> {
        const response: DeleteReturnObjectType = await ExpenseService.deleteExpense(Number(id));
        console.log(response)

        if (response.error) {
            alert(response.error);
             response.redirect ? window.location.href = response.redirect : null;
            return
        }
         window.location.href = '/expense';
       return


    }
}