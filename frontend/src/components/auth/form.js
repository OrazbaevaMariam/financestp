import {AuthUtils} from "../../utils/auth-utils.js";
// import {ValidationUtils} from "../../utils/validation-utils.js";
// import {AuthService} from "../../services/auth-service.js";
import {HttpUtils} from "../../utils/http-utils";

export class Form {
    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(AuthUtils.accessTokenKey);
        if (accessToken) {
            location.href = '#/main?period=today';
            return;
        }
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'name',
                    lastName: 'last-name',
                    id: 'name',
                    element: null,
                    regex: /^([А-Я][а-я]*\s+)+[А-Я][а-я]*\s*$/,
                    valid: false,
                },
                {
                    name: 'passwordRepeat',
                    id: 'password-repeat',
                    element: null,
                    regex: this.fields.find(item => item.name === 'password').regex,
                    valid: false,
                });
        }
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.wasChanged = false;
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            };
            item.element.oninput = function () {
                item.wasChanged = true;
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process-button');
        if ( this.processElement){
            this.processElement.onclick = function () {
                that.processForm();
            };
        }

        // if (this.page === 'signup') {
        //     this.agreeElement = document.getElementById('agree');
        //     this.agreeElement.onchange = function () {
        //         that.validateForm();
        //     }
        // }

    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            if (field.wasChanged) {
                element.parentNode.borderColor = 'red';
            }
            field.valid = false;

        } else {
            if (this.page === 'signup' && field.name === 'password') {
                this.fields.find(item => item.name === 'passwordRepeat').regex = new RegExp('^' + element.value + '$');
            }
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {
        window.addEventListener('load', function() {
            const validForm = this.fields.every(item => item.valid);
            const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
            return isValid;
        });

    }

    async processForm() {

        window.addEventListener("load", function (event) {
            document.body.style.height = '100vh';
        });
        window.addEventListener('unload', function () {
            document.body.style.height = 'auto';
        });

        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            let rememberMe = false;

            if (this.page === 'signup') {

                    const fullName = this.fields.find(item => item.name === 'name').element.value;
                    const fullNameArr = fullName.split(' ').filter(elem => elem);
                    const lastName = fullNameArr[0];
                    const name = fullNameArr[1];
                    const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat').element.value;


                try {
                    const result = await HttpUtils.request(config.host + '/signup', 'POST', true, {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat
                        // name: this.fields.find(item => item.name === 'name').element.value,
                        // lastName: this.fields.find(item => item.name === 'lastName').element.value,
                        // email: email,
                        // password: password,
                    });
                    console.log(result);

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    console.log(error.message)
                }
            } else {
                rememberMe = document.getElementById('remember-me').checked;
            }

            try {
                const result = await HttpUtils.request(config.host + '/login', 'POST', true, {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                });

                if (result) {
                    if (result.error ||
                        !result.accessToken ||
                        !result.refreshToken ||
                        !result.user.lastName ||
                        !result.user.name ||
                        !result.user.id) {
                        throw new Error(result.message);
                    }
                    AuthUtils.setTokens(result.accessToken, result.refreshToken);
                    AuthUtils.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id,
                    });
                    location.href = '#/main?period=today';
                }
            } catch (error) {
                return console.log(error.message)
            }
        }
    }
}


// export class Form {
//
//     constructor(openNewRoute) {
//         this.openNewRoute = openNewRoute;
//
//         if (AuthUtils.getAuthInfo('accessToken')) {
//             return this.openNewRoute('/');
//         }
//
//         this.nameElement = document.getElementById('name');
//         this.emailElement = document.getElementById('email');
//         this.passwordElement = document.getElementById('password');
//         this.passwordRepeatElement = document.getElementById('password-repeat');
//         this.commonErrorElement = document.getElementById('common-error-signup');
//
//         this.findElements();
//
//         document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
//     }
//
//     findElements() {
//         this.validations = [
//             {element: this.nameElement, options: {pattern: /^[А-Яа-я]{2,}\s+[А-Яа-я]{2,}\s+[А-Яа-я]{2,}\s*$/}},
//             {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
//             {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
//             {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
//         ];
//     }
//
//     async signUp() {
//         this.commonErrorElement.style.display = 'none';
//         for (let i = 0; i < this.validations.length; i++) {
//             if (this.validations[i].element === this.passwordRepeatElement) {
//                 this.validations[i].options.compareTo = this.passwordElement.value;
//             }
//         }
//
//         const errorElement = document.getElementById('common-error-signup');
//
//         if (ValidationUtils.validateForm(this.validations, errorElement)) {
//             const signupResult = await AuthService.signUp({
//                 name: this.nameElement.value.split(' ')[1],
//                 lastName: this.nameElement.value.split(' ')[0],
//                 email: this.emailElement.value,
//                 password: this.passwordElement.value,
//                 passwordRepeat: this.passwordRepeatElement.value,
//             });
//             if (signupResult) {
//                 AuthUtils.setAuthInfo(signupResult.tokens.accessToken, signupResult.tokens.refreshToken, {
//                     id: signupResult.user.id,
//                     name: signupResult.user.name + ' ' + signupResult.user.lastName,
//                 });
//                 return this.openNewRoute('/');
//             }
//             this.commonErrorElement.style.display = 'block';
//         }
//     }
//
// }