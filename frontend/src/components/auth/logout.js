
import {AuthUtils} from "../../utils/auth-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class Logout {

     constructor() {

          if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
              location.href = "/login";
          }
          this.logout().then();
     }

     async logout() {
          await AuthService.logOut({
               refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
          });

          AuthUtils.removeAuthInfo();

          location.href = "/login";
     }
}