import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    public loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    public errorMessage = signal<string>('');

    public onSubmit(): void {
        if (this.loginForm.invalid) return;

        this.errorMessage.set('');
        const { username, password } = this.loginForm.value;
        
        this.authService.login(username!, password!).subscribe({
            next: (response) => {
                this.router.navigate(['/articles']);
            },

            error: (err) => {
                console.error('Erro ao tentar realizar login:.', err);

                if (err.status === 401 || err.status === 400) { 
                    this.errorMessage.set('Usuário ou senha inválidos.');
                }
                else {
                    this.errorMessage.set('Falha na comunicação com o servidor de autenticação.');
                }
            }
        });
    }
}
            