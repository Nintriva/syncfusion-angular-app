import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { SortService, ResizeService, PageService, EditService, ExcelExportService, TextWrapSettingsModel, FreezeService, PdfExportService, ContextMenuService } from '@syncfusion/ej2-angular-grids';
import { TreeGridComponent, RowDDService, ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { sampleData } from './data-source';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [RowDDService, SortService, ResizeService, PageService, EditService, ExcelExportService, FreezeService, PdfExportService, ContextMenuService]
})
export class AppComponent implements OnInit {
  @ViewChild('grid', { static: false }) public grid: TreeGridComponent;
  @ViewChild('template') public Dialog: DialogComponent;
  @ViewChild('styleDialog') public styleDialog: DialogComponent;
  @ViewChild('field') public field: ElementRef;
  @ViewChild('headerText') public headerText: ElementRef;
  @ViewChild('align') public align: ElementRef;
  @ViewChild('defaultValue') public defaultValue: ElementRef;
  @ViewChild('color') public color: ElementRef;
  @ViewChild('bgColor') public bgColor: ElementRef;
  @ViewChild('colField') public colField: ElementRef;
  @ViewChild('fontSize') public fontSize: ElementRef;
  @ViewChild('fontFamily') public fontFamily: ElementRef;
  @ViewChild('dataType') public dataType: ElementRef;

  public showCloseIcon: Boolean = true;
  public height = '60vh';
  public target = '.control-section';
  public animationSettings: AnimationSettingsModel = { effect: 'FlipYLeft' };
  public width = '600px';


  public data: Object[];
  public index: number;
  public contextMenuItems: any;
  public editing: EditSettingsModel;
  public wrapSettings: TextWrapSettingsModel;
  public allowMultiSorting: boolean = false;
  public enableCollapseAll: boolean = false;
  public allowFiltering: boolean = false;
  public allowResizing: boolean = true;
  public allowTextWrap: boolean;
  public allowReordering: boolean = true;
  public isFreezed: boolean = false;
  public isEditOperation: boolean = false;
  public frozenRow: number = 0;
  public frozenColumn: number = 0;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Cancel', 'Update'];
  public availableDataTypes: string[] = ['string', 'number-N1', 'number-N2', 'number-C1', 'number-C2', 'date-yyyy/mm/dd', 'date-dd/mm/yyyy'];
  public availableFonts: string[] = ['sans-serif', 'times', 'Gemunu Libre', 'Scheherazade New', 'stick No Bills'];
  public editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Row", newRowPosition: "Below" };
  public selectionSettings: Object;


  ngOnInit(): void {
    this.data = sampleData;
    this.index = (this.data.length * 4) + 1;
    this.selectionSettings = { type: 'Multiple' };
    this.allowTextWrap = false;
    this.wrapSettings = { wrapMode: 'Both' };
    this.contextMenuItems = ['Edit', 'Delete', 'Save',
      { text: 'Add Record', target: '.e-content', id: 'add', iconCss: 'e-icons e-add' },
      { text: 'Copy', target: '.e-content', id: 'copy', iconCss: 'e-icons e-copy' },
      { text: 'Cut', target: '.e-content', id: 'cut', iconCss: 'e-icons e-cut' },
      { text: 'Freeze On/Off', target: '.e-headercontent', id: 'freezecolumn', iconCss: 'e-icons e-freeze' },
      { text: 'Collapse On/Off', target: '.e-headercontent', id: 'collapse', iconCss: 'e-icons e-freeze' },
      { text: 'Add Column', target: '.e-headercontent', id: 'addcolumn', iconCss: 'e-icons e-add-col' },
      { text: 'Edit Column', target: '.e-headercontent', id: 'editcolumn', iconCss: 'e-icons e-edit-col' },
      { text: 'Del Column', target: '.e-headercontent', id: 'delcolumn', iconCss: 'e-icons e-del-col' },
      { text: 'Filter On/Off', target: '.e-headercontent', id: 'filter', iconCss: 'e-icons e-filter' },
      { text: 'Multi-Sort On/Off', target: '.e-headercontent', id: 'sort', iconCss: 'e-icons e-sort' },
      { text: 'Multi-Select On/Off', target: '.e-content', id: 'multiselect', iconCss: 'e-icons e-sort' },
      { text: 'style', target: '.e-headercontent', id: 'style', iconCss: 'e-icons e-style' },
      { text: 'Paste as sibling', target: '.e-content', id: 'paste', iconCss: 'e-icons e-paste' },
      { text: 'Paste as Child', target: '.e-content', id: 'pastechild', iconCss: 'e-icons e-paste' },
      { text: 'Column TextWrap On/off', target: '.e-headercontent', id: 'wrap', iconCss: 'e-icons e-del-col' },

    ];

  }
  contextMenuClick(args: MenuEventArgs): void {
    if (args.item.id === 'delcolumn') {
      let column = this.grid.getColumnByField(args['column'].field);
      column.visible = false;
      //this.grid.refresh();
      this.grid.refreshColumns();
    }

    if (args.item.id === 'freezecolumn') {
      let column = this.grid.getColumnByField(args['column'].field);
      this.frozenColumn = this.frozenColumn > 0 ? 0 : this.getIndex(column.field) + 1;

    }
    if (args.item.id === 'add') {
      this.grid.addRecord();
    }
    if (args.item.id === 'multiselect') {
      let settings = this.grid.selectionSettings;
      settings.type === 'Single' ? settings.type = 'Multiple' : settings.type = 'Single';
      this.grid.refresh();
    }
    if (args.item.id === 'wrap') {
      let settings = this.grid.textWrapSettings;
      settings.wrapMode = settings.wrapMode == 'Content' ? 'Both' : 'Content';
      this.grid.allowTextWrap = !this.grid.allowTextWrap;
      this.grid.refresh();
    }

    if (args.item.id === 'filter') {
      this.allowFiltering = !this.allowFiltering;
    }
    if (args.item.id === 'copy') {
      let selectedItems = this.grid.getSelectedRowIndexes();
      for (let i in selectedItems) {
        this.grid.getRowByIndex(selectedItems[i]).querySelectorAll('td').forEach((a, b) => {
          a.style.background = 'aquamarine';
        });
      }
      this.grid.copy();
    }
    if (args.item.id === 'cut') {
      this.grid.copy();
      this.grid.deleteRecord();

    }
    if (args.item.id === 'collapse') {
      this.enableCollapseAll = !this.enableCollapseAll;
    }
    if (args.item.id === 'style') {
      this.colField.nativeElement.value = args['column']['field'];
      this.styleDialog.show();
    }

    if (args.item.id === 'sort') {
      this.allowMultiSorting = !this.allowMultiSorting;
    }
    if (args.item.id === 'addcolumn') {
      this.field.nativeElement.value = '';
      this.align.nativeElement.value = '';
      this.defaultValue.nativeElement.value = '';
      this.headerText.nativeElement.value = '';
      this.dataType.nativeElement.value = '';
      this.isEditOperation = false;
      this.Dialog.show();
    }
    if (args.item.id === 'editcolumn') {
      this.isEditOperation = true;
      this.align.nativeElement.value = args['column']['textAlign'] != null ? args['column']['textAlign'] : 'Left';
      this.defaultValue.nativeElement.value = args['column']['defaultValue'] != undefined ? args['column']['defaultValue'] : '';
      this.field.nativeElement.value = args['column']['field'];
      this.headerText.nativeElement.value = args['column']['headerText'];
      let obj = args['column'];
      let elem = obj['format'] ? obj['type'].concat('-', obj['format']) : obj['type'];
      this.dataType.nativeElement.value = elem;
      this.Dialog.show();
    }
    if (args.item.id === 'pastechild') {
      this.grid.editSettings.newRowPosition = "Child";
      this.pasteContent(args['rowInfo'].rowIndex);

    }
    if (args.item.id === 'paste') {
      this.grid.editSettings.newRowPosition = "Below";
      this.pasteContent(args['rowInfo'].rowIndex);
    }
  }
  public pasteContent(index: number) {
    let newData = this.getDataFromClipBoard();
    setTimeout(() => {
      let newObj = this.convertIntObj(newData);
      newObj.forEach((x, num) => {
        x['taskID'] = this.index++;
        this.grid.addRecord({ ...x }, index);
      });
      this.refresh();
    }
      , 200);
  }

