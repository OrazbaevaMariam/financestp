import {Chart} from "chart.js/auto";
import 'bootstrap';
import {HttpUtils} from "../utils/http-utils";
import {OperationsService} from "../services/operations-service";

export class Dashboard {
    constructor() {
        this.categoriesIncome = null;
        this.operations = null;
        this.dataIncomes = null;

        const weekFilter = document.getElementById('weekFilter');
        const monthFilter = document.getElementById('monthFilter');
        const yearFilter = document.getElementById('yearFilter');
        const allDatesFilter = document.getElementById('allDatesFilter');
        const intervalFilter = document.getElementById('intervalFilter');
        this.dateStart = document.getElementById('date-start');
        this.dateEnd = document.getElementById('date-end');
        allDatesFilter.addEventListener('click', () => this.init());
        weekFilter.addEventListener('click', () => this.weekFilter());
        monthFilter.addEventListener('click', () => this.monthFilter());
        yearFilter.addEventListener('click', () => this.yearFilter());
        intervalFilter.addEventListener('click', () => this.intervalFilter());
        this.init();

    }
    async init(){
        try {
            const result = await HttpUtils.request('/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.categoriesIncome = result.response;
                console.log(Object.values(this.categoriesIncome));

            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result = await HttpUtils.request('/categories/expense');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.categoriesExpense = result.response;
                console.log(Object.values(this.categoriesExpense));

            }
        } catch (error) {
            console.log(error)
        }
        try {
            const result = await HttpUtils.request('/operations?period=all');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result.response;
                console.log(Object.values(this.operations));

            }
        } catch (error) {
            console.log(error)
        }

        this.dataIncomes = this.categoriesIncome.map(category => {
            const obj = {...category, amount: 0};
            this.operations.forEach(income => {
                if (income.category === category.title){
                    obj.amount += income.amount
                }
            })
            return obj;
        })
        this.dataExpenses = this.categoriesExpense.map(category => {
            const obj = {...category, amount: 0};
            this.operations.forEach(income => {
                if (income.category === category.title){
                    obj.amount += income.amount
                }
            })
            return obj;
        })
        await this.getPie();
    }

    getPie() {

        const dataIncome = {
            labels: this.dataIncomes.map(item => item.title),
            datasets: [{
                label: '# of Votes',
                data: this.dataIncomes.map(item => item.amount),
                borderWidth: 1
            }]
        };

        const dataExpense = {
            labels: this.dataExpenses.map(item => item.title),
            datasets: [{
                label: '# of Votes',
                data: this.dataExpenses.map(item => item.amount),
                borderWidth: 1
            }]
        };

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

        const configIncome = {
            type: 'pie',
            data:dataIncome,
            options
        };
        const configExpense = {
            type: 'pie',
            data: dataExpense,
            options
        };


        const myChartIncome = new Chart(
            document.getElementById('myChartIncome'),
            configIncome,
        );
        // if(myChartIncome){
        //     myChartIncome.clear();
        //     myChartIncome.destroy();
        // };
        if(myChartIncome) {
            myChartIncome.destroy();
        }


        const myChartExpense = new Chart(
            document.getElementById('myChartExpense'),
            configExpense,
        )
        if(myChartExpense) {
            myChartExpense.destroy();
        }

    }
    async weekFilter() {
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'week');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }
    async monthFilter() {
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'month');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }
    async yearFilter() {
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'year');
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async intervalFilter() {
        try {
            const result = await OperationsService.getOperationsFilter('interval', this.dateStart, this.dateEnd, null);
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.operations = result;
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }

}

