import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import './index.css';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
