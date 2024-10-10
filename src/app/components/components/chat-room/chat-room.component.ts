import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  
  @ViewChild('chatBox') chatBox!: ElementRef; // Reference to the chat box

  chatForm: FormGroup;
  messages: any[] = [];
  users: any[] = []; // To hold the list of registered users
  currentUser: string = ''; // The email of the current logged-in user
  currentUsername: string = ''; // The username of the current logged-in user
  currentChatId: string = '';
  selectedUser: string = ''; // The email of the selected user
  filteredUsers: any[] = []; // List of users excluding the current user
  isTyping: boolean = false;
  isUserListVisible = false; // Initial state for user list visibility

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

    // This method will be called after the view has been checked
    ngAfterViewChecked() {
      this.scrollToBottom(); // Scroll to the bottom whenever the view is checked
    }

      // Method to scroll to the bottom of the chat box
  private scrollToBottom(): void {
    const chatBoxElement = this.chatBox.nativeElement;
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight; // Set scrollTop to scrollHeight
  }
   toggleUserList() {
    this.isUserListVisible = !this.isUserListVisible; // Toggle visibility
  }

  // Function to select a user for chatting
  selectUser(userEmail: string) {
    this.selectedUser = userEmail; // Set the selected user
    this.currentChatId = this.getChatId(this.currentUser, this.selectedUser); // Generate chat ID based on user selection

    // Subscribe to messages for the selected chat
    this.chatService.getMessages(this.currentChatId).subscribe(data => {
      this.messages = data; // Update messages based on selected user
      console.log(this.messages);
    });
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleString('en-US', options); // Adjust locale as needed
  }

  // Utility to generate a sanitized chat ID based on user emails
  getChatId(user1: string, user2: string): string {
    const sanitizeEmail = (email: string) => email.replace(/[@.]/g, '_');
    return [sanitizeEmail(user1), sanitizeEmail(user2)].sort().join('-');
  }


    clearChat() {
      if (confirm('Are you sure you want to clear the chat?')) {
        if (this.currentChatId) {
          this.chatService.clearMessages(this.currentChatId).then(() => {
            this.messages = [];
          }).catch(error => {
            console.error('Error clearing chat:', error);
          });
        }
      }
    }
    

  // Send a message in the chat
  sendMessage() {
    if (this.chatForm.valid && this.selectedUser) {
      const { message } = this.chatForm.value;
      this.chatService.sendMessageToFriend(this.currentChatId, this.currentUser, message);
      this.chatForm.reset(); // Clear the input field after sending the message
      this.scrollToBottom()
      
      // Update the filtered users list and save the order
      this.updateFilteredUsers(this.selectedUser);
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

      // Restore the user order from localStorage
      this.restoreUserOrder();
    });
  }

  // Move the specified user to the top of the filtered users list
  moveUserToTop(email: string) {
    const index = this.filteredUsers.findIndex(user => user.email === email);
    if (index > -1) {
      const user = this.filteredUsers.splice(index, 1)[0]; // Remove user from current position
      this.filteredUsers.unshift(user); // Add user to the top
      this.saveUserOrder(); // Save the new order to localStorage
    }
  }

  // Update filtered users to reflect the latest message
  updateFilteredUsers(email: string) {
    this.moveUserToTop(email); // Move the selected user to the top
    localStorage.setItem('lastMessagedUser', email); // Store the last messaged user in localStorage
  }

  // Restore the order of users from localStorage
  restoreUserOrder() {
    const storedOrder = localStorage.getItem('userOrder');
    if (storedOrder) {
      const orderArray = JSON.parse(storedOrder);
      this.filteredUsers.sort((a, b) => orderArray.indexOf(a.email) - orderArray.indexOf(b.email));
    }
  }

  // Save the current order of users to localStorage
  saveUserOrder() {
    const orderArray = this.filteredUsers.map(user => user.email);
    localStorage.setItem('userOrder', JSON.stringify(orderArray));
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
