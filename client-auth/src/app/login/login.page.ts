import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    if (!this.username || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Username dan password wajib diisi!',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.auth.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: async (res) => {
        // simpan token
        await this.auth.setToken(res.token);

        const toast = await this.toastCtrl.create({
          message: 'Login berhasil!',
          duration: 1500,
          color: 'success'
        });
        toast.present();

        // masuk halaman rahasia
        this.router.navigate(['/home']);
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: err.error?.error || 'Login gagal',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
