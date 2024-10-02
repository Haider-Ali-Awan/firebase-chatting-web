import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { AuthService } from 'src/app/services/authService/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  chatForm: FormGroup;
  messages: any[] = [];
  users: any[] = []; // To hold the list of registered users
  currentUser: string = ''; // The email of the current logged-in user
  currentUsername: string = ''; // The username of the current logged-in user
  currentChatId: string = '';
  selectedUser: string = ''; // The email of the selected user
  filteredUsers: any[] = []; // List of users excluding the current user

  // Map to hold email-username pairs
  userMap: { [email: string]: string } = {};

  constructor(
    private fb: FormBuilder, 
    private chatService: ChatService,
    private authService: AuthService, 
    private router: Router
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Get the current logged-in user's data
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user.email || ''; // Set the current user's email
        this.currentUsername = user.displayName || 'You'; // Set the current user's username
        
        // Fetch registered users after getting the current user
        this.fetchRegisteredUsers();
      }
    });
  }

  // Function to select a user for chatting
  selectUser(userEmail: string) {
    this.selectedUser = userEmail; // Set the selected user
    this.currentChatId = this.getChatId(this.currentUser, this.selectedUser); // Generate chat ID based on user selection

    // Subscribe to messages for the selected chat
    this.chatService.getMessages(this.currentChatId).subscribe(data => {
      this.messages = data; // Update messages based on selected user
    });
  }

  // Utility to generate a sanitized chat ID based on user emails
  getChatId(user1: string, user2: string): string {
    const sanitizeEmail = (email: string) => email.replace(/[@.]/g, '_');
    return [sanitizeEmail(user1), sanitizeEmail(user2)].sort().join('-');
  }

  // Send a message in the chat
  sendMessage() {
    if (this.chatForm.valid && this.selectedUser) {
      const { message } = this.chatForm.value;
      this.chatService.sendMessageToFriend(this.currentChatId, this.currentUser, message);
      this.chatForm.reset(); // Clear the input field after sending the message
    }
  }

  // Fetch registered users and map emails to usernames
  fetchRegisteredUsers() {
    this.chatService.getAllUsers().subscribe(users => {
      // Filter out the current user and map emails to usernames
      this.filteredUsers = users.filter(u => u.email !== this.currentUser);
      this.filteredUsers.forEach(u => {
        this.userMap[u.email] = u.username; // Map email to username
      });
    });
  }

  // Get the username by email, or return 'Unknown User' if not found
  getUserNameByEmail(email: string): string {
    return this.userMap[email] || 'Unknown User';
  }

  // Handle user logout
  onLogout() {
    this.authService.logout().then(() => {
      this.router.navigate(['./login']);
    }).catch(err => {
      console.error('Error during logout:', err);
    });
  }
}
