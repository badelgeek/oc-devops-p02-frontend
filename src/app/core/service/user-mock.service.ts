import { CreateUserRequest } from '../models/CreateUserRequest';
import {Observable, of} from 'rxjs';


export class UserMockService {

  register(user: CreateUserRequest): Observable<void> {
    return of();
  }
}
