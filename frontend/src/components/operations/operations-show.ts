import {HttpUtils} from "../../utils/http-utils";
import {OperationsService} from "../../services/operations-service";
import {CreateOperationType} from "../../types/create-operation.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {DeleteReturnObjectType} from "../../types/delete-return-object.type";
import {HttpResultType} from "../../types/http-result.type";
import {ResultsFilter} from "../../types/results-filter.type";

export class OperationsList {
   private currentIdDelete : number | null = null;
    private operations: Array<CreateOperationType> | DefaultResponseType | undefined | ResultsFilter;
    private tableBody: HTMLTableElement | null;
    readonly dateStart: HTMLInputElement | null;
    readonly dateEnd: HTMLInputElement | null;
    private currentIdEdit: number | null = null;
    private operationDeleteButton: HTMLElement | null = null;
    private todayFilter: HTMLElement | null = null;
    private weekFilter: HTMLElement | null = null;
    private monthFilter: HTMLElement | null = null;
    private yearFilter: HTMLElement | null = null;
    private allDatesFilter: HTMLElement | null = null;
    private intervalFilter: HTMLElement | null = null;



    constructor() {

        this.tableBody = document.getElementById('table-body') as HTMLTableElement;
        this.dateStart = document.getElementById('date-start') as HTMLInputElement;
        this.dateEnd = document.getElementById('date-end') as HTMLInputElement;

        this.allDatesFilter?.addEventListener('click', () => this.allDatesFilterF());
        this.todayFilter?.addEventListener('click', () => this.init());
        this.weekFilter?.addEventListener('click', () => this.weekFilterF());
        this.monthFilter?.addEventListener('click', () => this.monthFilterF());
        this.yearFilter?.addEventListener('click', () => this.yearFilterF());
        this.intervalFilter?.addEventListener('click', () => this.intervalFilterF());

        this.operationDeleteButton?.addEventListener('click', () => this.deleteOperation());

        this.init();

    }

   private async init(): Promise<void> {
        await this.todayFilterF()

    }

   private showOperations(): void {
        if (this.tableBody){
            this.tableBody.innerHTML = '';
        }

        if (Array.isArray(this.operations)){
        this.operations?.forEach((operation: CreateOperationType, index: number): void => {
            const table: HTMLTableRowElement = document.createElement('tr');

            const number: HTMLTableCellElement = document.createElement('th');
            number.setAttribute('scope', 'row');
            number.innerText = String(index + 1);

            const operationType: HTMLTableCellElement = document.createElement('td');
            operationType.classList.add('text-success', 'text-center');
            if (operation.type === "income") {
                // operationType.innerText = operation.type;
                operationType.innerText = "Доход";
                operationType.className = "text-success";
            } else {
                operationType.innerText = "Расход";
                operationType.className = "text-danger";
            }



            const operationCategory: HTMLTableCellElement = document.createElement('td');
            operationCategory.innerText = String(operation.category);

            const operationAmount: HTMLTableCellElement = document.createElement('td');
            operationAmount.innerText = operation.amount + '$';

            const operationDate: HTMLTableCellElement = document.createElement('td');
            operationDate.innerText = operation.date;

            const operationComment: HTMLTableCellElement = document.createElement('td');
            operationComment.innerText = operation.comment;

            const operationDeleteOperation: HTMLTableCellElement = document.createElement('td');
            const operationDeleteOperationLink: HTMLAnchorElement = document.createElement('a');
            operationDeleteOperationLink.setAttribute('href', '/operations/delete?id=' + operation.category_id);
            operationDeleteOperationLink.setAttribute('type', 'button');
            operationDeleteOperationLink.setAttribute('data-bs-toggle', 'modal');
            operationDeleteOperationLink.setAttribute('data-bs-target', '#deleteOperation');
            const operationDeleteOperationIcon: HTMLElement = document.createElement('i');
            operationDeleteOperationIcon.classList.add('bi', 'bi-trash', 'deleteOperation');
            operationDeleteOperationLink.appendChild(operationDeleteOperationIcon);
            operationDeleteOperation.appendChild(operationDeleteOperationLink);
            operationDeleteOperation.onclick = () => {
                this.currentIdDelete = operation.category_id;
                if (this.currentIdDelete){
                    operationDeleteOperationLink.setAttribute('id', this.currentIdDelete.toString());
                }
            };


            const operationEditOperation:HTMLTableCellElement = document.createElement('td');
            const operationEditOperationLink:HTMLAnchorElement = document.createElement('a');
            operationEditOperationLink.setAttribute('href', '/operations/edit?id=' + operation.category_id);
            const operationEditOperationLinkIcon: HTMLElement = document.createElement('i');
            operationEditOperationLinkIcon.classList.add('bi', 'bi-pencil');
            operationEditOperationLink.appendChild(operationEditOperationLinkIcon);
            operationEditOperation.appendChild(operationEditOperationLink);
            operationEditOperation.onclick = () => {
                this.currentIdEdit = operation.category_id;
            };

            table.appendChild(number);
            table.appendChild(operationType);
            table.appendChild(operationCategory);
            table.appendChild(operationAmount);
            table.appendChild(operationDate);
            table.appendChild(operationComment);
            table.appendChild(operationDeleteOperation);
            table.appendChild(operationEditOperation);

            this.tableBody?.appendChild(table);
        });
        }
    }

