import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat'; // AngularFire 15 uses 'compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// Import your environment file
import { environment } from './environment';
import { LoginComponent } from './components/components/login/login.component';
import { RegisterComponent } from './components/components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatRoomComponent } from './components/components/chat-room/chat-room.component';
import { LoaderComponent } from './components/components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatRoomComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Initialize Firebase using AngularFireModule
    AngularFireModule.initializeApp(environment.firebase), // Use initializeApp with compat
    AngularFireAuthModule ,
        ReactiveFormsModule // Auth module for Firebase Authentication
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
