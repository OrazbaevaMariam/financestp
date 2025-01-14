import {CategoriesIncomeType} from "./categories-income.type";

export type ConfigIncomeType = {
    type: string,
    data: DataIncome,
    options: {
        responsive: boolean,
        plugins: {
            legend: {
                // display: false,
                position: string
            },
            title: {
                display: boolean,
                text: string,
            }
        }
    }
}

export type DataIncome = {
    labels: string,
    datasets: [{
        label: string,
        data: number,
        borderWidth: number,
    }]
}