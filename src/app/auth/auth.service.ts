import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SetupDto } from '../models/setup.dto';
import { LoginUserDto } from '../models/login-user.dto';
import { CreateUserDto } from '../models/create-user.dto';
import { SetupResponseDto } from '../models/setup-response.dto';
import { LoginResponseDto } from '../models/login-response.dto';
import { CreateUserResponseDto } from '../models/create-user-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api';
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'current_user';

  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  setup(setupDto: SetupDto): Observable<SetupResponseDto> {
    return this.http.post<SetupResponseDto>(`${this.apiUrl}/setup`, setupDto);
  }

  login(loginUserDto: LoginUserDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, loginUserDto).pipe(
      tap((response) => {
        if (response.success && response.token) {
          this.storeToken(response.token);
          this.storeUser(response);
          this.isAuthenticated.set(true);
        }
      }),
    );
  }

  createUser(createUserDto: CreateUserDto): Observable<CreateUserResponseDto> {
    return this.http.post<CreateUserResponseDto>(`${this.apiUrl}/users`, createUserDto);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): LoginResponseDto | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setRole(role: string): void {
    const user = this.getUser();
    if (user) {
      user.role = role;
      this.storeUser(user);
    }
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeUser(user: LoginResponseDto): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}
