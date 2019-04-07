import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  email_regexPattern: string = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";
  password_regexPattern: string = '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[?\{\}\|\(\)\`~!@#\$%\^&\*\[\]"\';:_\-<>\., =\+\/\\]).{8,}$';
  number_regexPattern: string = '^[0-9]*$';
  constructor() { }
}
