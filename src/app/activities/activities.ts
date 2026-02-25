import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data/data-service';
import { switchMap, tap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivityDto, PageActivityDto } from '../interfaces/data';
import { ACTIVITIES_ENDPOINT } from '../services/data/enpoints';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import moment from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivityItemBottomPart } from '../activity-item-bottom-part/activity-item-bottom-part';

@Component({
  selector: 'tra-activities',
  imports: [MatPaginatorModule, MatProgressSpinnerModule, ActivityItemBottomPart],
  templateUrl: './activities.html',
  styleUrl: './activities.scss',
})
export class Activities {
  dataService = inject(DataService);
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
            startDateLocal: moment(item.startDateLocal).format('HH:mm DD-MM-YYYY'),
          };
        });
        return {
          ...raw,
          content: parsed,
        };
      },
    }
  );

  ngOnInit(): void {
    this.isRealodingActivities.set(true);
    this.dataService.getMe().subscribe();
    this.dataService
      .reloadActivities()
      .pipe(
        tap(() => {
          this.isRealodingActivities.set(false);
          this.pageEvent.set({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: 20,
            length: 249,
          });
        })
      )
      .subscribe((activities) => {});
  }

  changePage(pageEvent: PageEvent) {
    this.pageEvent.set(pageEvent);
  }
}
