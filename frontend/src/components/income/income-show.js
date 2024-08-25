import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";

export class IncomeShow {

    currentId = null;
    constructor() {

        const id = UrlUtils.getUrlParam('id');
        // if (!id) {
        //     location.href = "/";
        // }
        this.categoriesIncome = null;
        this.incomeCategoryTitle = document.getElementById('incomeCategoryTitle');
        this.incomeCategoryEdit = document.getElementById('incomeCategoryEdit');
        this.incomeCategoryDelete = document.getElementById('incomeCategoryDelete');
        this.cards = document.getElementById('cards');

        this.init();
        document.getElementById('deleteButton').addEventListener('click', this.deleteCategory.bind(this));

        this.deleteCategory().then();
    //
    }

    async init() {
        try {
            const result = await HttpUtils.request('/categories/income');
            // console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.categoriesIncome = result;
                this.showCategoryIncome();
            }
        } catch (error) {
            console.log(error)
        }

    }

    showCategoryIncome() {
        // console.log(this.categoriesIncome.response)

        this.categoriesIncome.response.forEach(category => {

            const titleElement = document.createElement('h3');
            titleElement.className = 'income-name';
            titleElement.className = 'text-primary-emphasis';
            titleElement.setAttribute("id", "incomeCategoryTitle");
            titleElement.innerText = category.title;
            // console.log(category.title)


            const linkElement = document.createElement('a');
            linkElement.setAttribute("href", "/income/update?id=" + category.id);
            linkElement.setAttribute("type", "button");
            linkElement.classList.add('btn', 'btn-primary', 'me-1');
            linkElement.setAttribute("id", "incomeCategoryEdit");
            linkElement.innerText = 'Редактировать';


            const buttonElement = document.createElement('button');
            buttonElement.setAttribute("href", "/income/delete?id=" + category.id);
            buttonElement.setAttribute("type", "button");
            buttonElement.classList.add('btn', 'btn-danger', 'me-1');
            buttonElement.setAttribute("id", "incomeCategoryDelete");
            buttonElement.setAttribute("data-bs-toggle", "modal");
            buttonElement.setAttribute("data-bs-target", "#deleteIncome");
            buttonElement.innerText = 'Удалить';

            buttonElement.onclick = () => {}
            this.currentId = category.id;

            const incomeCard = document.createElement('div');
            incomeCard.classList.add('income-card', 'p-3');

            const card = document.createElement('div');
            card.classList.add('col-4', 'border', 'rounded-4', 'card', 'me-4', 'gy-4');

            incomeCard.appendChild(titleElement);
            incomeCard.appendChild(linkElement);
            incomeCard.appendChild(buttonElement);
            card.appendChild(incomeCard);
            this.cards.prepend(card)


        });

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