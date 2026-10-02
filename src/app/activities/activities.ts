import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data/data-service';
import { catchError, of, tap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivityDto, PageActivityDto } from '../interfaces/data';
import { ACTIVITIES_ENDPOINT } from '../services/data/enpoints';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import moment from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivityItemBottomPart } from '../activity-item-bottom-part/activity-item-bottom-part';
import { UserData } from '../services/user-data';
import { ActivityMedia } from '../activity-media/activity-media';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tra-activities',
  imports: [
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ActivityItemBottomPart,
    ActivityMedia,
    MatIconModule,
  ],
  templateUrl: './activities.html',
  styleUrl: './activities.scss',
})
export class Activities {
  dataService = inject(DataService);
  userData = inject(UserData);
  activities!: PageActivityDto;
  isRealodingActivities = signal(false);

  pageEvent = signal<PageEvent | null>(null);
  activitiesResource: HttpResourceRef<PageActivityDto | any> = httpResource(
    () => {
      const testId = this.pageEvent();
      return testId
        ? `${ACTIVITIES_ENDPOINT}?size=${this.pageEvent()?.pageSize}&page=${
            this.pageEvent()?.pageIndex
          }`
        : undefined;
    },
    {
      parse: (raw: PageActivityDto | any) => {
        const parsed = raw.content.map((item: ActivityDto) => {
          return {
            ...item,
            startDateLocal: moment(item.startDateLocal).format('DD.MM.YYYY, HH:mm'),
            photos: item.photoUrl ? [item.photoUrl] : [],
          };
        });
        return {
          ...raw,
          content: parsed,
        };
      },
    },
  );

  ngOnInit(): void {
    // Lista pokazuje się od razu, synchronizacja ze Stravą idzie w tle
    this.pageEvent.set({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: 20,
      length: 0,
    });

    this.dataService.getMe().subscribe((data) => this.userData.userInfo.set(data));

    this.isRealodingActivities.set(true);
    this.dataService
      .reloadActivities()
      .pipe(
        catchError(() => of(null)),
        tap(() => {
          this.isRealodingActivities.set(false);
          this.activitiesResource.reload();
        }),
      )
      .subscribe();
  }

  round(value: number): number {
    return Math.round(value);
  }

  hasDistance(type: string): boolean {
    return type === 'Run' || type === 'Ride';
  }

  typeLabel(type: string): string {
    switch (type) {
      case 'Run':
        return 'Bieg';
      case 'Ride':
        return 'Rower';
      case 'WeightTraining':
        return 'Siłownia';
      default:
        return type;
    }
  }

  typeModifier(type: string): string {
    switch (type) {
      case 'Run':
        return 'tra-activities__type--run';
      case 'Ride':
        return 'tra-activities__type--ride';
      default:
        return 'tra-activities__type--other';
    }
  }

  iconFor(type: string): string {
    switch (type) {
      case 'Run':
        return 'assets/shoes.png';
      case 'Ride':
        return 'assets/road.png';
      default:
        return 'assets/exercises.png';
    }
  }

  changePage(pageEvent: PageEvent) {
    this.pageEvent.set(pageEvent);
  }
}
