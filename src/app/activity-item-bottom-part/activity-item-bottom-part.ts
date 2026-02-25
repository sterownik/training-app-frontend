import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextCutterPipe } from '../text-cutter-pipe';
import { FormField, form } from '@angular/forms/signals';
import { ActivityExtendedFromInterface } from '../interfaces/data';
import { DataService } from '../services/data/data-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogLaps } from './dialoglaps/dialoglaps';

interface ActivityExtendedFromModelSignal {
  id: number;
  descriptionTyped: string;
  npPower: number | string;
  isBike: boolean;
}

@Component({
  selector: 'tra-activity-item-bottom-part',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextCutterPipe,
    FormField,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './activity-item-bottom-part.html',
  styleUrl: './activity-item-bottom-part.scss',
})
export class ActivityItemBottomPart implements OnInit {
  @Input({ required: true }) activityExtendedData!: ActivityExtendedFromInterface;
  @Input() laps!: string;
  dataService = inject(DataService);
  isEditMode = signal(false);
  isSaving = signal(false);
  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogLaps, {
      data: this.laps,
    });
  }

  activityExtendedModel = signal<ActivityExtendedFromModelSignal>({
    id: 0,
    descriptionTyped: '',
    npPower: 0,
    isBike: false,
  });

  activityExtendedDataForm = form(this.activityExtendedModel);

  ngOnInit(): void {
    this.activityExtendedModel.set({
      id: this.activityExtendedData.id,
      descriptionTyped: this.activityExtendedData.descriptionTyped || '',
      npPower: this.activityExtendedData.npPower || '',
      isBike: this.activityExtendedData.isBike || false,
    });
  }

  saveActivity() {
    this.isSaving.set(true);
    this.dataService.updateActivity(this.activityExtendedDataForm().value()).subscribe(() => {
      this.isSaving.set(false);
      this.isEditMode.set(false);
    });
  }
}