   private async todayFilterF(): Promise<void> {
       this.todayFilter?.classList.add('active');
       this.allDatesFilter?.classList.remove('active');
       this.monthFilter?.classList.remove('active');
       this.yearFilter?.classList.remove('active');
       this.intervalFilter?.classList.remove('active');
       this.weekFilter?.classList.remove('active');
        try {
            const result: HttpResultType = await HttpUtils.request('/operations');
            if (result && result.response as CreateOperationType) {
                this.operations = result.response as CreateOperationType[];
                this.showOperations()

            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }

        } catch (error) {
            console.log(error)
        }

    }

    private async weekFilterF(): Promise<void> {
        this.weekFilter?.classList.add('active');
        this.allDatesFilter?.classList.remove('active');
        this.monthFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        try {
            const result: HttpResultType = await OperationsService.getOperationsFilter('', (this.dateStart as HTMLInputElement) , (this.dateEnd as HTMLInputElement), 'week');
            console.log(result)

            if (result && result.response as CreateOperationType[]) {
                this.operations = result.response as CreateOperationType[];
                console.log(this.operations)

                this.showOperations()

            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

    }

    private async allDatesFilterF(): Promise<void> {
        this.allDatesFilter?.classList.add('active');
        this.monthFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('', (this.dateStart as HTMLInputElement), (this.dateEnd as HTMLInputElement), 'all');
            if (result && result.response as CreateOperationType[]) {

                this.operations = result.response as CreateOperationType[];
                this.showOperations();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

    }

    private async monthFilterF(): Promise<void> {
        this.monthFilter?.classList.add('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        this.allDatesFilter?.classList.remove('active');
        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('', (this.dateStart as HTMLInputElement), (this.dateEnd as HTMLInputElement), 'month');
            if (result && result.response as CreateOperationType[]) {

                this.operations = result.response as CreateOperationType[];
                this.showOperations();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

    }

    private async yearFilterF(): Promise<void> {
        this.yearFilter?.classList.add('active');
        this.intervalFilter?.classList.remove('active');
        this.monthFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        this.allDatesFilter?.classList.remove('active');

        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('', (this.dateStart as HTMLInputElement), (this.dateEnd as HTMLInputElement), 'year');
            if (result && result.response as CreateOperationType[]) {

                this.operations = result.response as CreateOperationType[];
                this.showOperations();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

    }

    private  async intervalFilterF(): Promise<void> {
        this.intervalFilter?.classList.add('active');
        this.monthFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        this.allDatesFilter?.classList.remove('active');

        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('interval', (this.dateStart as HTMLInputElement), (this.dateEnd as HTMLInputElement), null);
            if (result && result.response as CreateOperationType[]) {

                this.operations = result.response as CreateOperationType[];
                this.showOperations();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

    }

  private  async deleteOperation(): Promise<void> {

        const response: DeleteReturnObjectType | undefined = await OperationsService.deleteOperation(Number(this.currentIdDelete));

        if (response?.error) {
            alert(response.error);
             response.redirect ? window.location.href = response.redirect : null;
            return
        }
         window.location.href = '/operations';
      return
    }

}