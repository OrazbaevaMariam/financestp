import {HttpUtils} from "../../utils/http-utils";
import {ExpenseService} from "../../services/expense-service";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesExpenseType} from "../../types/categories-expense.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";
import {HttpResultType} from "../../types/http-result.type";

export class ShowExpense {
    private currentId: number | null = null;
    private categoriesExpense: CategoriesExpenseType | DefaultResponseType | null = null;
    readonly cards: HTMLElement | null;
    private expenseCategoryTitle: HTMLElement | null;
    private expenseCategoryEdit: HTMLElement | null;
    private expenseCategoryDelete: HTMLElement | null;
    readonly deleteButton: HTMLElement | null;

    constructor() {
        const id = UrlUtils.getUrlParam('id');

        // this.categoriesExpense = null;
        this.cards = document.getElementById('cards');
        this.deleteButton = document.getElementById('deleteButton')
        this.expenseCategoryTitle = document.getElementById('expenseCategoryTitle');
        this.expenseCategoryEdit = document.getElementById('expenseCategoryEdit');
        this.expenseCategoryDelete = document.getElementById('expenseCategoryDelete');
        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', this.deleteCategory.bind(this));
        }

        this.init();
        // this.deleteCategory(this.currentId).then();

    }

    private async init(): Promise<void> {
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            // this.categoriesExpense = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType;
                this.showCategoryExpense();
                console.log(Object.values(this.categoriesExpense));
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }

    private showCategoryExpense(): void {
        if (Array.isArray(this.categoriesExpense)) {
            this.categoriesExpense?.forEach((category: CategoriesExpenseType) => {
                const titleElement: HTMLElement | null = document.createElement('h3');
                titleElement.className = 'expense-name';
                titleElement.className = 'text-primary-emphasis';
                titleElement.setAttribute("id", "expenseCategoryTitle");
                titleElement.innerText = category.title;

                const linkElement: HTMLElement | null = document.createElement('a');
                linkElement.setAttribute("href", "/expense/update?id=" + category.id);
                linkElement.setAttribute("type", "button");
                linkElement.classList.add('btn', 'btn-primary', 'me-1');
                linkElement.setAttribute("id", "expenseCategoryEdit");
                linkElement.innerText = 'Редактировать';


                const buttonElement: HTMLElement | null = document.createElement('button');
                buttonElement.setAttribute("href", "/expense/delete");
                buttonElement.setAttribute("type", "button");
                buttonElement.classList.add('btn', 'btn-danger', 'me-1');
                buttonElement.setAttribute("id", "expenseCategoryDelete");
                buttonElement.setAttribute("data-bs-toggle", "modal");
                buttonElement.setAttribute("data-bs-target", "#deleteExpense");
                buttonElement.innerText = 'Удалить';

                buttonElement.onclick = () => {
                    this.currentId = category.id;
                }

                const incomeCard: HTMLElement | null = document.createElement('div');
                incomeCard.classList.add('income-card', 'p-3');

                const card: HTMLElement | null = document.createElement('div');
                card.classList.add('col-4', 'border', 'rounded-4', 'card', 'me-4', 'gy-4');
                card.setAttribute('id', category.id.toString());

                incomeCard.appendChild(titleElement);
                incomeCard.appendChild(linkElement);
                incomeCard.appendChild(buttonElement);
                card.appendChild(incomeCard);
                if (this.cards) {
                    this.cards.prepend(card)
                }

           }
    )
    }
    }

    private async deleteCategory(): Promise<void> {
        if (this.currentId) {
            const response: DeleteReturnObjectType = await ExpenseService.deleteExpense(this.currentId);

            if (response.error) {
                alert(response.error);
                response.redirect ? window.location.href = response.redirect : null;
                return
            }
        }
    }
}