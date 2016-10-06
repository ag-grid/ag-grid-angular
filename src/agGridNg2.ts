import {Component, EventEmitter, ViewEncapsulation, ViewContainerRef, ElementRef, NgZone} from '@angular/core';

import {Grid, GridOptions, GridApi, ColumnApi, ComponentUtil} from 'ag-grid/main';
import {GridParams} from "ag-grid/main";

import {Ng2FrameworkFactory} from "./ng2FrameworkFactory";

@Component({
    selector: 'ag-grid-ng2',
    outputs: [
        'columnEverythingChanged',
        'newColumnsLoaded',
        'columnPivotModeChanged',
        'columnRowGroupChanged',
        'columnPivotChanged',
        'gridColumnsChanged',
        'columnValueChanged',
        'columnMoved',
        'columnVisible',
        'columnPinned',
        'columnGroupOpened',
        'columnResized',
        'displayedColumnsChanged',
        'virtualColumnsChanged',
        'rowGroupOpened',
        'rowDataChanged',
        'floatingRowDataChanged',
        'rangeSelectionChanged',
        'columnRowGroupAddRequest',
        'columnRowGroupRemoveRequest',
        'columnPivotAddRequest',
        'columnPivotRemoveRequest',
        'columnValueAddRequest',
        'columnValueRemoveRequest',
        'columnAggFuncChangeRequest',
        'clipboardPaste',
        'modelUpdated',
        'cellClicked',
        'cellDoubleClicked',
        'cellContextMenu',
        'cellValueChanged',
        'cellFocused',
        'rowSelected',
        'selectionChanged',
        'beforeFilterChanged',
        'filterChanged',
        'afterFilterChanged',
        'filterModified',
        'beforeSortChanged',
        'sortChanged',
        'afterSortChanged',
        'virtualRowRemoved',
        'rowClicked',
        'rowDoubleClicked',
        'gridReady',
        'gridSizeChanged',
        'viewportChanged',
        'dragStarted',
        'dragStopped',
        'itemsAdded',
        'itemsRemoved'
    ],
    inputs: [
        'gridOptions',
        'slaveGrids',
        'rowData',
        'floatingTopRowData',
        'floatingBottomRowData',
        'columnDefs',
        'rowStyle',
        'context',
        'groupColumnDef',
        'localeText',
        'icons',
        'datasource',
        'viewportDatasource',
        'groupRowRendererParams',
        'aggFuncs',
        'fullWidthCellRendererParams',
        'sortingOrder',
        'rowClass',
        'rowSelection',
        'overlayLoadingTemplate',
        'overlayNoRowsTemplate',
        'headerCellTemplate',
        'quickFilterText',
        'rowModelType',
        'rowHeight',
        'rowBuffer',
        'colWidth',
        'headerHeight',
        'groupDefaultExpanded',
        'minColWidth',
        'maxColWidth',
        'viewportRowModelPageSize',
        'viewportRowModelBufferSize',
        'layoutInterval',
        'autoSizePadding',
        'maxPagesInCache',
        'maxConcurrentDatasourceRequests',
        'paginationOverflowSize',
        'paginationPageSize',
        'paginationInitialRowCount',
        'headerCellRenderer',
        'localeTextFunc',
        'groupRowInnerRenderer',
        'groupRowRenderer',
        'isScrollLag',
        'isExternalFilterPresent',
        'getRowHeight',
        'doesExternalFilterPass',
        'getRowClass',
        'getRowStyle',
        'getHeaderCellTemplate',
        'traverseNode',
        'getContextMenuItems',
        'getMainMenuItems',
        'processRowPostCreate',
        'processCellForClipboard',
        'getNodeChildDetails',
        'groupRowAggNodes',
        'getRowNodeId',
        'isFullWidthCell',
        'fullWidthCellRenderer',
        'doesDataFlower',
        'toolPanelSuppressRowGroups',
        'toolPanelSuppressValues',
        'toolPanelSuppressPivots',
        'toolPanelSuppressPivotMode',
        'suppressRowClickSelection',
        'suppressCellSelection',
        'suppressHorizontalScroll',
        'debug',
        'enableColResize',
        'enableCellExpressions',
        'enableSorting',
        'enableServerSideSorting',
        'enableFilter',
        'enableServerSideFilter',
        'angularCompileRows',
        'angularCompileFilters',
        'angularCompileHeaders',
        'groupSuppressAutoColumn',
        'groupSelectsChildren',
        'groupIncludeFooter',
        'groupUseEntireRow',
        'groupSuppressRow',
        'groupSuppressBlankHeader',
        'forPrint',
        'suppressMenuHide',
        'rowDeselection',
        'unSortIcon',
        'suppressMultiSort',
        'suppressScrollLag',
        'singleClickEdit',
        'suppressLoadingOverlay',
        'suppressNoRowsOverlay',
        'suppressAutoSize',
        'suppressParentsInRowNodes',
        'showToolPanel',
        'suppressColumnMoveAnimation',
        'suppressMovableColumns',
        'suppressFieldDotNotation',
        'enableRangeSelection',
        'suppressEnterprise',
        'rowGroupPanelShow',
        'pivotPanelShow',
        'suppressContextMenu',
        'suppressMenuFilterPanel',
        'suppressMenuMainPanel',
        'suppressMenuColumnPanel',
        'enableStatusBar',
        'rememberGroupStateWhenNewData',
        'enableCellChangeFlash',
        'suppressDragLeaveHidesColumns',
        'suppressMiddleClickScrolls',
        'suppressPreventDefaultOnMouseWheel',
        'suppressUseColIdForGroups',
        'suppressCopyRowsToClipboard',
        'pivotMode',
        'suppressAggFuncInHeader',
        'suppressColumnVirtualisation',
        'suppressFocusAfterRefresh',
        'functionsPassive',
        'functionsReadOnly',
        'enableTouch'
    ],

    template: '',
    // tell angular we don't want view encapsulation, we don't want a shadow root
    encapsulation: ViewEncapsulation.None
})
export class AgGridNg2 {

