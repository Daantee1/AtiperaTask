import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataFilterService } from '../../services/data-filter.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule, MatDialogModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  originalData: any[] = [];  
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dataFilterService: DataFilterService
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('./assets/data.json').subscribe(data => {
      this.originalData = data;  
      this.dataSource.data = data; 
    });

    this.dataFilterService.filter$.subscribe(filterValue => {
      const filteredData = this.dataFilterService.applyFilter(this.originalData, filterValue);
      this.dataSource.data = filteredData;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilterService.setFilter(filterValue);
  }

  editRecord(element: any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.originalData.findIndex(record => record.position === result.position);
        if (index > -1) {
          this.originalData[index] = result;
          this.dataSource.data = [...this.originalData];  
        }
      }
    });
  }
}
