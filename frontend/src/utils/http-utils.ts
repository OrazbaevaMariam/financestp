import config from "../config/config";
import {HTTPMethodsEnum} from "../enums/http-methods.enum";
import {HttpResultType} from "../types/http-result.type";
import {AuthUtils} from "./auth-utils";
import {AuthInfoKeysParams} from "../types/auth-info-keys.type";

export class HttpUtils {
    public static async request(url: string, method: string = HTTPMethodsEnum.GET, useAuth = true, body: any = null): Promise<HttpResultType> {
        const result: HttpResultType = {
            error: false,
            response: null
        };


        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        // let token = localStorage.getItem(AuthUtils.accessTokenKey);
        let token: string | AuthInfoKeysParams | null | undefined = null;

        // if (token) {
        //     params.headers['x-auth-token'] = token;
        // }
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response: Response | null = null;

        try {
            response = await fetch(config.api + url, params);
            if (response) {
                result.response = await response.json();

            }
            // пока закомментирую. Как поняла с этим кодом весь result попадает в response, а потом используется в основном коде. Но я начала уже убирать везде респонс
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            // result.error = true;
            if (useAuth && response.status === 401) {
                //1-токена нет
                if (!token) {
                    location.href = '/login';
                    // result.redirect = '/login';
                } else {
                    //2-токен устарел/невалидный (надо обновить)
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    console.log(updateTokenResult);
                    if (updateTokenResult) {
                        //запрос повторно
                        return this.request(url, method, useAuth, body);
                    }
                    // else {
                    //     location.href = '/login';
                    //     // result.redirect = '/login';
                    // }
                }
            }
            // throw new Error(response.statusText);
        }
        return result;
        // return await response.json();
    }
}