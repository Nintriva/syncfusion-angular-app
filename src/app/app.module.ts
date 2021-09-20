import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';

import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [AppComponent], imports: [CommonModule, ToolbarModule, GridAllModule, BrowserModule, NumericTextBoxAllModule, DialogModule, DatePickerAllModule, TreeGridAllModule, DropDownListAllModule, ReactiveFormsModule, FormsModule, CheckBoxModule], providers: [], bootstrap: [AppComponent]
})
export class AppModule { }
