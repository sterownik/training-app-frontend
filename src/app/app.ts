import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';
import { TopBar } from './top-bar/top-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, RouterLink, TopBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('training-app');
}
