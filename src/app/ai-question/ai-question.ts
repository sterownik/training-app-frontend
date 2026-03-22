import { Component, inject, signal } from '@angular/core';
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
import { ActivityMin } from '../interfaces/data';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import {MatListModule, MatListOption} from '@angular/material/list';
import { MIN_ACTIVITIES_ENDPOINT } from '../services/data/enpoints';
import { JsonPipe } from '@angular/common';

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
    JsonPipe
  ],
  templateUrl: './ai-question.html',
  styleUrl: './ai-question.scss',
})
export class AiQuestion {
  dataService = inject(DataService);
  isSaving = signal(false);
  selectedActivities!: number[];

  aiRequestFormModel = signal<AiRequestFormModelSignal>({
    filterType: 'lastYear',
    startDateLocalEnd: '',
    startDateLocalStart: '',
    prompt: '',
  });

  aiRequestFormModelForm = form(this.aiRequestFormModel);

  response = signal<string>('');
  htmlContent = signal<string>('');

  activitiesResource: HttpResourceRef<ActivityMin[] | any> = httpResource(
    () => {
      return this.aiRequestFormModelForm.filterType().value() === 'selected'
        ? `${MIN_ACTIVITIES_ENDPOINT}`
        : undefined;
    }
  );

  sendToModel() {
    let startDateLocalStart = '';
    let startDateLocalEnd = moment().format('YYYY-MM-DD');

    const calculateDate = (months: number) => {
      return moment().subtract(months, 'months').format('YYYY-MM-DD');
    };
    switch (this.aiRequestFormModelForm.filterType().value()) {
      case 'last18months':
        startDateLocalStart = calculateDate(18);
        break;
      case 'last3months':
        startDateLocalStart = calculateDate(3);
        break;
      case 'last6months':
        startDateLocalStart = calculateDate(6);
        break;
      case 'lastYear':
        startDateLocalStart = calculateDate(12);
        break;
      case 'customDate':
        startDateLocalStart = moment(
          this.aiRequestFormModelForm.startDateLocalStart().value()
        ).format('YYYY-MM-DD');
        startDateLocalEnd = moment(this.aiRequestFormModelForm.startDateLocalEnd().value()).format(
          'YYYY-MM-DD'
        );
        break


    }
    const filterActivityType = this.aiRequestFormModelForm.filterType().value() !== 'selected' ?
  {
        filterType: 'date',
        startDateLocalStart: startDateLocalStart,
        startDateLocalEnd: startDateLocalEnd,
      } :
      {
        filterType: 'selected',
        activityIds: this.selectedActivities
      }

    const prepareData = {
      prompt: this.aiRequestFormModelForm.prompt().value(),
      filterActivityType
    };
    this.isSaving.set(true);

    this.dataService.aiQuestion(prepareData).subscribe((data) => {
      const markdown = data.choices[0].message.content as any;
      this.response.set(markdown);
      this.htmlContent.set(marked(markdown) as any);
      this.isSaving.set(false);
    });
  }

  selectionChange(selected: MatListOption[]) {
    this.selectedActivities = selected.map(s => s.value);
  }
}
