import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User as FirebaseUser } from 'firebase/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<FirebaseUser | null>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user$ = this.afAuth.authState as Observable<FirebaseUser | null>;
  }

  // Login Method
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user) // Returns true if user is not null
    );
  }

  // Logout Method
  logout() {
    return this.afAuth.signOut(); // Ensure this is the correct method call
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  register(email: string, password: string, username: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const userId = userCredential.user?.uid; // Get the UID of the newly registered user
        if (userId) {
          // Save the user's email in the /users path
          return this.db.list('/users').set(userId, { email, username });
        } else {
          return Promise.reject('User ID is undefined');
        }
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


}
