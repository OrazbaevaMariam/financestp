import {AuthUtils} from "./auth-utils";
import {AuthService} from "../services/auth-service";
import {HttpUtils} from "./http-utils";
import config from "../config/config";

export class UserInfo {
    constructor() {
        this.fullName = document.getElementById('profile-name');
        this.balance = document.getElementById('balance__amount');
        this.userInfo = AuthUtils.getUserInfo();
        this.accessToken = localStorage.getItem(AuthUtils.accessTokenKey);
        this.getUserInfo();
        this.getBalance();
    }

    getUserInfo() {
        this.userInfo && this.accessToken ? this.fullName.innerText = this.userInfo.fullName : this.fullName.innerText = 'Нет данных';
    }

    async getBalance() {
        try {

            const result = await HttpUtils.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                this.balance.innerText = result.balance;
            }

        } catch (error) {
            console.log(error)
        }
    }
}