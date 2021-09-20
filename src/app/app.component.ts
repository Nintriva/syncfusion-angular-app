import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
// import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
// import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { SortService, ResizeService, PageService, EditService, ExcelExportService, GridComponent, FreezeService, PdfExportService, ContextMenuService } from '@syncfusion/ej2-angular-grids';
// import { TreeGrid, Resize, ExcelExport, PdfExport, Edit, Page, ContextMenu, Sort } from '@syncfusion/ej2-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';

import { ContextMenuItem, GroupSettingsModel, EditSettingsModel, ContextMenuItemModel } from '@syncfusion/ej2-angular-grids';
import { sampleData } from './jsontreedata';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [SortService, ResizeService, PageService, EditService, ExcelExportService, FreezeService, PdfExportService, ContextMenuService]
})
export class AppComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('template') public Dialog: DialogComponent;
  @ViewChild('field') public field: ElementRef;
  @ViewChild('headerText') public headerText: ElementRef;

  public showCloseIcon: Boolean = true;
  public height = '55%';
  public target = '.control-section';
  public animationSettings: AnimationSettingsModel = { effect: 'Zoom' };
  public width = '435px';


  public data: Object[];
  public contextMenuItems: any;
  public editing: EditSettingsModel;
  public allowMultiSorting: boolean = false;
  public allowFiltering: boolean = false;
  public allowResizing: boolean = true;
  public allowReordering: boolean = true;
  public isFreezed: boolean = false;
  public frozenRow: number = 0;
  public frozenColumn: number = 0;
  public editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
  public selectionOptions: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' };


  ngOnInit(): void {
    this.data = sampleData;
    this.contextMenuItems = ['Edit', 'Delete', 'Save', 'Copy',
      // { text: 'Copy', target: '.e-content', id: 'copy', iconCss: 'e-icons e-copy' },
      { text: 'Freeze On/Off', target: '.e-headercontent', id: 'freezecolumn', iconCss: 'e-icons e-freeze' },
      { text: 'Add Column', target: '.e-headercontent', id: 'addcolumn', iconCss: 'e-icons e-freeze' },
      { text: 'Del Column', target: '.e-headercontent', id: 'delcolumn', iconCss: 'e-icons e-freeze' },
      { text: 'Filter On/Off', target: '.e-headercontent', id: 'filter', iconCss: 'e-icons e-filter' },
      { text: 'Multi-Sort On/Off', target: '.e-headercontent', id: 'sort', iconCss: 'e-icons e-sort' },
      { text: 'style', target: '.e-headercontent', id: 'style', iconCss: 'e-icons e-style' },
      { text: 'Paste as new item', target: '.e-content', id: 'paste', iconCss: 'e-icons e-copy' }
    ];

  }
  contextMenuClick(args: MenuEventArgs): void {

    let column = this.grid.getColumnByField(args['column'].field); // Get
    if (args.item.id === 'delcolumn') {
      column.visible = false;
      this.grid.refreshColumns();
    }
    if (args.item.id === 'freezecolumn') {

      //this.getIndex(column.field);
      this.frozenColumn = this.frozenColumn > 0 ? 0 : this.getIndex(column.field) + 1;
    }

    if (args.item.id === 'filter') {
      this.allowFiltering = !this.allowFiltering;
    }
    if (args.item.id === 'style') {
      this.Dialog.show();
    }
    if (args.item.id === 'sort') {
      this.allowMultiSorting = !this.allowMultiSorting;
    }
    if (args.item.id === 'addcolumn') {
      this.Dialog.show();

    }
    if (args.item.id === 'paste') {
      let newData = this.getDataFromClipBoard();
      //console.log(args['rowInfo'].rowData.childRecords.push(newData));
      this.data.push(newData);
      setTimeout(() => this.grid.refresh(), 500);
    }
  }
  public addColumn = (): void => {
    let field = this.field.nativeElement.value;
    let headerText = this.headerText.nativeElement.value
    let rowDetails: any = { field: field, headerText: headerText, defaultValue: 0 };
    this.grid.columns.push(rowDetails);
    this.grid.refreshColumns();
    this.Dialog.hide();

  }
  public updateStyle = (): void => {
    // this.bgColor.nativeElement.value = '';
    // this.colWidth.nativeElement.value = '';
  }
  public getDataFromClipBoard(): object {

    var myobj = {};
    navigator['clipboard'].readText().then((data) => {
      //console.log(data);
      let lines = data.split('\n');
      console.log(lines);
      let req = lines.pop().split('\t')
      var output = this.getColumns().map(function (obj, index) {
        myobj[obj] = req[index];
      });
    });

    return myobj;
  }
  public getIndex(colName: string): number {
    let index = -1;
    this.grid.columns.forEach(function (arrayItem, key) {
      if (arrayItem['field'] === colName) {
        index = key;
      }
    });
    return index;
  }
  public getColumns() {
    let columns = [];
    this.grid.columns.forEach(function (arrayItem, key) {
      columns.push(arrayItem['field']);
    });
    return columns;
  }

}