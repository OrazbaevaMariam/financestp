import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {RefreshResponseType} from "../types/refresh-response.type";
import { AuthInfoKeysParams } from "../types/auth-info-keys.type";
import {LogoutResponseType} from "../types/logout-response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    // public static async processUnauthorisedResponse(){
    //     const refreshToken = localStorage.getItem(this.refreshTokenKey);
    //     if (refreshToken) {
    //         const response = await fetch(config.host + '/refresh', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 'Accept': 'application/json',
    //             },
    //             body: JSON.stringify({refreshToken: refreshToken})
    //         });
    //
    //         if (response && response.status === 200) {
    //             const result = await response.json();
    //             if (result && !result.error) {
    //                 this.setTokens(result.accessToken, result.refreshToken);
    //                 return true;
    //             }
    //         }
    //     }
    //     this.removeTokens();
    //     location.href = '/';
    //     return false;
    // };


    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: string | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }


    public static getAuthInfo(key: string): string | null | undefined | AuthInfoKeysParams{
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            if (localStorage.hasOwnProperty(key)){
                return localStorage.getItem(key);
            }
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

    public static setUserInfo(info: UserInfoType): void {
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(info));
    }

    public static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoTokenKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }

        return null;
    }

    public static async logout(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: LogoutResponseType | null = await response.json();
                if (result && !result.error) {
                    this.removeTokens();
                    localStorage.removeItem(this.userInfoTokenKey);
                    return true;
                }
            }
        }
        return false;

    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        //что писать для refreshToken? какой тип данных возращает?
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const tokens: RefreshResponseType | null = await response.json();
                if (tokens && tokens.accessToken && tokens.refreshToken) {
                    this.setTokens(tokens.accessToken, tokens.refreshToken);
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                    // this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                    result = true;
                    console.log(result)
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
            this.removeTokens();
            location.href = '/';
            return false;
        }
        return result;
    }
}