import { AfterContentInit, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataService } from '../../services/data/data-service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface AthleteInfoForm {
  athleteInfo: string;
}

@Component({
  selector: 'tra-athlete-info-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatButton,
    FormsModule,
    FormField,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './athlete-info-dialog.html',
  styleUrl: './athlete-info-dialog.scss',
})
export class AthleteInfoDialog implements AfterContentInit {
  data = inject(MAT_DIALOG_DATA);
  dataService = inject(DataService);
  readonly dialogRef = inject(MatDialogRef<AthleteInfoDialog>);
  isSaving = signal(false);

  userFormModel = signal<AthleteInfoForm>({
    athleteInfo: '',
  });
  form = form(this.userFormModel);

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.isSaving.set(true);
    this.dataService.updateAthleteInfo(this.form.athleteInfo().value()).subscribe(() => {
      this.dialogRef.close(true);
      this.isSaving.set(false);
    });
  }

  ngAfterContentInit(): void {
    this.form.athleteInfo().setControlValue(this.data.athleteInfo);
  }
}
