import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselItem } from '../interfaces/app-data';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tra-welcome-page',
  imports: [CarouselModule, RouterLink, MatIconModule],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
})
export class WelcomePage {
  @ViewChild('features')
  features!: ElementRef<HTMLElement>;

  scrollToSection(): void {
    this.features.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoplayTimeout: 6000,
    autoplayHoverPause: false,
    nav: false,
    autoHeight: false,
    navText: ['', ''],
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
  };

  carouselItems: CarouselItem[] = [
    {
      src: 'assets/welcome-images/1.jpg',
    },
    {
      src: 'assets/welcome-images/2.jpg',
    },
    {
      src: 'assets/welcome-images/3.jpg',
    },
  ];

  featureItems: FeatureItem[] = [
    {
      icon: 'sync',
      title: 'Import ze Stravy',
      description: 'Po zalogowaniu aplikacja pobierze Twoje aktywności razem z okrążeniami.',
    },
    {
      icon: 'edit_note',
      title: 'Własne parametry',
      description: 'Uzupełnij treningi o notatki i moc znormalizowaną, których brakuje w danych.',
    },
    {
      icon: 'insights',
      title: 'Rozmowa z AI',
      description: 'Porozmawiaj z czatem o swoich treningach i doszlifuj plan treningowy.',
    },
  ];
}
