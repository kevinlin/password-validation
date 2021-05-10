import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {PasswordPolicyResult} from './model/password-policy-result';

import {PasswordService} from './password.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'password-validate';
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  private passwordSubject = new Subject<string>();
  readonly passwordResult$ = this.passwordSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap(password => this.passwordService.validate(password))
  );

  passwordResult: PasswordPolicyResult = {
    isValid: true,
    violations: []
  };

  constructor(private formBuilder: FormBuilder, private passwordService: PasswordService) {
    this.myForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.comparePasswords });
  }

  comparePasswords(group: FormGroup): any { // here we have the 'passwords' group
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  validatePassword(event: KeyboardEvent): void {
    this.passwordSubject.next((event.target as HTMLInputElement).value);
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
