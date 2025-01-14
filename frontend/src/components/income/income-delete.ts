import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";

export class IncomeDelete {

    constructor() {

        const id: string | null = UrlUtils.getUrlParam('id');
        const incomeCategoryDelete: HTMLElement | null = document.getElementById('incomeCategoryDelete');
        if (!id) {
            location.href = "/";
        }
        incomeCategoryDelete?.addEventListener('click', ()=> {this.deleteIncome(id).then()});


    }

    private async deleteIncome(id: string | null): Promise<void> {
        const response: DeleteReturnObjectType = await IncomeService.deleteIncome(Number(id));
        if (response.error) {
            alert(response.error);
            response.redirect ? window.location.href = response.redirect : null;
            return
        }
        window.location.href = '/income';
        return


    }
}