import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselItem } from '../interfaces/app-data';
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
    nav: false,
    autoHeight: false,
    navText: ['', ''],
    autoWidth: true,
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
  ];
}
