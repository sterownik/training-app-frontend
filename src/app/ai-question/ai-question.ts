import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { form, FormField, required, email } from '@angular/forms/signals';
import { DataService } from '../services/data/data-service';
import { marked } from 'marked';
import { MatSelect, MatOption } from '@angular/material/select';
import moment from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivityMin, GetLastChat } from '../interfaces/data';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MIN_ACTIVITIES_ENDPOINT } from '../services/data/enpoints';
import { JsonPipe } from '@angular/common';
import { delay, switchMap, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AthleteInfoDialog } from './athlete-info-dialog/athlete-info-dialog';

interface AiRequestFormModelSignal {
  filterType:
    | 'last3months'
    | 'last6months'
    | 'lastYear'
    | 'customDate'
    | 'selected'
    | 'last18months';
  startDateLocalEnd: string;
  startDateLocalStart: string;
  prompt: string;
}

@Component({
  selector: 'tra-ai-question',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormField,
    MatSelect,
    MatOption,
    MatButtonModule,
    MatButton,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatListModule,
    JsonPipe,
    MatIcon,
  ],
  templateUrl: './ai-question.html',
  styleUrl: './ai-question.scss',
})
export class AiQuestion implements OnInit {
  @ViewChild('textarea') ps: ElementRef | undefined;
  requestUserLoading!: string;
  readonly dialog = inject(MatDialog);
  athleteInfo = signal('');

  ngOnInit(): void {
    this.getLastChat()
      .pipe(
        delay(0),
        tap(() => {
          this.ps?.nativeElement.scrollIntoView({ behavior: 'smooth' });
          console.log(this.ps);
        }),
      )
      .subscribe();
    this.getAthleteInfo();
  }
  dataService = inject(DataService);
  isSaving = signal(false);
  lastChatItems = signal<GetLastChat[]>([]);
  selectedActivities!: number[];
  actualChatId = signal<null | string>(null);
  thinkingProgress = signal<boolean>(false);

  aiRequestFormModel = signal<AiRequestFormModelSignal>({
    filterType: 'lastYear',
    startDateLocalEnd: '',
    startDateLocalStart: '',
    prompt: '',
  });

  getAthleteInfo() {
    this.dataService.getAthleteInfo().subscribe((userInfo) => {
      this.athleteInfo.set(userInfo);
    });
  }

  newChat() {
    this.lastChatItems.set([]);
    this.actualChatId.set(null);
  }

  aiRequestFormModelForm = form(this.aiRequestFormModel);

  response = signal<string>('');
  htmlContent = signal<string>('');

  activitiesResource: HttpResourceRef<ActivityMin[] | any> = httpResource(() => {
    return this.aiRequestFormModelForm.filterType().value() === 'selected'
      ? `${MIN_ACTIVITIES_ENDPOINT}`
      : undefined;
  });

  sendToModel() {
    this.thinkingProgress.set(true);
    this.requestUserLoading = this.aiRequestFormModelForm.prompt().value();
    const message = this.aiRequestFormModelForm.prompt().value();
    this.aiRequestFormModelForm.prompt().setControlValue('');
    this.dataService
      .aiQuestion({
        idChat: this.actualChatId(),
        message: message,
      })
      .pipe(
        switchMap(() => this.getLastChat()),
        tap(() => {
          this.thinkingProgress.set(false);
        }),
      )
      .subscribe();
  }

  getLastChat() {
    return this.dataService.getLastChat().pipe(
      tap((chat) => {
        const chatMapped = chat.map((item) => {
          return {
            ...item,
            message: marked(item.message) as string,
          };
        });
        this.actualChatId.set(chat?.[0]?.idChat || null);
        this.lastChatItems.set(chatMapped);
      }),
    );
  }

  selectionChange(selected: MatListOption[]) {
    this.selectedActivities = selected.map((s) => s.value);
  }

  exportExcel() {
    this.dataService.getExcel().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = moment().format('DD-MM-YYYY');
        a.download = date + '-aktywności.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      (err) => console.error(err),
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AthleteInfoDialog, {
      data: { athleteInfo: this.athleteInfo() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (!!result) {
        this.getAthleteInfo();
      }
    });
  }
}
