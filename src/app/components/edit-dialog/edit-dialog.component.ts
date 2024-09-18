import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [ MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  FormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
  
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) {
    
   }
   onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
