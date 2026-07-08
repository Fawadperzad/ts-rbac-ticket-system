import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import type { User } from '../../models/ticket.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private adminService: AdminService, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => { this.users = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Failed to load users.'; this.isLoading = false; }
    });
  }

  onRoleChange(user: User, role: string): void {
    this.adminService.updateRole(user.id, role).subscribe({
      next: () => { user.role = role as User['role']; },
      error: () => alert('Failed to update role.')
    });
  }

  onDeleteUser(userId: number): void {
    if (userId === this.auth.getUser()?.id) {
      alert('You cannot delete your own account.');
      return;
    }
    if (!confirm('Delete this user permanently?')) return;
    this.adminService.deleteUser(userId).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== userId); },
      error: () => alert('Failed to delete user.')
    });
  }
}
