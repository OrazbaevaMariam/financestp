import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils";

export class Form {
    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(AuthUtils.accessTokenKey);
        if (accessToken) {
            location.href = '/?period=today';
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
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            };
        }
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
        const validForm = this.fields.every(item => item.valid);
        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
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
                    const result = await HttpUtils.request('/signup', 'POST', true, {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat
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

                const result = await HttpUtils.request('/login', 'POST', true, {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                });

                if (result) {
                    if (result.error ||
                        !result.response.tokens.accessToken ||
                        !result.response.tokens.refreshToken ||
                        !result.response.user.lastName ||
                        !result.response.user.name ||
                        !result.response.user.id) {
                        throw new Error(result.message);
                    }
                    AuthUtils.setTokens(result.response.tokens.accessToken, result.response.tokens.refreshToken);
                    AuthUtils.setUserInfo({
                        // fullName: result.user.fullName,
                        name: result.response.user.name,
                        lastName: result.response.user.lastName,
                        userId: result.response.user.id,
                        email: email
                    });
                    location.href = '/';
                }
            } catch (error) {
                return console.log(error.message)
            }
        }
    }
}
