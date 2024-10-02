import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase) {}

  // Send a message to the database
  sendMessageToFriend(roomId: string, user: string, message: string) {
    const timestamp = Date.now();
    this.db.list(`/chats/${roomId}`).push({ user, message, timestamp });
  }

  // Get messages from the database
  getMessages(roomId: string): Observable<any[]> {
    return this.db.list(`/chats/${roomId}`, ref => ref.orderByChild('timestamp')).valueChanges();
  }

  // Get all registered users (modify this based on your user storage structure)
 // Fetch all users from the database
// chat-service.ts
getAllUsers(): Observable<any[]> {
  return this.db.list('/users').valueChanges(); // Ensure this path matches your Firebase structure
}

}
