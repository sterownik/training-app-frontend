import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  input,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { decodePolyline } from './polyline';

@Component({
  selector: 'tra-activity-map',
  template: `<div class="tra-activity-map" #map></div>`,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .tra-activity-map {
      width: 100%;
      height: 100%;
      min-height: 180px;
    }
  `,
})
export class ActivityMap implements OnDestroy {
  polyline = input.required<string>();

  private mapElement = viewChild.required<ElementRef<HTMLElement>>('map');
  private map?: L.Map;

  constructor() {
    afterNextRender(() => this.renderMap());
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderMap(): void {
    const points = decodePolyline(this.polyline());
    if (points.length < 2) {
      return;
    }

    // Podgląd trasy, bez przesuwania i zoomu, żeby nie przeszkadzał w przewijaniu listy
    this.map = L.map(this.mapElement().nativeElement, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const route = L.polyline(points, { color: '#FC4C02', weight: 4 }).addTo(this.map);
    this.map.fitBounds(route.getBounds(), { padding: [16, 16] });
  }
}
