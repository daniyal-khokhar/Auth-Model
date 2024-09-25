import { Injectable, Inject } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpConfig } from './http-config';
import { WrapHttpService } from './wrap-http.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  getTransactionsBySearchTerm(filter: { searchTerm: string; }) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = HttpConfig.mainApiUrl(); // Adjust the URL accordingly

  constructor(@Inject(WrapHttpService) private http: WrapHttpService) { }


    getRoles(conditions?: object): Promise<any> {
    return lastValueFrom(this.http.get(`${this.apiUrl}/role` + WrapHttpService.objToQuery(conditions)));
  }
  

}


