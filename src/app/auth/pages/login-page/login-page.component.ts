import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

import Swal from 'sweetalert2';
import {Router} from "@angular/router";

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm = this.fb.group({
    email: ['ghostafbr@gmail.com', [Validators.required, Validators.email]],
    password: ['Admin*25', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const {email, password} = this.loginForm.value;
    // @ts-ignore
    this.authService.login(email, password).subscribe( {
      next: () => this.router.navigate(['/dashboard']),
      error: (message) => Swal.fire('Error', message, 'error')
    });
  }

}
