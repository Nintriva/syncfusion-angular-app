import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { SortService, ResizeService, PageService, EditService, ExcelExportService, TextWrapSettingsModel, FreezeService, PdfExportService, ContextMenuService, BooleanEditCell, extendObjWithFn } from '@syncfusion/ej2-angular-grids';
import { TreeGridComponent, RowDDService } from '@syncfusion/ej2-angular-treegrid';
import { HttpClient } from '@angular/common/http';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { sampleData } from './data-source';
import { Query } from '@syncfusion/ej2-data';
import { from, Observable } from 'rxjs';
import { ObjectType } from '@syncfusion/ej2-pdf-export';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

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
    @ViewChild('minWidth') public minWidth: ElementRef;
    @ViewChild('dropDownValues') public dropDownValues: ElementRef;
    @ViewChild('wrapSelect') public wrapSelect: ElementRef;
    public showCloseIcon: Boolean = true;
    public height = '60vh';
    public target = '.control-section';
    public animationSettings: AnimationSettingsModel = { effect: 'FlipYLeft' };
    public width = '600px';


    public data: any;
    public customAttributes: object;
    public index: number;
    public selectedDatatype: string;
    public selectedIndex: any;
    public contextMenuItems: any;
    public editing: EditSettingsModel;
    public wrapSettings: TextWrapSettingsModel;
    public allowMultiSorting: boolean;
    public enableCollapseAll: boolean = false;
    public allowFiltering: boolean = true;
    public allowResizing: boolean = true;
    public allowTextWrap: boolean;
    public allowReordering: boolean = true;
    public isFreezed: boolean = false;
    public isEditOperation: boolean = false;
    public frozenRow: number = 0;
    public frozenColumn: number = 0;
    public taskidRule: object;
    public assigneeRule: object;
    public allColumns: any;
    public baseUrl: string = 'https://data.nintrivalabs.com/data.php';
    public toolbarOptions: ToolbarItems[];
    public availableDataTypes: string[] = ['string', 'boolean', 'dropDownList', 'number', 'date'];
    public availableFonts: string[] = ['sans-serif', 'times', 'Gemunu Libre', 'Scheherazade New', 'stick No Bills'];
    public editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Dialog", newRowPosition: "Below" };
    public selectionSettings: Object;
    public copiedData: any;
    public operation: string;
    public showTree: boolean;
    public editTypeColumns: object = { 'boolean': 'booleanedit', 'dropDownList': 'dropdownedit', 'number': 'numericedit', 'string': 'defaultedit', 'date': 'datepickeredit' };
    public flag: boolean;
    public addItemIndex: number;
    public deletedIndex: number;
    public filteringOptions: Object;
    public customStyle: any;
    // public ddParams: object;
    constructor(private http: HttpClient) {


    }
    ngOnInit(): void {
        this.showTree = false;
        // this.customAttributes = { style: 'color:red' };

        this.getData().subscribe(res => {
            if (!Array.isArray(res)) {
                this.data = sampleData;
            } else {
                this.data = res;
            }
            this.showTree = true;
            this.loadColumns();
            //
            //this.data = sampleData;
            this.load();
        }, err => {

            this.data = sampleData;
            this.loadColumns();
            this.load();
        });
    }
    public isPrimary(column): boolean {
        //alert(1);
        if (column.isPrimaryKey || column.field == 'taskID') {
            return true;
        } else {
            return false;
        }
    }
    public load() {
        this.customStyle = [];
        this.allowMultiSorting = true;
        this.flag = false;
        this.addItemIndex = 0;
        this.filteringOptions = { type: "Excel" };
        this.index = 1200;//(this.data.length * 4) + 1;
        this.toolbarOptions = ['ColumnChooser'];
        this.assigneeRule = { required: true };
        this.taskidRule = { required: true, number: true };
        this.selectionSettings = { type: 'Multiple' };
        this.allowTextWrap = false;
        this.wrapSettings = { wrapMode: 'Both' };
        this.contextMenuItems = ['Edit', 'Save', 'Cancel',
            { text: 'Delete Record', target: '.e-content', id: 'delete', iconCss: 'e-icons e-delete' },
            { text: 'Add Record', target: '.e-content', id: 'add', iconCss: 'e-icons e-add' },
            { text: 'Copy', target: '.e-content', id: 'copy', iconCss: 'e-icons e-copy' },
            { text: 'Cut', target: '.e-content', id: 'cut', iconCss: 'e-icons e-cut' },
            { text: 'Freeze On/Off', target: '.e-headercontent', id: 'freezecolumn', iconCss: 'e-icons e-freeze' },
            { text: 'Collapse On/Off', target: '.e-headercontent', id: 'collapse', iconCss: 'e-icons e-freeze' },
            { text: 'Add Column', target: '.e-headercontent', id: 'addcolumn', iconCss: 'e-icons e-add-col' },
            { text: 'Edit Column', target: '.e-headercontent', id: 'editcolumn', iconCss: 'e-icons e-edit-col' },
            { text: 'Delele Column', target: '.e-headercontent', id: 'delcolumn', iconCss: 'e-icons e-del-col' },
            { text: 'Filter On/Off', target: '.e-headercontent', id: 'filter', iconCss: 'e-icons e-filter' },
            { text: 'Multi-Sort On/Off', target: '.e-headercontent', id: 'sort', iconCss: 'e-icons e-sort' },
            { text: 'Multi-Select On/Off', target: '.e-content', id: 'multiselect', iconCss: 'e-icons e-sort' },
            { text: 'Style', target: '.e-headercontent', id: 'style', iconCss: 'e-icons e-style' },
            { text: 'Paste as sibling', target: '.e-content', id: 'paste', iconCss: 'e-icons e-paste' },
            { text: 'Paste as child', target: '.e-content', id: 'pastechild', iconCss: 'e-icons e-paste' },

        ];
    }
    public loadColumns() {
        this.getColumn().subscribe(cols => {
            this.allColumns = cols;

            console.log(this.allColumns);
            this.showTree = true;
            setTimeout(() => {
                this.grid.columns.forEach((elem) => {
                    if (elem.field == 'taskID') {
                        elem.isPrimaryKey = true;
                    }
                    console.log(elem);
                    if (Array.isArray(this.allColumns)) {
                        this.allColumns.forEach((element) => {
                            console.log(element)
                            if (element.field == elem.field) {
                                console.log(element.field);
                                console.log(elem.field);
                                elem.width = element.width,
                                    elem.minWidth = element.minWidth
                            }
                        });
                        console.log(this.allColumns);
                        this.grid.setProperties({ columns: this.allColumns })
                        // this.grid.refreshColumns()
                        this.grid.refresh();
                    }
                });

            }, 200);
        });
    }
    // public customAttributes(elem) {
    //   return { style: 'color:red' };
    // }


    contextMenuClick(args: MenuEventArgs): void {
        if (args.item.id === 'delcolumn') {
            let column = this.grid.getColumnByField(args['column'].field);
            column.visible = false;
            this.saveColumn();
            this.grid.refreshColumns();
        }
        if (args.item.id === 'delete') {
            //console.log(args);
            this.grid.deleteRecord(null, args['rowInfo']['rowData']);
            this.refresh();
        }
        if (args.item.id === 'freezecolumn') {
            let column = this.grid.getColumnByField(args['column'].field);
            this.frozenColumn = this.frozenColumn > 0 ? 0 : this.getIndex(column.field) + 1;

        }
        if (args.item.id === 'add') {

            if (args['rowInfo'].hasOwnProperty('rowIndex')) {
                this.addItemIndex = args['rowInfo']['rowIndex'];

            }
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
            this.operation = 'copy';
            let selectedItems = this.grid.getSelectedRowIndexes();
            this.highlightColor(selectedItems, 'copy');
            this.copiedData = args['rowInfo']['rowData'];
            this.selectedIndex = this.grid.getSelectedRecords();
            this.grid.copy();
        }
        if (args.item.id === 'cut') {
            this.operation = 'cut';
            this.selectedIndex = this.grid.getSelectedRecords();
            let selectedItems = this.grid.getSelectedRowIndexes();
            this.highlightColor(selectedItems, 'cut');
            this.copiedData = args['rowInfo']['rowData'];
            this.grid.copy();

        }
        if (args.item.id === 'collapse') {
            this.enableCollapseAll = !this.enableCollapseAll;
        }
        if (args.item.id === 'style') {
            this.colField.nativeElement.value = args['column']['field'];
            if (this.customStyle.hasOwnProperty(args['column']['field'])) {

                let elem = this.customStyle[args['column']['field']];
                this.color.nativeElement.value = elem['color'];
                this.bgColor.nativeElement.value = elem['background-color'];
                this.fontFamily.nativeElement.value = elem['font-family'];
                this.fontSize.nativeElement.value = elem['font-size'];
                this.wrapSelect.nativeElement.value = elem['wrap'];

            } else {
                this.color.nativeElement.value = '#000000';
                this.bgColor.nativeElement.value = '#ffffff';
                this.fontFamily.nativeElement.value = 'sans-serif';
                this.fontSize.nativeElement.value = '13px';
                this.wrapSelect.nativeElement.value = "Disable";
            }
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
            this.minWidth.nativeElement.value = '';
            //this.dropDownValues.nativeElement.value = '';
            this.selectedDatatype = "";
            this.isEditOperation = false;
            this.Dialog.show();
        }
        if (args.item.id === 'editcolumn') {
            this.isEditOperation = true;
            this.align.nativeElement.value = args['column']['textAlign'] != null ? args['column']['textAlign'] : 'Left';
            this.defaultValue.nativeElement.value = args['column']['defaultValue'] != undefined ? args['column']['defaultValue'] : '';
            this.field.nativeElement.value = args['column']['field'];
            this.headerText.nativeElement.value = args['column']['headerText'];
            this.minWidth.nativeElement.value = args['column']['minWidth'];
            let obj = args['column'];
            let elem = obj['format'] ? obj['type'].concat('-', obj['format']) : obj['type'];
            this.dataType.nativeElement.value = elem;
            this.selectedDatatype = elem;
            this.Dialog.show();
        }
        if (args.item.id === 'pastechild') {
            this.grid.editSettings.newRowPosition = "Child";
            //console.log(args);
            this.pasteContent(args['rowInfo'].rowIndex);

        }
        if (args.item.id === 'paste') {
            this.grid.editSettings.newRowPosition = "Below";
            this.pasteContent(args['rowInfo'].rowIndex);
        }
    }
    public highlightColor = (selectedItems: any, operation: string) => {
        for (let i in selectedItems) {
            this.grid.getRowByIndex(selectedItems[i]).querySelectorAll('td').forEach((a, b) => {
                a.style.background = 'lightpink';
            });
        }
    }
    public pasteContent(index: number) {
        this.grid.showSpinner();
        this.flag = true;
        // let newData = this.copiedData;
        // let numberOfDeletedRows = 0;

        this.deletedIndex = index;

        if (this.operation == 'cut') {
            let objArray = [];
            Promise.all(this.selectedIndex.map(async (element: object): Promise<void> => {
                let newData = this.copyObject(element);
                objArray.push(newData['taskData']);
                await this.deleteObjectRecord(element);
                // console.log('deleting', element);
            })).then(async () => {
                // console.log('objArray', objArray);
                await this.wait(100);
                objArray.forEach(async (obj1: object) => {
                    let data = this.copyObject(obj1);
                    // console.log({ 'index': this.deletedIndex, 'data': data });
                    await this.wait(1);
                    this.addItemIndex = this.deletedIndex;
                    await this.wait(1);
                    this.grid.addRecord(data, this.deletedIndex);
                });
            });
        }
        if (this.operation == 'copy') {
            this.selectedIndex.forEach(async (element: object) => {
                let newData = this.copyObject(element);
                let obj = { ...newData['taskData'] };
                obj.taskID = this.index++;
                this.changeSubTaskId(obj);
                await this.wait(1);
                this.addItemIndex = index;
                await this.wait(1);
                this.grid.addRecord(obj, index)


            });
        }
        this.refresh();


        // this.grid.hideSpinner();
        this.flag = false;

    }

    public deleteObjectRecord(element: object, deleteRow: boolean = true) {
        return new Promise<void>(async (resolve, reject) => {
            if (element.hasOwnProperty('subtasks')) {
                element['subtasks'].forEach(async (element1: any) => {
                    if (element1.hasOwnProperty('subtasks')) {
                        await this.deleteObjectRecord(element1, false);
                    }
                    if (element['index'] < this.deletedIndex) {
                        this.deletedIndex--;
                        //   console.log(this.deletedIndex);
                    }
                });
            }

            if (deleteRow == true) {
                if (element['index'] < this.deletedIndex) {
                    // console.log("main");
                    this.deletedIndex--;
                    // console.log(this.deletedIndex);
                }
                await this.wait(1);

                this.grid.deleteRecord('taskId', element);
            }
            resolve();
        });
    }

    public copyObject(element: object) {
        return JSON.parse(JSON.stringify(element))
    }
    public changeSubTaskId(obj: object): void {
        //  console.log(obj);
        if (obj.hasOwnProperty('subtasks')) {
            // obj['subtasks'] = [...obj['subtasks']];
            let arr = [];
            obj['subtasks'].forEach((element) => {
                if (element.hasOwnProperty('subtasks')) {
                    this.changeSubTaskId(element);
                }
                let newElem = { ...element }

                newElem['taskID'] = this.index++;
                arr.push(newElem);
            });
            obj['subtasks'] = arr;
        }
    }
    public changeType = (): any => {
        // if (this.dataType.nativeElement.value == 'boolean') {
        //   this.showBoolean = true;
        // } else {
        //   this.showBoolean = false;
        // }
        this.selectedDatatype = this.dataType.nativeElement.value;
    }
    public addColumn = (): void => {

        let field = this.field.nativeElement.value;
        let headerText = this.headerText.nativeElement.value;
        let defaultValue = this.defaultValue.nativeElement.value;
        let textAlign = this.align.nativeElement.value;
        let dataType = this.dataType.nativeElement.value;
        let minWidth = this.minWidth.nativeElement.value;
        let editType = this.editTypeColumns[dataType];
        if (field == '' || headerText == '') {
            alert('please fill field name and header text');
            return;
        }
        let newData = dataType.split('-');
        let rowDetails: any = { width: 100, minWidth: minWidth, field: field, headerText: headerText, defaultValue: defaultValue, textAlign: textAlign, editType: editType };
        rowDetails['type'] = newData[0] ? newData[0] : 'string';
        if (rowDetails['type'] == 'dropDownList') {
            let ds = [];
            let dropValues = this.dropDownValues.nativeElement.value;
            let elems = dropValues.split(',');
            elems.forEach(element => {
                ds.push({ type: element });
            });
            let editParams = {
                params: {
                    query: new Query(),
                    dataSource: ds,
                    fields: { value: 'type', text: 'type' }
                }
            }
            rowDetails['edit'] = editParams;
        }
        if (rowDetails['type'] == 'date') {
            rowDetails['format'] = 'yyyy/MM/dd';
        }
        //  console.log(rowDetails);
        if (this.grid.columns.push(rowDetails)) {
            this.grid.refreshColumns();
            this.data.forEach((a) => {
                a[field] = dataType.includes('number') ? parseFloat(defaultValue) : defaultValue;
                if (a.hasOwnProperty('subtasks')) {
                    a['subtasks'].forEach((b) => {
                        b[field] = dataType.includes('number') ? parseFloat(defaultValue) : defaultValue;
                    });
                }
            });
            this.saveColumn();
            // this.grid.dataSource = this.data;
            this.grid.refresh();
            this.Dialog.hide();
            // console.log(this.grid.columns);

        }

    }

    public editColumn = (): void => {
        // let index = this.colIndex.nativeElement.value;
        if (this.validateUpdate()) {
            let field = this.field.nativeElement.value;
            this.grid.getColumnByField(field).headerText = this.headerText.nativeElement.value;
            this.grid.getColumnByField(field).field = this.field.nativeElement.value;
            this.grid.getColumnByField(field).textAlign = this.align.nativeElement.value;
            this.grid.getColumnByField(field).defaultValue = this.defaultValue.nativeElement.value;
            this.grid.getColumnByField(field).minWidth = this.minWidth.nativeElement.value;

            let format = this.dataType.nativeElement.value;
            let newData = format.split('-');
            this.grid.getColumnByField(field).type = newData[0];


            this.grid.getColumnByField(field).editType = this.editTypeColumns[newData[0]];
            // if (newData[0] == 'boolean' || newData[0] == 'numeric') {
            //   this.grid.getColumnByField(field).format = 'N1';
            // }
            this.saveColumn();
            this.grid.refreshColumns();

            this.Dialog.hide();
        } else {
            alert("column contains item that are not in this datatype.")
        }
    }

    public updateStyle = (): void => {
        let field = this.colField.nativeElement.value;

        let style = {
            'background-color': this.bgColor.nativeElement.value,
            'color': this.color.nativeElement.value,
            'font-size': this.fontSize.nativeElement.value,
            'font-family': this.fontFamily.nativeElement.value,
        }
        let c = this.wrapSelect.nativeElement.value == 'Disable' ? 'a-erow' : 'b-erow';
        this.grid.getColumnByField(field).customAttributes = {
            'style': style,
            'class': c,
        };
        this.customStyle[field] = { ...style, wrap: this.wrapSelect.nativeElement.value };
        //  console.log(this.customStyle);
        this.saveColumn();
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
    public getRowByIndex(index: number) {
        this.data.forEach((element) => {
            if (element['taskID'] == index) {
                return element;
            }
        })
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
    public validateUpdate = (): boolean => {

        let is_valid = true;
        let dataType = this.dataType.nativeElement.value;
        let column = this.field.nativeElement.value;
        this.data.forEach(element => {
            if (dataType == 'boolean') {
                if (element[column].toString() != "true" && element[column] != "false") {
                    is_valid = false;
                }
            }
            if (dataType == 'number') {
                //  console.log(parseInt(element[column]))
                if (isNaN(parseInt(element[column]))) {
                    is_valid = false;
                }
            }
            if (dataType == 'date') {
                if (element[column].toString() == 'true' || element[column].toString() == 'false') {
                    is_valid = false;
                }
            }
        });

        return is_valid;
    }


    public refresh() {
        this.grid.showSpinner();
        setTimeout(() => {
            this.grid.refresh();
            this.grid.hideSpinner();

        }, 200);
    }

    public wait(num: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, num);
        });
    }

    actionBegin(args) {

        if (args.requestType == 'save' && args.action == 'add' && this.flag == false) {
            //   console.log('beg', args);
            //   console.log('this.addItemIndex', this.addItemIndex);
            this.flag = true;
            args['cancel'] = true;
            let data = this.copyObject(args['data']);
            if (this.validatePk(data['taskID'])) {
                this.grid.addRecord({ ...data }, this.addItemIndex);
                this.grid.closeEdit();
                //this.grid.refresh();
                this.refresh();
                this.flag = false;
            } else {
                alert("Task ID should be unique id");
            }

        }
    }
    validatePk(taskID: number) {
        let valid = true;
        this.data.forEach((element) => {
            if (element['taskID'] == taskID) {
                valid = false;
            }
            if (element.hasOwnProperty('subtasks')) {
                element['subtasks'].forEach(val => {
                    if (val['taskID'] == taskID) {
                        valid = false;
                    }
                });
            }
        });
        return valid;
    }
    actionComplete(args) {

        if (args['requestType'] != 'refresh' && args['requestType'] != "beginEdit") {
            this.saveData();
            this.saveColumn();
        }
    }
    getData() {
        let urlParams = { file: 'data', type: 'get' }
        //  console.log(this.addParams(urlParams));
        return this.get(urlParams);
    }
    saveColumn() {
        let urlParams = { file: 'columns', type: 'save' }
        let colFields = this.grid.getColumns();
        console.log(colFields);
        let data = [];
        colFields.forEach(elem => {
            let obj = {
                headerText: elem.headerText,
                field: elem.field,
                isPrimaryKey: elem.isPrimaryKey,
                width: elem.width,
                minWidth: elem.minWidth,

            };
            if (elem.hasOwnProperty('customAttributes')) {
                obj['customAttributes'] = elem.customAttributes;
            } else {
                //  obj['customAttributes'] = { 'style': 'color:red' };
            }
            data.push(obj);
        })
        console.log(data);
        this.save(urlParams, data).subscribe(res => {

        });
    }
    saveData() {
        let urlParams = { file: 'data', type: 'save' }
        this.save(urlParams, this.grid.dataSource).subscribe(res => {

        });
    }
    getColumn() {
        let urlParams = { file: 'columns', type: 'get' }
        return this.get(urlParams);
    }
    save(urlParams, data) {
        var url = this.baseUrl + '?' + this.addParams(urlParams);
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json; charset=utf-8');
        const body = JSON.stringify(data);
        return this.http.post(url, body, { headers: headers })

    }
    get(urlParams) {

        let url = this.baseUrl + '?' + this.addParams(urlParams);
        return this.http.get(url);
    }
    addParams(urlParams) {
        var out = [];
        for (var key in urlParams) {
            if (urlParams.hasOwnProperty(key)) {
                out.push(key + '=' + encodeURIComponent(urlParams[key]));
            }
        }
        let l = out.join('&');
        return l;
    }
}