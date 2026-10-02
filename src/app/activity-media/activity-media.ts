import { Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivityMap } from '../activity-map/activity-map';

type Slide = { kind: 'map'; polyline: string } | { kind: 'photo'; url: string };

// Karuzela aktywności: najpierw mapa trasy, potem zdjęcia
@Component({
  selector: 'tra-activity-media',
  imports: [ActivityMap, MatIconModule],
  templateUrl: './activity-media.html',
  styleUrl: './activity-media.scss',
})
export class ActivityMedia {
  polyline = input<string | null>(null);
  photos = input<string[]>([]);

  activeIndex = signal(0);

  slides = computed<Slide[]>(() => {
    const slides: Slide[] = [];
    const polyline = this.polyline();
    if (polyline) {
      slides.push({ kind: 'map', polyline });
    }
    this.photos().forEach((url) => slides.push({ kind: 'photo', url }));
    return slides;
  });

  private track = viewChild.required<ElementRef<HTMLElement>>('track');

  onScroll(): void {
    const track = this.track().nativeElement;
    this.activeIndex.set(Math.round(track.scrollLeft / track.clientWidth));
  }

  goTo(index: number): void {
    const track = this.track().nativeElement;
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }
}
