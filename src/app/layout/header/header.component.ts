import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;

    constructor(
      private storageService: StorageService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.storageService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
      });
    }

    logout(): void {
      this.storageService.signOut();
      this.router.navigate(['/inicio']);
    }
}
