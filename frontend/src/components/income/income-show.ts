import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoriesExpenseType} from "../../types/categories-expense.type";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";
import {HttpResultType} from "../../types/http-result.type";

export class IncomeShow {

    private currentId: number | null = null;
    private categoriesIncome: CategoriesIncomeType[] | null = null;
    private incomeCategoryTitle: HTMLElement | null;
    private incomeCategoryEdit: HTMLElement | null;
    private incomeCategoryDelete: HTMLElement | null;
    private cards: HTMLElement | null;

    constructor() {

        const id = UrlUtils.getUrlParam('id');
        const deleteButton = document.getElementById('deleteButton');
        // if (!id) {
        //     location.href = "/";
        // }
        this.incomeCategoryTitle = document.getElementById('incomeCategoryTitle');
        this.incomeCategoryEdit = document.getElementById('incomeCategoryEdit');
        this.incomeCategoryDelete = document.getElementById('incomeCategoryDelete');
        this.cards = document.getElementById('cards');

        this.init();
        deleteButton?.addEventListener('click', this.deleteCategory.bind(this));

        this.deleteCategory().then();
        //
    }

    private async init(): Promise<void> {
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');
            // console.log(result);
                if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
                this.showCategoryIncome();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
            return;
        }

    }

    private showCategoryIncome(): void {
        // console.log(this.categoriesIncome.response)

        this.categoriesIncome?.forEach((category: CategoriesIncomeType) => {

            const titleElement: HTMLElement | null = document.createElement('h3');
            titleElement.className = 'income-name';
            titleElement.className = 'text-primary-emphasis';
            titleElement.setAttribute("id", "incomeCategoryTitle");
            titleElement.innerText = category.title;
            // console.log(category.title)


            const linkElement: HTMLElement | null = document.createElement('a');
            linkElement.setAttribute("href", "/income/update?id=" + category.id);
            linkElement.setAttribute("type", "button");
            linkElement.classList.add('btn', 'btn-primary', 'me-1');
            linkElement.setAttribute("id", "incomeCategoryEdit");
            linkElement.innerText = 'Редактировать';


            const buttonElement: HTMLElement | null = document.createElement('button');
            buttonElement.setAttribute("href", "/income/delete?id=" + category.id);
            buttonElement.setAttribute("type", "button");
            buttonElement.classList.add('btn', 'btn-danger', 'me-1');
            buttonElement.setAttribute("id", "incomeCategoryDelete");
            buttonElement.setAttribute("data-bs-toggle", "modal");
            buttonElement.setAttribute("data-bs-target", "#deleteIncome");
            buttonElement.innerText = 'Удалить';

            buttonElement.onclick = () => {
                this.currentId = category.id;
            }

            const incomeCard: HTMLElement | null = document.createElement('div');
            incomeCard.classList.add('income-card', 'p-3');

            const card: HTMLElement | null = document.createElement('div');
            card.classList.add('col-4', 'border', 'rounded-4', 'card', 'me-4', 'gy-4');

            incomeCard.appendChild(titleElement);
            incomeCard.appendChild(linkElement);
            incomeCard.appendChild(buttonElement);
            card.appendChild(incomeCard);
            this.cards?.prepend(card)
        });

    }

    private async deleteCategory(): Promise<void> {
        if (this.currentId) {
            const response: DeleteReturnObjectType = await IncomeService.deleteIncome(this.currentId);
            if (response.error) {
                alert(response.error);
                response.redirect ? window.location.href = response.redirect : null;
                return
            }
        }
    }
}