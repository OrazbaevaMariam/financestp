import {Chart} from "chart.js/auto";
import 'bootstrap';
import {HttpUtils} from "../utils/http-utils";
import {OperationsService} from "../services/operations-service";

export class Dashboard {
    constructor() {
        this.categoriesIncome = null;
        this.operations = null;
        this.dataIncomes = null;
        this.myChartIncome = null;
        this.myChartExpense = null;

        this.todayFilter = document.getElementById('today-filter');
        this.weekFilter = document.getElementById('week-filter');
        this.monthFilter = document.getElementById('month-filter');
        this.yearFilter = document.getElementById('year-filter');
        this.allDatesFilter = document.getElementById('all-dates-filter');
        this.intervalFilter = document.getElementById('interval-filter');
        this.dateStart = document.getElementById('date-start');
        this.dateEnd = document.getElementById('date-end');
        this.ChartIncome = document.getElementById('myChartIncome');
        this.ChartExpense = document.getElementById('myChartExpense');

        this.todayFilter.addEventListener('click', () => this.init());
        this.allDatesFilter.addEventListener('click', () => this.todayF());
        this.weekFilter.addEventListener('click', () => this.weekF());
        this.monthFilter.addEventListener('click', () => this.monthF());
        this.yearFilter.addEventListener('click', () => this.yearF());
        this.intervalFilter.addEventListener('click', () => this.intervalF());
        this.init();

    }

    async init() {
        await this.todayF();
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
            data: dataIncome,
            options
        };
        const configExpense = {
            type: 'pie',
            data: dataExpense,
            options
        };





        this.myChartIncome = new Chart(
           this.ChartIncome,
            configIncome,
        );
        // if(myChartIncome){
        //     myChartIncome.clear();
        //     myChartIncome.destroy();
        // };
        // if (myChartIncome) {
        //     myChartIncome.destroy();
        // }


        this.myChartExpense = new Chart(
            this.ChartExpense,
            configExpense,
        );
        // if (myChartExpense) {
        //     myChartExpense.destroy();
        // }

    }

    async todayF() {
        this.destroyCharts();
        this.todayFilter.classList.add('active');
        this.allDatesFilter.classList.remove('active');
        this.monthFilter.classList.remove('active');
        this.yearFilter.classList.remove('active');
        this.intervalFilter.classList.remove('active');
        this.weekFilter.classList.remove('active');
        try {
            const result = await HttpUtils.request('/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.categoriesIncome = result.response;
                // console.log(Object.values(this.categoriesIncome));

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
                // console.log(Object.values(this.categoriesExpense));

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
                // console.log(Object.values(this.operations));

            }
        } catch (error) {
            console.log(error)
        }

        this.dataIncomes = this.categoriesIncome.map(category => {
            const obj = {...category, amount: 0};
            this.operations.forEach(income => {
                if (income.category === category.title) {
                    obj.amount += income.amount
                }
            });
            return obj;
        });
        this.dataExpenses = this.categoriesExpense.map(category => {
            const obj = {...category, amount: 0};
            this.operations.forEach(income => {
                if (income.category === category.title) {
                    obj.amount += income.amount
                }
            });
            return obj;
        });
        await this.getPie();

    }

    async weekF() {
        this.destroyCharts();
        this.weekFilter.classList.add('active');
        this.allDatesFilter.classList.remove('active');
        this.monthFilter.classList.remove('active');
        this.yearFilter.classList.remove('active');
        this.intervalFilter.classList.remove('active');
        this.todayFilter.classList.remove('active');
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'week');
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

    async monthF() {
        this.destroyCharts();
        this.monthFilter.classList.add('active');
        this.yearFilter.classList.remove('active');
        this.intervalFilter.classList.remove('active');
        this.weekFilter.classList.remove('active');
        this.todayFilter.classList.remove('active');
        this.allDatesFilter.classList.remove('active');
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

    async yearF() {
        this.destroyCharts();
        this.yearFilter.classList.add('active');
        this.intervalFilter.classList.remove('active');
        this.monthFilter.classList.remove('active');
        this.weekFilter.classList.remove('active');
        this.todayFilter.classList.remove('active');
        this.allDatesFilter.classList.remove('active');
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

    async allDatesF() {
        this.destroyCharts();
        this.allDatesFilter.classList.add('active');
        this.monthFilter.classList.remove('active');
        this.yearFilter.classList.remove('active');
        this.intervalFilter.classList.remove('active');
        this.weekFilter.classList.remove('active');
        this.todayFilter.classList.remove('active');
        try {
            const result = await OperationsService.getOperationsFilter('', this.dateStart, this.dateEnd, 'all');
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

    async intervalF() {
        this.destroyCharts();
        this.intervalFilter.classList.add('active');
        this.monthFilter.classList.remove('active');
        this.weekFilter.classList.remove('active');
        this.yearFilter.classList.remove('active');
        this.todayFilter.classList.remove('active');
        this.allDatesFilter.classList.remove('active');
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
    destroyCharts() {
        if (this.myChartIncome){
            this.myChartIncome.destroy();
        }
        if (this.myChartExpense){
            this.myChartExpense.destroy();
        }
    }


}

