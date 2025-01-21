import {Chart, ChartItem, ChartTypeRegistry} from "chart.js/auto";
import 'bootstrap';
import {HttpUtils} from "../utils/http-utils";
import {OperationsService} from "../services/operations-service";
import { HttpResultType } from "../types/http-result.type";
import {CategoriesIncomeType} from "../types/categories-income.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesExpenseType} from "../types/categories-expense.type";
import {CreateOperationType} from "../types/create-operation.type";
import {ResultsFilter} from "../types/results-filter.type";
import {ConfigIncomeType} from "../types/config-income.type";

export class Dashboard {
   private categoriesIncome: CategoriesIncomeType[] | undefined;
   private categoriesExpense: CategoriesExpenseType[] | undefined;
   private operations: CreateOperationType[] | null | ResultsFilter[] | undefined;
    private dataExpenses: CategoriesExpenseType[] | undefined;
   private dataIncomes: CategoriesIncomeType[] | undefined;
   private myChartIncome: Chart<keyof ChartTypeRegistry, any[] | undefined, string> | undefined;
   private myChartExpense: Chart<keyof ChartTypeRegistry, any[] | undefined, string> | undefined;
   private todayFilter: HTMLElement | null;
   private weekFilter: HTMLElement | null;
   private monthFilter: HTMLElement | null;
   private yearFilter: HTMLElement | null;
   private allDatesFilter: HTMLElement | null;
   private intervalFilter: HTMLElement | null;
   private dateStart: HTMLInputElement | null;
   private dateEnd: HTMLInputElement | null;
   private ChartIncome: ChartItem;
    private ChartExpense: ChartItem;
    private operationsIncome: boolean[] | undefined;
    private operationsExpense: boolean[] | undefined;




    constructor() {

        this.todayFilter = document.getElementById('today-filter');
        this.weekFilter = document.getElementById('week-filter');
        this.monthFilter = document.getElementById('month-filter');
        this.yearFilter = document.getElementById('year-filter');
        this.allDatesFilter = document.getElementById('all-dates-filter');
        this.intervalFilter = document.getElementById('interval-filter');
        this.dateStart = document.getElementById('date-start') as HTMLInputElement;
        this.dateEnd = document.getElementById('date-end') as HTMLInputElement;
        this.ChartIncome = document.getElementById('myChartIncome') as ChartItem;
        this.ChartExpense = document.getElementById('myChartExpense') as ChartItem;


        this.todayFilter?.addEventListener('click', () => this.init());
        this.allDatesFilter?.addEventListener('click', () => this.allDatesF());
        this.weekFilter?.addEventListener('click', () => this.weekF());
        this.monthFilter?.addEventListener('click', () => this.monthF());
        this.yearFilter?.addEventListener('click', () => this.yearF());
        this.intervalFilter?.addEventListener('click', () => this.intervalF());
        this.init();

    }

  private  async init(): Promise<void> {
        await this.todayF();
    }



