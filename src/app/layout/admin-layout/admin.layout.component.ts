import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterModule,       
    SidebarComponent,   
    CommonModule
  ],
  templateUrl: './admin.layout.component.html',
  styleUrl: './admin.layout.component.css'
})
export class AdminLayoutComponent {

  isSidebarCollapsed = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
