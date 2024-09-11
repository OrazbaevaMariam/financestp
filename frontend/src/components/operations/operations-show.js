import {HttpUtils} from "../../utils/http-utils";
import {OperationsService} from "../../services/operations-service";

export class OperationsList {
    currentIdDelete = null;

    constructor() {

        this.operations = null;
        this.tableBody = document.getElementById('table-body');
        const operationDeleteButton = document.getElementById('operationDeleteButton');
        const todayFilter = document.getElementById('todayFilter');
        const weekFilter = document.getElementById('weekFilter');
        const monthFilter = document.getElementById('monthFilter');
        const yearFilter = document.getElementById('yearFilter');
        const allDatesFilter = document.getElementById('allDatesFilter');
        const intervalFilter = document.getElementById('intervalFilter');
        this.dateStart = document.getElementById('date-start');
        this.dateEnd = document.getElementById('date-end');

        allDatesFilter.addEventListener('click', () => this.allDatesFilter());
        todayFilter.addEventListener('click', () => this.init());
        weekFilter.addEventListener('click', () => this.weekFilter());
        monthFilter.addEventListener('click', () => this.monthFilter());
        yearFilter.addEventListener('click', () => this.yearFilter());
        intervalFilter.addEventListener('click', () => this.intervalFilter());

        operationDeleteButton.addEventListener('click', () => this.deleteOperation());

        this.init();

    }

    async init() {
        await this.todayFilter()

    }

    showOperations() {
        this.tableBody.innerHTML = '';

        this.operations.response.forEach((operation, index) => {
            console.log(operation)
            const table = document.createElement('tr');

            const number = document.createElement('th');
            number.setAttribute('scope', 'row');
            number.innerText = index + 1;

            const operationType = document.createElement('td');
            operationType.classList.add('text-success', 'text-center');
            // console.log(operation.type)
            if (operation.type === "income") {
                // operationType.innerText = operation.type;
                operationType.innerText = "Доход";
                operationType.className = "text-success";
            } else {
                operationType.innerText = "Расход";
                operationType.className = "text-danger";
            }


            const operationCategory = document.createElement('td');
            operationCategory.innerText = operation.category;

            const operationAmount = document.createElement('td');
            operationAmount.innerText = operation.amount + '$';

            const operationDate = document.createElement('td');
            operationDate.innerText = operation.date;

            const operationComment = document.createElement('td');
            operationComment.innerText = operation.comment;

            const operationDeleteOperation = document.createElement('td');
            const operationDeleteOperationLink = document.createElement('a');
            operationDeleteOperationLink.setAttribute('href', '/operations/delete?id=' + operation.id);
            operationDeleteOperationLink.setAttribute('type', 'button');
            operationDeleteOperationLink.setAttribute('data-bs-toggle', 'modal');
            operationDeleteOperationLink.setAttribute('data-bs-target', '#deleteOperation');
            const operationDeleteOperationIcon = document.createElement('i');
            operationDeleteOperationIcon.classList.add('bi', 'bi-trash', 'deleteOperation');
            operationDeleteOperationLink.appendChild(operationDeleteOperationIcon);
            operationDeleteOperation.appendChild(operationDeleteOperationLink);
            operationDeleteOperation.onclick = () => {
                this.currentIdDelete = operation.id;
                operationDeleteOperationLink.setAttribute('id', this.currentIdDelete);
                console.log(this.currentIdDelete)
            };


            const operationEditOperation = document.createElement('td');
            const operationEditOperationLink = document.createElement('a');
            operationEditOperationLink.setAttribute('href', '/operations/edit?id=' + operation.id);
            const operationEditOperationLinkIcon = document.createElement('i');
            operationEditOperationLinkIcon.classList.add('bi', 'bi-pencil');
            operationEditOperationLink.appendChild(operationEditOperationLinkIcon);
            operationEditOperation.appendChild(operationEditOperationLink);
            operationEditOperation.onclick = () => {
                this.currentIdEdit = operation.id;
                console.log(this.currentIdEdit)
            };

            table.appendChild(number);
            table.appendChild(operationType);
            table.appendChild(operationCategory);
            table.appendChild(operationAmount);
            table.appendChild(operationDate);
            table.appendChild(operationComment);
            table.appendChild(operationDeleteOperation);
            table.appendChild(operationEditOperation);

            this.tableBody.appendChild(table);


        });

    }

    async todayFilter() {
        todayFilter.classList.add('active');
        allDatesFilter.classList.remove('active');
        monthFilter.classList.remove('active');
        yearFilter.classList.remove('active');
        intervalFilter.classList.remove('active');
        weekFilter.classList.remove('active');
        try {
            const result = await HttpUtils.request('/operations');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.showOperations()
            }
        } catch (error) {
            console.log(error)
        }

    }

    async weekFilter() {
        weekFilter.classList.add('active');
        allDatesFilter.classList.remove('active');
        monthFilter.classList.remove('active');
        yearFilter.classList.remove('active');
        intervalFilter.classList.remove('active');
        todayFilter.classList.remove('active');
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'week');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.showOperations();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async allDatesFilter() {
        allDatesFilter.classList.add('active');
        monthFilter.classList.remove('active');
        yearFilter.classList.remove('active');
        intervalFilter.classList.remove('active');
        weekFilter.classList.remove('active');
        todayFilter.classList.remove('active');
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'all');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.showOperations();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async monthFilter() {
        monthFilter.classList.add('active');
        yearFilter.classList.remove('active');
        intervalFilter.classList.remove('active');
        weekFilter.classList.remove('active');
        todayFilter.classList.remove('active');
        allDatesFilter.classList.remove('active');
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'month');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.showOperations();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async yearFilter() {
        yearFilter.classList.add('active');
        intervalFilter.classList.remove('active');
        monthFilter.classList.remove('active');
        weekFilter.classList.remove('active');
        todayFilter.classList.remove('active');
        allDatesFilter.classList.remove('active');

        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'year');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.showOperations();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async intervalFilter() {
        intervalFilter.classList.add('active');
        monthFilter.classList.remove('active');
        weekFilter.classList.remove('active');
        yearFilter.classList.remove('active');
        todayFilter.classList.remove('active');
        allDatesFilter.classList.remove('active');

        try {
            const result = await OperationsService.getOperationsFilter('interval', this.dateStart, this.dateEnd, null);
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.showOperations();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async deleteOperation() {

        const response = await OperationsService.deleteOperation(this.currentIdDelete);
        console.log(response);

        if (response.error) {
            alert(response.error);
            return response.redirect ? window.location.href = response.redirect : null;
        }
        return window.location.href = '/operations';
    }

}