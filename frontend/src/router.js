import {ShowExpense} from "./components/expense/show-expense";
import {ExpenseCreate} from "./components/expense/expense-create";
import {ExpenseUpdate} from "./components/expense/expense-update";
import {IncomeShow} from "./components/income/income-show";
import {IncomeCreate} from "./components/income/income-create";
import {IncomeUpdate} from "./components/income/income-update";
import {OperationsList} from "./components/operations/operations-show";
import {OperationsExpenseCreate} from "./components/operations/operations-expense-create";
import {OperationsUpdate} from "./components/operations/operations-update";
import {Dashboard} from "./components/dashboard";
import {Form} from "./components/auth/form";
import {Logout} from "./components/auth/logout";
import {AuthUtils} from "./utils/auth-utils";
import {ExpenseDelete} from "./components/expense/expense-delete";
import {IncomeDelete} from "./components/income/income-delete";
import {OperationsIncomeCreate} from "./components/operations/operations-income-create";
import {OperationsDelete} from "./components/operations/operations-delete";
import {UserInfo} from "./utils/user-info";
import {CheckAccessToken} from "./utils/check-access-token";

export class Router {
    constructor() {

        this.titleElement = document.getElementById('title');
        this.contentElement = document.getElementById('content');
        this.profileFullNameElement = document.getElementById('profile-name');
        this.menuHref = document.querySelectorAll('a.nav-link');
        window.addEventListener('hashchange', () => {
            this.handleActiveLink();
        });


        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new Dashboard();
                    new UserInfo();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                template: '/templates/pages/404.html',

            },
            {
                route: '/login',
                title: 'Авторизация',
                template: '/templates/pages/auth/login.html',
                load: () => {
                    new Form('login');
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: '/templates/pages/auth/sign-up.html',
                load: () => {
                    new Form('signup');
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout();

                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/pages/expense/show-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new ShowExpense();
                    new UserInfo();
                    this.handleActiveLink();
                },
            },
            {
                route: '/expense/create',
                title: 'Создание расходов',
                template: '/templates/pages/expense/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new ExpenseCreate();
                    new UserInfo();
                },

            },
            {
                route: '/expense/update',
                title: 'Редактирование расходов',
                template: '/templates/pages/expense/update-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new CheckAccessToken();
                    new ExpenseUpdate();
                    new UserInfo();
                    this.handleActiveLink();
                },

            },
            {
                route: '/expense/delete',
                load: () => {
                    new ExpenseDelete();
                },

            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/pages/income/show-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new IncomeShow();
                    new UserInfo();
                },

            },
            {
                route: '/income/create',
                title: 'Создать доход',
                template: '/templates/pages/income/create-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new IncomeCreate();
                    new UserInfo();
                    this.handleActiveLink();
                },
                scripts: []
            },
            {
                route: '/income/update',
                title: 'Редактировать доход',
                template: '/templates/pages/income/update-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new IncomeUpdate();
                    new UserInfo();
                    this.handleActiveLink();
                },
                scripts: []
            },

            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete();
                },

            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/show-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new OperationsList();
                    new UserInfo();
                    this.handleActiveLink();
                },
            },
            {
                route: '/operations/create/income',
                title: 'Создание дохода',
                template: '/templates/pages/operations/create-operations-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new OperationsIncomeCreate();
                    new UserInfo();
                    this.handleActiveLink();
                },

            },
            {
                route: '/operations/create/expense',
                title: 'Создание расхода',
                template: '/templates/pages/operations/create-operations-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new OperationsExpenseCreate();
                    new UserInfo();
                    this.handleActiveLink();
                },

            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                template: '/templates/pages/operations/update-operation.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CheckAccessToken();
                    new OperationsUpdate();
                    new UserInfo();
                    this.handleActiveLink();
                },

            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete();
                },

            },
        ];
    }
    async openRoute() {
        const urlRoute = window.location.pathname;
        if (urlRoute === '/logout') {
            await AuthUtils.logout();
            window.location.href = '/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '/';
            return
        }

        if (urlRoute !== '/login' && urlRoute !== '/sign-up' && urlRoute !== '/404'){
            this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
            const contentLayoutElement = document.getElementById('content-layout');
            contentLayoutElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        } else {
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());

        }

        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }



    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    handleActiveLink() {
        const currentPath = window.location.pathname;
        this.menuHref.forEach(link => {
            link.getAttribute('href') === currentPath ?
                link.classList.add('active') :
                link.classList.remove('active');
        });
    }
}