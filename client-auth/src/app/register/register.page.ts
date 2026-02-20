import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async register() {
    if (!this.username || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Username dan password wajib diisi!',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.auth.register({
      username: this.username,
      password: this.password
    }).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Berhasil daftar! Silakan login.',
          duration: 2000,
          color: 'success'
        });
        toast.present();

        this.router.navigate(['/login']);
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: err.error?.error || 'Gagal daftar',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
