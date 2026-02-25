import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

export interface ParsedLap {
  name: string;
  distance: string;
  avgHeartRate: string;
  pace: string;
  avgWatts?: string;
  avgCadence?: string;
  time: string;
  maxHeartRate: string;
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialoglaps.html',
  imports: [MatDialogTitle, MatDialogContent, MatTableModule],
})
export class DialogLaps implements OnInit {
  parsedText = signal<ParsedLap[]>([]);
  isBike = signal(false);
  ngOnInit(): void {
    const parseLaps = this.parseLaps(this.data);
    if (parseLaps.find((item) => !!item.avgWatts)) {
      this.isBike.set(true);
    }
    this.parsedText.set(parseLaps);
  }
  data = inject(MAT_DIALOG_DATA);

  parseLaps(rawText: string): ParsedLap[] {
    if (!rawText) return [];

    // Rozbijamy tekst na poszczególne linie
    const lines = rawText.trim().split('\n');

    return lines.map((line) => {
      return {
        name: this.extractValue(line, /^(Lap \d+)/),
        distance: this.extractValue(line, /-dystans-\s*([\d.]+)/),
        avgHeartRate: this.extractValue(line, /-śr tętno-\s*([\d.]+)/),
        pace: this.extractValue(line, /-tempo-\s*([\d.:/]+)/),
        avgWatts: this.extractValue(line, /-śr waty-\s*([\d.]+)/),
        avgCadence: this.extractValue(line, /-śr kadencja-\s*([\d.]+)/),
        time: this.extractValue(line, /-czas-\s*([\d.]+)/),
        maxHeartRate: this.extractValue(line, /-max tętno-\s*([\d.]+)/),
      };
    });
  }

  private extractValue(text: string, regex: RegExp): string {
    const match = text.match(regex);
    // Jeśli nie znajdzie wartości lub będzie tam myślnik "-", zwróci pusty string lub "0"
    return match && match[1] && match[1] !== '-' ? match[1].trim() : '';
  }
}