  public addColumn = (): void => {
    let field = this.field.nativeElement.value;
    let headerText = this.headerText.nativeElement.value;
    let defaultValue = this.defaultValue.nativeElement.value;
    let textAlign = this.align.nativeElement.value;
    let dataType = this.dataType.nativeElement.value;
    let newData = dataType.split('-');
    console.log(newData);
    let rowDetails: any = { field: field, headerText: headerText, defaultValue: defaultValue, textAlign: textAlign };
    rowDetails['type'] = newData[0] ? newData[0] : 'string';
    rowDetails['format'] = newData[1] ? newData[1] : '';
    this.grid.columns.push(rowDetails);
    this.grid.refreshColumns();
    this.data.forEach((a) => {
      a[field] = defaultValue;
      a['subtasks'].forEach((b) => {
        b[field] = defaultValue;
      });
    });
    this.grid.dataSource = this.data;
    this.grid.refresh();
    this.Dialog.hide();

  }
  public editColumn = (): void => {
    // let index = this.colIndex.nativeElement.value;
    let field = this.field.nativeElement.value;
    this.grid.getColumnByField(field).headerText = this.headerText.nativeElement.value;
    this.grid.getColumnByField(field).field = this.field.nativeElement.value;
    this.grid.getColumnByField(field).textAlign = this.align.nativeElement.value;
    this.grid.getColumnByField(field).defaultValue = this.defaultValue.nativeElement.value;
    let format = this.dataType.nativeElement.value;
    let newData = format.split('-');
    this.grid.getColumnByField(field).type = newData[0];
    this.grid.getColumnByField(field).format = newData[1];
    this.grid.refreshColumns();
    this.Dialog.hide();
  }

  public updateStyle = (): void => {
    let field = this.colField.nativeElement.value;
    let style = {
      'background-color': this.bgColor.nativeElement.value,
      'color': this.color.nativeElement.value,
      'font-size': this.fontSize.nativeElement.value,
      'font-family': this.fontFamily.nativeElement.value,
    }

    this.grid.getColumnByField(field).customAttributes = {
      style: style,
    };
    this.grid.refreshColumns();
    this.styleDialog.hide();
  }
  public getDataFromClipBoard(): any {
    let arr = [];
    let myobj = {};
    navigator['clipboard'].readText().then((data) => {
      let lines = data.split('\n');
      // let req = lines.pop().split('\t')
      lines.forEach((key, value) => {
        let myobj = {};
        let req = key.split('\t');
        if (value > 0) {
          var output = this.getColumns().map(function (obj, index) {
            myobj[obj] = req[index];
          });
          arr.push(myobj);
        }
      });

    });
    if (arr)
      return arr;
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

  public convertIntObj(obj) {

    const mainObj = []
    for (const key in obj) {
      const res = {}
      for (const ikey in obj[key]) {
        const parsed = parseInt(obj[key][ikey]);
        res[ikey] = isNaN(parsed) ? obj[key][ikey] : parsed;
      }
      mainObj.push(res);
    }
    return mainObj;
  }

  public refresh() {
    setTimeout(() => this.grid.refresh(), 100);
  }

}