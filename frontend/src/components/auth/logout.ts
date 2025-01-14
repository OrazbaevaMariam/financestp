import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {RefreshToken} from "../../types/refresh-token.type";
import {AuthInfoKeysParams} from "../../types/auth-info-keys.type";

export class Logout {

    constructor() {

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            location.href = "/login";
        }
        this.logout().then();
    }

    private async logout(): Promise<void> {
        const refresh: string | null | undefined | AuthInfoKeysParams = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);
        await AuthService.logOut({
            refreshToken: refresh as string,
        });

        AuthUtils.removeAuthInfo();

        location.href = "/login";
    }
}