import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../services/admin.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="login-redirect-container">
      <mat-spinner></mat-spinner>
      <p>Verifying admin privileges...</p>
    </div>
  `,
  styles: [`
    .login-redirect-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    p { margin-top: 20px; font-family: sans-serif; }
  `]
})
export class AdminLoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.adminService.isAdmin(user.userId).subscribe({
      next: (res) => {
        if (res.isAdmin) {
          this.authService.setRole('admin');
          this.router.navigate(['/admin']);
        } else {
          alert('Access Denied: You do not have admin privileges.');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
