import {HttpUtils} from "../../utils/http-utils";
import {ExpenseService} from "../../services/expense-service";
import {UrlUtils} from "../../utils/url-utils";

export class ShowExpense {
    currentId = null;

    constructor() {
        const id = UrlUtils.getUrlParam('id');

        this.categoriesExpense = null;
        this.cards = document.getElementById('cards');

        this.expenseCategoryTitle = document.getElementById('expenseCategoryTitle');
        this.expenseCategoryEdit = document.getElementById('expenseCategoryEdit');
        this.expenseCategoryDelete = document.getElementById('expenseCategoryDelete');

        document.getElementById('deleteButton').addEventListener('click', this.deleteCategory.bind(this));


        this.init();
        this.deleteCategory(id).then();

    }

    async init() {
        try {
            const result = await HttpUtils.request('/categories/expense');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.categoriesExpense = result;
                this.showCategoryExpense();
            }
        } catch (error) {
            console.log(error)
        }
    }

    showCategoryExpense() {
        this.categoriesExpense.response.forEach(category => {
            console.log(category)

            const titleElement = document.createElement('h3');
            titleElement.className = 'expense-name';
            titleElement.className = 'text-primary-emphasis';
            titleElement.setAttribute("id", "expenseCategoryTitle");
            titleElement.innerText = category.title;

            const linkElement = document.createElement('a');
            linkElement.setAttribute("href", "/expense/update?id=" + category.id);
            linkElement.setAttribute("type", "button");
            linkElement.classList.add('btn', 'btn-primary', 'me-1');
            linkElement.setAttribute("id", "expenseCategoryEdit");
            linkElement.innerText = 'Редактировать';


            const buttonElement = document.createElement('button');
            buttonElement.setAttribute("href", "/expense/delete");
            buttonElement.setAttribute("type", "button");
            buttonElement.classList.add('btn', 'btn-danger', 'me-1');
            buttonElement.setAttribute("id", "expenseCategoryDelete");
            buttonElement.setAttribute("data-bs-toggle", "modal");
            buttonElement.setAttribute("data-bs-target", "#deleteExpense");
            buttonElement.innerText = 'Удалить';

            buttonElement.onclick = () => {
                this.currentId = category;
            }

            const incomeCard = document.createElement('div');
            incomeCard.classList.add('income-card', 'p-3');

            const card = document.createElement('div');
            card.classList.add('col-4', 'border', 'rounded-4', 'card', 'me-4', 'gy-4');
            card.setAttribute('id', category.id)

            incomeCard.appendChild(titleElement);
            incomeCard.appendChild(linkElement);
            incomeCard.appendChild(buttonElement);
            card.appendChild(incomeCard)
            this.cards.prepend(card)

        });
        // this.cards.appendChild(addIncomeElement);

    }

    async deleteCategory() {
        const response = await ExpenseService.deleteExpense(this.currentId);
        console.log(response)

        if (response.error) {
            alert(response.error);
            return response.redirect ? window.location.href = response.redirect : null;
        }
        return window.location.href = '/expense';

    }

}