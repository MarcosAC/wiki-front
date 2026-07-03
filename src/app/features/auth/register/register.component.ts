import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    isLoading = signal(false);
    hidePassword = signal(true);

    registerForm: FormGroup = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        return password && confirmPassword && password.value !== confirmPassword.value
            ? { passwordMismatch: true }
            : null;
    }

    onSubmit(): void {
        if (this.registerForm.invalid) return;

        this.isLoading.set(true);

        const { confirmPassword, ...userData } = this.registerForm.value;

        this.authService.register(userData).subscribe({
            next: () => {
                this.snackBar.open('Conta criada com sucesso! Você já pode fazer login.', 'Sucesso', {
                    duration: 5000,
                    panelClass: ['success-snack']
                });
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading.set(false);
                const errorMessage = err.error?.message || 'Erro ao criar conta. Tente novamente.';
                this.snackBar.open(errorMessage, 'Erro', {
                    duration: 5000,
                    panelClass: ['error-snack']
                });
            }
        });
    }
}