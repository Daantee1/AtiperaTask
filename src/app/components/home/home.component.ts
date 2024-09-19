import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataFilterService } from '../../services/data-filter.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RxState } from '@rx-angular/state';
import { combineLatest, debounceTime, map, startWith, } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule, MatDialogModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RxState]

})
export class HomeComponent implements OnInit {
  

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dataFilterService: DataFilterService,
    public state: RxState<{ data: any[]; filter: string }>
  ) {
    this.state.set({ data: [], filter: '' });
  }

  ngOnInit(): void {
    const data$ = this.http.get<any[]>('./assets/data.json');

    const filter$ = this.dataFilterService.filter$.pipe(
      debounceTime(2000),
      startWith('') 
    );

    this.state.connect(
      'data',
      combineLatest([data$, filter$]).pipe(
        map(([data, filter]) => {
          return this.dataFilterService.applyFilter(data, filter); 
        })
      )
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilterService.setFilter(filterValue);
  }

  editRecord(element: any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.state.set('data', (state) => {
          const index = state.data.findIndex((record: any) => record.position === result.position);
          if (index > -1) {
            state.data[index] = result;
          }
          return [...state.data];
        });
      }
    });
  }
}
