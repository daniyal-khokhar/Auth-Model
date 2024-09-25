import { environment } from "./enviorments";

export class HttpConfig {
  static readonly MAIN_API_URL = '/main-service/api/v1';

  static mainApiUrl() {
    return environment.mainUrl + this.MAIN_API_URL;
  }
}
