import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

import Swal from 'sweetalert2';
import {Router} from "@angular/router";

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  register() {
    const {name, email, password} = this.registerForm.value;
    // @ts-ignore
    this.authService.register(name, email, password).subscribe( {
      next: () => this.router.navigate(['/dashboard']),
      error: (message) => Swal.fire('Error', message, 'error')
    });
  }

}
