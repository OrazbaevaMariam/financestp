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

        const todayFilter = document.getElementById('today-filter');
        const weekFilter = document.getElementById('week-filter');
        const monthFilter = document.getElementById('month-filter');
        const yearFilter = document.getElementById('year-filter');
        const allDatesFilter = document.getElementById('all-dates-filter');
        const intervalFilter = document.getElementById('interval-filter');
        this.dateStart = document.getElementById('date-start');
        this.dateEnd = document.getElementById('date-end');
        const ChartIncome = document.getElementById('myChartIncome');
        const ChartExpense = document.getElementById('myChartExpense');

        todayFilter.addEventListener('click', () => this.init());
        allDatesFilter.addEventListener('click', () => this.todayFilter());
        weekFilter.addEventListener('click', () => this.weekFilter());
        monthFilter.addEventListener('click', () => this.monthFilter());
        yearFilter.addEventListener('click', () => this.yearFilter());
        intervalFilter.addEventListener('click', () => this.intervalFilter());
        this.init();

    }

    async init() {
        await this.todayFilter();
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
            ChartIncome,
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
            ChartExpense,
            configExpense,
        );
        // if (myChartExpense) {
        //     myChartExpense.destroy();
        // }

    }

    async todayFilter() {
        this.destroyCharts();
        todayFilter.classList.add('active');
        allDatesFilter.classList.remove('active');
        monthFilter.classList.remove('active');
        yearFilter.classList.remove('active');
        intervalFilter.classList.remove('active');
        weekFilter.classList.remove('active');
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

    async weekFilter() {
        this.destroyCharts();
        weekFilter.classList.add('active');
        allDatesFilter.classList.remove('active');
        monthFilter.classList.remove('active');
        yearFilter.classList.remove('active');
        intervalFilter.classList.remove('active');
        todayFilter.classList.remove('active');
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

    async monthFilter() {
        this.destroyCharts();
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
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async yearFilter() {
        this.destroyCharts();
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
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async allDatesFilter() {
        this.destroyCharts();
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
                this.getPie();
            }
        } catch (error) {
            console.log(error)
        }

    }

    async intervalFilter() {
        this.destroyCharts();
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

