import { RegisterRequest } from '../models/RegisterRequest';
import {Observable, of} from 'rxjs';


export class UserMockService {

  register(user: RegisterRequest): Observable<Object> {
    return of();
  }
}