    // not intended for user to interact with. so putting _ in so if user gets reference
    // to this object, they kind'a know it's not part of the agreed interface
    private _nativeElement:any;
    private _initialised = false;
    private _destroyed = false;

    public gridOptions:GridOptions;
    private gridParams:GridParams;

    // making these public, so they are accessible to people using the ng2 component references
    public api:GridApi;
    public columnApi:ColumnApi;

    constructor(elementDef:ElementRef,
                private viewContainerRef:ViewContainerRef,
                private ng2FrameworkFactory:Ng2FrameworkFactory,
                private zone: NgZone) {
        this._nativeElement = elementDef.nativeElement;

        // create all the events generically. this is done generically so that
        // if the list of grid events change, we don't need to change this code.
        ComponentUtil.EVENTS.forEach((eventName) => {
            (<any>this)[eventName] = new EventEmitter();
        });

        this.ng2FrameworkFactory.setViewContainerRef(this.viewContainerRef);
    }

    private escapeZone(timeoutOrInterval: Function, period: number, action: Function) {
      this.zone.runOutsideAngular(() => {
        timeoutOrInterval.apply(window, [ () => this.zone.run(action), period ])
      }, period);
    }

    // this gets called after the directive is initialised
    public ngOnInit():void {
        this.gridOptions = ComponentUtil.copyAttributesToGridOptions(this.gridOptions, this);
        this.gridParams = {
            globalEventListener: this.globalEventListener.bind(this),
            frameworkFactory: this.ng2FrameworkFactory
        };

        this.gridOptions.intervalRunner = this.escapeZone.bind(this)

        new Grid(this._nativeElement, this.gridOptions, this.gridParams);
        this.api = this.gridOptions.api;
        this.columnApi = this.gridOptions.columnApi;

        this._initialised = true;
    }

    public ngOnChanges(changes:any):void {
        if (this._initialised) {
            ComponentUtil.processOnChange(changes, this.gridOptions, this.api, this.columnApi);
        }
    }

    public ngOnDestroy():void {
        if (this._initialised) {
            // need to do this before the destroy, so we know not to emit any events
            // while tearing down the grid.
            this._destroyed = true;
            this.api.destroy();
        }
    }

    private globalEventListener(eventType:string, event:any):void {
        // if we are tearing down, don't emit angular 2 events, as this causes
        // problems with the angular 2 router
        if (this._destroyed) {
            return;
        }
        // generically look up the eventType
        var emitter = <EventEmitter<any>> (<any>this)[eventType];
        if (emitter) {
            emitter.emit(event);
        } else {
            console.log('ag-Grid-ng2: could not find EventEmitter: ' + eventType);
        }
    }
}
