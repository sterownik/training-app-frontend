import { Component, inject, OnInit } from '@angular/core';
import { UserData } from '../services/user-data';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../services/data/data-service';

@Component({
  selector: 'tra-top-bar',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar implements OnInit {
  userData = inject(UserData);
  dataService = inject(DataService);

  ngOnInit(): void {
    this.userData.userInfo;
  }

  exportExcel() {
    this.dataService.getExcel().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aktywności.xls';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      (err) => console.error(err),
    );
  }
}
