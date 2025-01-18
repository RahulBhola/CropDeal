import { Component } from '@angular/core';
import { AuthService } from '../../../services/authService/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/adminService/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: any[] = [];
  firstName: string = '';
  lastName: string = '';
  
  roles: string[] = ['Dealer', 'Farmer'];
  status: string[] = ['Active', 'Inactive'];

  selectedRole: string = '';
  selectedStatus: string = '';

  filteredUsers: any[] = [];

  constructor(
    private userService: AuthService,
    private adminService: AdminService
  ){
    this.userService.getAllUser().subscribe({
      next: (data)=>{
        this.users = data.map((user: any) => ({
          ...user,
          firstName: user.userName.split('_')[0], 
          lastName: user.userName.split('_')[1] || '' 
        }));
        this.filteredUsers = [...this.users];
      },
      error: (err)=>{
        console.error('Error fetching all users:', err);
      }
    })
  }
  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const roleMatch = this.selectedRole ? user.userType === this.selectedRole : true;
      const statusMatch = this.selectedStatus ? (user.isActive ? 'Active' : 'Inactive') === this.selectedStatus : true;
      return roleMatch && statusMatch;
    });
  }

  toggleStatus(user: any) {
    // user.isActive = !user.isActive;
    const action = user.isActive ? 'Deactivate' : 'Activate';
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action.toLowerCase()} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.toggleUserStatus(user.id, !user.isActive).subscribe({
          next: () => {
            user.isActive = !user.isActive;
            Swal.fire('Success!', `User has been ${action.toLowerCase()}d.`, 'success');
          },
          error: (err) => {
            console.error('Error toggling user status:', err);
            Swal.fire('Error!', 'Something went wrong. Please try again later.', 'error');
          },
        });
      }
    });
  }
}