   private async todayF(): Promise<void> {
        this.destroyCharts();
        this.todayFilter?.classList.add('active');
        this.allDatesFilter?.classList.remove('active');
        this.monthFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');
            if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            // const result = await HttpUtils.request('/operations?period=all');
            const result: HttpResultType = await HttpUtils.request('/operations');
            if (result && result.response as CreateOperationType) {
                this.operations = result.response as CreateOperationType[];
                console.log(Object.values(this.operations));

            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

        this.dataIncomes = (this.categoriesIncome)?.map((category: CategoriesIncomeType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
            this.operations?.forEach(income => {
                if ((income as CreateOperationType).category_id === category.id) {
                    obj.amount += (income as CreateOperationType).amount
                }
            })}
            return obj;
        });

        this.dataExpenses = (this.categoriesExpense)?.map((category: CategoriesExpenseType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
            this.operations?.forEach(expense => {
                if ((expense as CreateOperationType).category_id === category.id) {
                    obj.amount += (expense as CreateOperationType).amount
                }
            })}
            return obj;
        });
        await this.getPie();

    }

    private async weekF(): Promise<void> {
        this.destroyCharts();
        this.weekFilter?.classList.add('active');
        this.allDatesFilter?.classList.remove('active');
        this.monthFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('', (this.dateStart as HTMLInputElement), (this.dateEnd as HTMLInputElement), 'week');

            if (result && result.response as ResultsFilter) {
                this.operations = result.response as ResultsFilter[];
                console.log(this.operations)
                // this.getPie();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');

            if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
                // console.log(Object.values(this.categoriesIncome));
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)

        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        this.dataIncomes = (this.categoriesIncome)?.map((category: CategoriesIncomeType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(income => {
                    if ((income as CreateOperationType).category_id === category.id) {
                        obj.amount += (income as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        this.dataExpenses = (this.categoriesExpense)?.map((category: CategoriesExpenseType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(expense => {
                    if ((expense as CreateOperationType).category_id === category.id) {
                        obj.amount += (expense as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        await this.getPie();

    }

  private  async monthF(): Promise<void> {
        this.destroyCharts();
        this.monthFilter?.classList.add('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        this.allDatesFilter?.classList.remove('active');
        try {
            const result: HttpResultType = await OperationsService.getOperationsFilter('', this.dateStart as HTMLInputElement, this.dateEnd as HTMLInputElement, 'month');
            if (result && result.response as ResultsFilter) {
                this.operations = result.response as ResultsFilter[];
                console.log(this.operations)
                // this.getPie();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');
            if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

        this.dataIncomes = (this.categoriesIncome)?.map((category: CategoriesIncomeType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(income => {
                    if ((income as CreateOperationType).category_id === category.id) {
                        obj.amount += (income as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        this.dataExpenses = (this.categoriesExpense)?.map((category: CategoriesExpenseType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(expense => {
                    if ((expense as CreateOperationType).category_id === category.id) {
                        obj.amount += (expense as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        await this.getPie();

    }

   private async yearF(): Promise<void> {
        this.destroyCharts();
        this.yearFilter?.classList.add('active');
        this.intervalFilter?.classList.remove('active');
        this.monthFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        this.allDatesFilter?.classList.remove('active');
        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('', this.dateStart as HTMLInputElement, this.dateEnd as HTMLInputElement, 'year');
            if (result && result.response as ResultsFilter) {
                this.operations = result.response as ResultsFilter[];
                // this.getPie();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');
            if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

        this.dataIncomes = (this.categoriesIncome)?.map((category: CategoriesIncomeType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(income => {
                    if ((income as CreateOperationType).category_id === category.id) {
                        obj.amount += (income as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        this.dataExpenses = (this.categoriesExpense)?.map((category: CategoriesExpenseType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(expense => {
                    if ((expense as CreateOperationType).category_id === category.id) {
                        obj.amount += (expense as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        await this.getPie();

    }

   private async allDatesF(): Promise<void> {
        this.destroyCharts();
        this.allDatesFilter?.classList.add('active');
        this.monthFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.intervalFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('', this.dateStart as HTMLInputElement, this.dateEnd as HTMLInputElement, 'all');
            // const result = await OperationsService.getOperationsFilter('interval', this.dateStart, this.dateEnd, null);
            if (result && result.response as ResultsFilter) {
                this.operations = result.response as ResultsFilter[];
                // this.getPie();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');
            if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

        this.dataIncomes = (this.categoriesIncome)?.map((category: CategoriesIncomeType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(income => {
                    if ((income as CreateOperationType).category_id === category.id) {
                        obj.amount += (income as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        this.dataExpenses = (this.categoriesExpense)?.map((category: CategoriesExpenseType) => {
            const obj = {...category, amount: 0};
            if (Array.isArray(this.operations)) {
                this.operations?.forEach(expense => {
                    if ((expense as CreateOperationType).category_id === category.id) {
                        obj.amount += (expense as CreateOperationType).amount
                    }
                })}
            return obj;
        });
        await this.getPie();


    }

  private  async intervalF(): Promise<void> {
        this.destroyCharts();
        this.intervalFilter?.classList.add('active');
        this.monthFilter?.classList.remove('active');
        this.weekFilter?.classList.remove('active');
        this.yearFilter?.classList.remove('active');
        this.todayFilter?.classList.remove('active');
        this.allDatesFilter?.classList.remove('active');
        try {
            const result: ResultsFilter = await OperationsService.getOperationsFilter('interval', this.dateStart as HTMLInputElement, this.dateEnd as HTMLInputElement, null);
            if (result && result.response as ResultsFilter) {
                this.operations = result.response as ResultsFilter[];
                // this.getPie();
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/income');
            if (result && result.response as CategoriesIncomeType) {
                this.categoriesIncome = result.response as CategoriesIncomeType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result: HttpResultType = await HttpUtils.request('/categories/expense');
            if (result && result.response as CategoriesExpenseType) {
                this.categoriesExpense = result.response as CategoriesExpenseType[];
            }
            if (result && result.error && result.response as DefaultResponseType) {
                throw new Error(result.response.message);
            }
        } catch (error) {
            console.log(error)
        }

      this.dataIncomes = (this.categoriesIncome)?.map((category: CategoriesIncomeType) => {
          const obj = {...category, amount: 0};
          if (Array.isArray(this.operations)) {
              this.operations?.forEach(income => {
                  if ((income as CreateOperationType).category_id === category.id) {
                      obj.amount += (income as CreateOperationType).amount
                  }
              })}
          return obj;
      });
      this.dataExpenses = (this.categoriesExpense)?.map((category: CategoriesExpenseType) => {
          const obj = {...category, amount: 0};
          if (Array.isArray(this.operations)) {
              this.operations?.forEach(expense => {
                  if ((expense as CreateOperationType).category_id === category.id) {
                      obj.amount += (expense as CreateOperationType).amount
                  }
              })}
          return obj;
      });
        await this.getPie();

    }

   private getPie(): void {
         this.operationsIncome = (this.operations as CreateOperationType[])?.map((item: CreateOperationType)=> item.type === "income")
         this.operationsExpense = (this.operations as CreateOperationType[])?.map((item: CreateOperationType)=> item.type === "expense")
        const dataIncome = {
            labels: (this.dataIncomes)?.map((item: CategoriesIncomeType): string => item.title),
            datasets: [{
                label: '# of Votes',
                data: (this.operationsIncome as unknown as CreateOperationType[])?.map((item: CreateOperationType) =>  item.amount),
                // data: (this.operations as CreateOperationType[])?.map((item: CreateOperationType) =>  item.amount),
                borderWidth: 1
            }]
        };

        const dataExpense = {
            labels: (this.dataIncomes)?.map((item: CategoriesExpenseType) => item.title),
            datasets: [{
                label: '# of Votes',
                data: (this.operationsExpense as unknown as CreateOperationType[])?.map((item: CreateOperationType) => item.amount),
                borderWidth: 1
            }]
        };
        console.log(this.operationsExpense);



        const options = {
            responsive: true,
            plugins: {
                legend: {
                    // display: false,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: ''
                }
            }
        };

        const configIncome: any = {
            type: 'pie',
            data: dataIncome,
            options
        };
        const configExpense: any = {
            type: 'pie',
            data: dataExpense,
            options
        };





        this.myChartIncome = new Chart(
            this.ChartIncome,
            configIncome,
        );


        this.myChartExpense = new Chart(
            this.ChartExpense,
            configExpense,
        );

    }

   private destroyCharts(): void {
        if (this.myChartIncome){
            this.myChartIncome.destroy();
        }
        if (this.myChartExpense){
            this.myChartExpense.destroy();
        }
        // debugger;

    }


}

