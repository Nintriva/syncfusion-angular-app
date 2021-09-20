import { Component, OnInit, ViewChild } from '@angular/core';
import { SortService, ResizeService, PageService, EditService, ExcelExportService, GridComponent, FreezeService, PdfExportService, ContextMenuService, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { TreeGrid, Resize, ExcelExport, PdfExport, Edit, Page, ContextMenu, Sort } from '@syncfusion/ej2-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';

import { ContextMenuItem, GroupSettingsModel, EditSettingsModel, ContextMenuItemModel } from '@syncfusion/ej2-angular-grids';
import { orderDetails } from './data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [SortService, ResizeService, PageService, EditService, ExcelExportService, FreezeService, PdfExportService, ContextMenuService]
})
export class AppComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

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
  // public selectionOptions: SelectionSettingsModel = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Flow' };


  ngOnInit(): void {
    this.data = orderDetails;
    this.contextMenuItems = ['Edit', 'Delete', 'Save', 'Copy',
      // { text: 'Copy', target: '.e-content', id: 'copy', iconCss: 'e-icons e-copy' },

      // { text: 'Freeze row', target: '.e-content', id: 'freezerow' },
      { text: 'Freeze On/Off', target: '.e-headercontent', id: 'freezecolumn', iconCss: 'e-icons e-freeze' },
      { text: 'Filter On/Off', target: '.e-headercontent', id: 'filter', iconCss: 'e-icons e-filter' },
      { text: 'Multi-Sort On/Off', target: '.e-headercontent', id: 'sort', iconCss: 'e-icons e-sort' },
      { text: 'style', target: '.e-headercontent', id: 'style', iconCss: 'e-icons e-style' },
      { text: 'Paste as sibbling', target: '.e-content', id: 'paste', iconCss: 'e-icons e-copy' }
    ];

  }
  contextMenuClick(args: MenuEventArgs): void {
    console.log(args);
    let column = this.grid.getColumnByField(args['column'].field); // Get column object.
    console.log(column);
    if (args.item.id === 'freezecolumn') {

      this.frozenColumn = this.frozenColumn > 0 ? 0 : args['column'].index + 1;
    }
    if (args.item.id === 'freezerow') {
      this.frozenRow = args['rowInfo'].cellIndex;
    }
    if (args.item.id === 'filter') {
      this.allowFiltering = !this.allowFiltering;
    }
    if (args.item.id === 'sort') {
      this.allowMultiSorting = !this.allowMultiSorting;
    }
    if (args.item.id === 'paste') {

    }
  }
}