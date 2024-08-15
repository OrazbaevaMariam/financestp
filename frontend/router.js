import {ShowExpense} from "./src/components/expense/show-expense";
import {ExpenseCreate} from "./src/components/expense/expense-create";
import {ExpenseUpdate} from "./src/components/expense/expense-update";
import {IncomeShow} from "./src/components/income/income-show";
import {IncomeCreate} from "./src/components/income/income-create";
import {IncomeUpdate} from "./src/components/income/income-update";
import {OperationsList} from "./src/components/operations/operations-show";
import {OperationsExpenseCreate} from "./src/components/operations/operations-expense-create";
import {OperationsUpdate} from "./src/components/operations/operations-update";
import {Dashboard} from "./src/components/dashboard";
import {Form} from "./src/components/auth/form";
import {Logout} from "./src/components/auth/logout";
import {FileUtils} from "./src/utils/file-utils";
import {AuthUtils} from "./src/utils/auth-utils";
import {ExpenseDelete} from "./src/components/expense/expense-delete";
import {IncomeDelete} from "./src/components/income/income-delete";
import {Sidebar} from "./src/components/sidebar";
import {OperationsIncomeCreate} from "./src/components/operations/operations-income-create";
import {OperationsDelete} from "./src/components/operations/operations-delete";

export class Router {
    constructor() {

        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.userName = null;
        this.profileNameElement = document.getElementById('profile-name');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,

            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.style.height = '100vh';
                    new Form(this.openNewRoute.bind(this));
                    new Form('login');
                },
                unload: () => {
                    document.body.style.height = 'auto';
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.style.height = '100vh';
                    new Form(this.openNewRoute.bind(this));
                    new Form('signup');
                },
                unload: () => {
                    document.body.style.height = 'auto';
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));

                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/show-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ShowExpense(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expense/create',
                title: 'Создание расходов',
                filePathTemplate: '/templates/pages/expense/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                },

            },
            {
                route: '/expense/update',
                title: 'Редактирование расходов',
                filePathTemplate: '/templates/pages/expense/update-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseUpdate(this.openNewRoute.bind(this));
                },
                scripts: []
            },
            {
                route: '/expense/delete',
                load: () => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                },

            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/show-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeShow(this.openNewRoute.bind(this));
                },
                scripts: []
            },
            {
                route: '/income/create',
                title: 'Создать доход',
                filePathTemplate: '/templates/pages/income/create-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
                scripts: []
            },
            {
                route: '/income/update',
                title: 'Заказы',
                filePathTemplate: '/templates/pages/income/update-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeUpdate(this.openNewRoute.bind(this));
                },
                scripts: []
            },

            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                },

            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/show-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsList(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations/create/income',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/operations/create-operations-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsIncomeCreate(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/operations/create/expense',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/operations/create-operations-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsExpenseCreate(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            // {
            //     route: '/operations/edit/income',
            //     title: 'Редактирование дохода/расхода',
            //     filePathTemplate: '/templates/pages/operations/update-operations-income.html',
            //     useLayout: '/templates/layout.html',
            //     load: () => {
            //         new OperationsUpdate(this.openNewRoute.bind(this));
            //     },
            //     scripts: [],
            //     styles: []
            // },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/operations/update-operation.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsUpdate(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                },

            },
            // {
            //     route: '/orders/delete',
            //     load: () => {
            //         new OrdersDelete(this.openNewRoute.bind(this));
            //     }
            // },
        ];
    }

    async initEvents() {
        // const content = document.getElementById('content');
        // content.innerHTML = await fetch(newRoute.template).then(response => response.text());

        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
        window.addEventListener('popstate', this.activateRoute.bind(this))
        // document.addEventListener('click', this.clickHandler.bind(this));
    }


    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async openRoute() {

        // const urlRoute = window.location.hash.split('?')[0];

        // const urlRoute = window.location.hash.substring(2);
        const urlRoute = window.location.hash.slice(1);
        console.log(urlRoute)

        if (urlRoute === '/logout') {
            // console.log(urlRoute)
            await AuthUtils.logout();
            window.location.href = '/';
            return;
        }
        const newRoute = this.routes.find(item => {
            // console.log(item.route)

            // console.log(item.route === urlRoute)


        });
        console.log(newRoute);

        // if (!newRoute) {
        //     window.location.href = '/';
        //     return;
        // }

        newRoute.load();

    }


    // async clickHandler(e) {
    //     let element = null;
    //     if (e.target.nodeName === 'A') {
    //         element = e.target;
    //     } else if (e.target.parentNode.nodeName === 'A') {
    //         element = e.target.parentNode;
    //     }
    //
    //     if (element) {
    //         e.preventDefault();
    //
    //         const currentRoute = window.location.pathname;
    //         const url = element.href.replace(window.location.origin, '');
    //         if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
    //             return;
    //         }
    //         await this.openNewRoute(url);
    //     }
    // }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.useLayout && !AuthUtils.getAuthInfo().userInfo) {
                window.location = '/login'
            }
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style);
                });
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Accounting Finances';
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');

                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo.name && userInfo.lastName) {
                                this.userName = userInfo.name + userInfo.lastName;
                            }
                        }
                    }
                    this.profileNameElement = this.userName;
                    // this.profileNameElement.innerText = localStorage.getItem(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
                    // console.log(AuthUtils.userInfoTokenKey)

                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
            if(newRoute.useLayout){
                new Sidebar();
            }

        } else {
            console.log('No route found');

            history.pushState({}, '', '/404');
            await this.activateRoute(null);
        }
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

}