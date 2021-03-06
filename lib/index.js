'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDom = require('react-dom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactLoadMask = require('react-load-mask');

var _reactLoadMask2 = _interopRequireDefault(_reactLoadMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('es6-promise').polyfill();

var assign = require('object-assign');

var Region = require('region');

var PaginationToolbar = _react2.default.createFactory(require('./PaginationToolbar'));
var Column = require('./models/Column');

var RowSelect = require('./RowSelect');
var ColumnFilter = require('./ColumnFilter');
var getDefaultProps = require('./getDefaultProps');
var DataGridPropTypes = require('./PropTypes');
var Wrapper = require('./Wrapper');
var Header = require('./Header');
var WrapperFactory = _react2.default.createFactory(Wrapper);
var HeaderFactory = _react2.default.createFactory(Header);
var ResizeProxy = require('./ResizeProxy');

var findIndexByName = require('./utils/findIndexByName');
var group = require('./utils/group');

var slice = require('./render/slice');
var _getTableProps = require('./render/getTableProps');
var getGroupedRows = require('./render/getGroupedRows');
var renderMenu = require('./render/renderMenu');

var preventDefault = require('./utils/preventDefault');

var isArray = Array.isArray;

var SIZING_ID = '___SIZING___';

function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}

function signum(x) {
    return x < 0 ? -1 : 1;
}

function emptyFn() {}

function dataFn(props, name) {
    var value = props[name];
    if (isArray(value)) {
        return new Error('We are deprecating the "data" array prop. Use "dataSource" instead! It can either be an array (for local data) or a remote data source (string url, promise or function)');
    }
}

function getVisibleCount(props, state) {
    return getVisibleColumns(props, state).length;
}

function getVisibleColumns(props, state) {

    var visibility = state.visibility;
    var visibleColumns = props.columns.filter(function (c) {
        var name = c.name;
        var visible = c.visible;

        if (name in visibility) {
            visible = !!visibility[name];
        }

        return visible;
    });

    return visibleColumns;
}

function findColumn(columns, column) {

    var name = typeof column === 'string' ? column : column.name;
    var index = findIndexByName(columns, name);

    if (~index) {
        return columns[index];
    }
}

var ReactDataGrid = function (_React$Component) {
    _inherits(ReactDataGrid, _React$Component);

    function ReactDataGrid() {
        _classCallCheck(this, ReactDataGrid);

        return _possibleConstructorReturn(this, (ReactDataGrid.__proto__ || Object.getPrototypeOf(ReactDataGrid)).apply(this, arguments));
    }

    _createClass(ReactDataGrid, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('click', this.windowClickListener = this.onWindowClick);
            this.hasVerticalScrollbar();
            // this.checkRowHeight(this.props)
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.hasVerticalScrollbar();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.scroller = null;
            window.removeEventListener('click', this.windowClickListener);
        }

        // checkRowHeight (props) {
        //     if (this.isVirtualRendering(props)){

        //         //if virtual rendering and no rowHeight specifed, we use
        //         var row = this.findRowById(SIZING_ID)
        //         var config = {}

        //         if (row){
        //             this.setState({
        //                 rowHeight: config.rowHeight = row.offsetHeight
        //             })
        //         }

        //         //this ensures rows are kept in view
        //         this.updateStartIndex(props, undefined, config)
        //     }
        // },

    }, {
        key: 'onWindowClick',
        value: function onWindowClick(event) {
            if (this.state.menu) {
                this.setState({
                    menuColumn: null,
                    menu: null
                });
            }
        }
    }, {
        key: 'getInitialState',
        value: function getInitialState() {
            this.scrollLeft = 0;

            var props = this.props;
            var defaultSelected = props.defaultSelected;

            return {
                startIndex: 0,
                menuColumn: null,
                defaultSelected: defaultSelected,
                visibility: {},
                defaultPageSize: props.defaultPageSize,
                defaultPage: props.defaultPage
            };
        }
    }, {
        key: 'hasVerticalScrollbar',
        value: function hasVerticalScrollbar() {
            if (this.refs.wrapper && this.refs.wrapper.refs.table) {
                var tableElement = this.refs.wrapper.refs.table;
                var hasVerticalScrollbar = tableElement.scrollHeight > tableElement.clientHeight;

                var header = this.refs.header;
                var zHeader = header && header.refs.zHeader;

                if (zHeader && hasVerticalScrollbar) {
                    zHeader.classList.add("z-has-vertical-scroller");
                } else if (zHeader) {
                    zHeader.classList.remove("z-has-vertical-scroller");
                }
            }
        }
    }, {
        key: 'toTheTop',
        value: function toTheTop() {
            if (this.refs.wrapper) {
                this.refs.wrapper.toTheTop();
            }
        }
    }, {
        key: 'updateStartIndex',
        value: function updateStartIndex() {
            this.handleScrollTop();
        }
    }, {
        key: 'handleScrollLeft',
        value: function handleScrollLeft(scrollLeft) {
            this.scrollLeft = scrollLeft;

            if (this.refs.header && this.refs.header.refs.zHeader) {
                this.refs.header.scrollLeft(scrollLeft);
            }

            // this.setState({
            //     menuColumn: null
            // })
        }
    }, {
        key: 'getRenderEndIndex',
        value: function getRenderEndIndex(props, state) {
            var startIndex = state.startIndex;
            var rowCount = props.rowCountBuffer;
            var length = props.data.length;

            if (state.groupData) {
                length += state.groupData.groupsCount;
            }

            if (!rowCount) {
                var maxHeight;
                if (props.style && typeof props.style.height === 'number') {
                    maxHeight = props.style.height;
                } else {
                    maxHeight = window.screen.height;
                }
                rowCount = Math.floor(maxHeight / props.rowHeight);
            }

            var endIndex = startIndex + rowCount;

            if (endIndex > length - 1) {
                endIndex = length;
            }

            return length;
        }
    }, {
        key: 'onDropColumn',
        value: function onDropColumn(index, dropIndex) {
            ;(this.props.onColumnOrderChange || emptyFn)(index, dropIndex);
        }
    }, {
        key: 'toggleColumn',
        value: function toggleColumn(props, column) {

            var visible = column.visible;
            var visibility = this.state.visibility;

            if (column.name in visibility) {
                visible = visibility[column.name];
            }

            column = findColumn(this.props.columns, column);

            if (visible && getVisibleCount(props, this.state) === 1) {
                return;
            }

            var onHide = this.props.onColumnHide || emptyFn;
            var onShow = this.props.onColumnShow || emptyFn;

            visible ? onHide(column) : onShow(column);

            var onChange = this.props.onColumnVisibilityChange || emptyFn;

            onChange(column, !visible);

            if (column.visible == null && column.hidden == null) {
                var visibility = this.state.visibility;

                visibility[column.name] = !visible;

                this.cleanCache();
                this.setState({});
            }
        }
    }, {
        key: 'cleanCache',
        value: function cleanCache() {
            //so grouped rows are re-rendered
            delete this.groupedRows;

            //clear row cache
            this.rowCache = {};
        }
    }, {
        key: 'showMenu',
        value: function showMenu(menu, state) {

            state = state || {};
            state.menu = menu;

            if (this.state.menu) {
                this.setState({
                    menu: null,
                    menuColumn: null
                });
            }

            setTimeout(function () {
                //since menu is hidden on click on window,
                //show it in a timeout, after the click event has reached the window
                this.setState(state);
            }.bind(this), 0);
        }
    }, {
        key: 'prepareHeader',
        value: function prepareHeader(props, state) {

            var allColumns = props.columns;
            var columns = getVisibleColumns(props, state);

            return (props.headerFactory || HeaderFactory)({
                ref: 'header',
                scrollLeft: state.scrollLeft,
                resizing: state.resizing,
                columns: columns,
                allColumns: allColumns,
                columnVisibility: state.visibility,
                cellPadding: props.headerPadding || props.cellPadding,
                filterIconColor: props.filterIconColor,
                menuIconColor: props.menuIconColor,
                menuIcon: props.menuIcon,
                sortIcons: props.sortIcons,
                filterIcon: props.filterIcon,
                scrollbarSize: props.scrollbarSize,
                sortInfo: props.sortInfo,
                resizableColumns: props.resizableColumns,
                reorderColumns: props.reorderColumns,
                filterable: props.filterable,
                withColumnMenu: props.withColumnMenu,
                sortable: props.sortable,

                onDropColumn: this.onDropColumn,
                onSortChange: props.onSortChange,
                onMenuClick: props.onMenuClick,
                onColumnResizeDragStart: this.onColumnResizeDragStart,
                onColumnResizeDrag: this.onColumnResizeDrag,
                onColumnResizeDrop: this.onColumnResizeDrop,

                toggleColumn: this.toggleColumn.bind(this, props),
                showMenu: this.showMenu,
                filterMenuFactory: this.filterMenuFactory,
                menuColumn: state.menuColumn,
                columnMenuFactory: props.columnMenuFactory

            });
        }
    }, {
        key: 'prepareFooter',
        value: function prepareFooter(props, state) {
            return (props.footerFactory || _react2.default.DOM.div)({
                className: 'z-footer-wrapper'
            });
        }
    }, {
        key: 'prepareRenderProps',
        value: function prepareRenderProps(props) {

            var result = {};
            var list = {
                className: true,
                style: true
            };

            Object.keys(props).forEach(function (name) {
                // if (list[name] || name.indexOf('data-') == 0 || name.indexOf('on') === 0){
                if (list[name]) {
                    result[name] = props[name];
                }
            });

            return result;
        }
    }, {
        key: 'render',
        value: function render() {

            var props = this.prepareProps(this.props, this.state);

            this.p = props;

            this.data = props.data;
            this.dataSource = props.dataSource;

            var fixedColumns = _lodash2.default.filter(props.columns, { fixed: true });
            var nonFixedColumns = _lodash2.default.filter(props.columns, { fixed: false });
            props.columns = fixedColumns.concat(nonFixedColumns);

            var header = this.prepareHeader(props, this.state);
            var wrapper = this.prepareWrapper(props, this.state);
            var footer = this.prepareFooter(props, this.state);
            var resizeProxy = this.prepareResizeProxy(props, this.state);

            var renderProps = this.prepareRenderProps(props);

            var menuProps = {
                columns: props.columns,
                menu: this.state.menu
            };

            var loadMask;

            if (props.loadMaskOverHeader) {
                loadMask = _react2.default.createElement(_reactLoadMask2.default, { visible: props.loading });
            }

            var paginationToolbar;

            if (props.pagination) {
                var page = props.page;
                var minPage = props.minPage;
                var maxPage = props.maxPage;

                var paginationToolbarFactory = props.paginationFactory || PaginationToolbar;
                var paginationProps = assign({
                    dataSourceCount: props.dataSourceCount,
                    page: page,
                    pageSize: props.pageSize,
                    minPage: minPage,
                    maxPage: maxPage,
                    reload: this.reload,
                    onPageChange: this.gotoPage,
                    onPageSizeChange: this.setPageSize,
                    border: props.style.border
                }, props.paginationToolbarProps);

                paginationToolbar = paginationToolbarFactory(paginationProps);

                if (paginationToolbar === undefined) {
                    paginationToolbar = PaginationToolbar(paginationProps);
                }
            }

            var topToolbar;
            var bottomToolbar;

            if (paginationToolbar) {
                if (paginationToolbar.props.position == 'top') {
                    topToolbar = paginationToolbar;
                } else {
                    bottomToolbar = paginationToolbar;
                }
            }

            if (renderProps.style.height) {
                var HEADER_HEIGHT = 40;
                renderProps.style.height += HEADER_HEIGHT;
            }

            var result = _react2.default.createElement(
                'div',
                renderProps,
                topToolbar,
                _react2.default.createElement(
                    'div',
                    { className: 'z-inner' },
                    header,
                    wrapper,
                    footer,
                    resizeProxy
                ),
                this.props.loadingNode && props.loading && _react2.default.createElement(
                    'div',
                    { className: 'react-load-mask react-load-mask--visible' },
                    this.props.loadingNode
                ),
                !this.props.loadingNode && loadMask,
                renderMenu(menuProps),
                bottomToolbar
            );

            return result;
        }
    }, {
        key: 'getTableProps',
        value: function getTableProps(props, state) {
            var table;
            var rows;

            if (props.groupBy) {
                rows = this.groupedRows = this.groupedRows || getGroupedRows(props, state.groupData);
                rows = slice(rows, props);
            }

            table = _getTableProps.call(this, props, rows);

            return table;
        }
    }, {
        key: 'handleVerticalScrollOverflow',
        value: function handleVerticalScrollOverflow(sign, scrollTop) {

            var props = this.p;
            var page = props.page;

            if (this.isValidPage(page + sign, props)) {
                this.gotoPage(page + sign);
            }
        }
    }, {
        key: 'fixHorizontalScrollbar',
        value: function fixHorizontalScrollbar() {
            var scroller = this.scroller;

            if (scroller) {
                scroller.fixHorizontalScrollbar();
            }
        }
    }, {
        key: 'onWrapperMount',
        value: function onWrapperMount(wrapper, scroller) {
            this.scroller = scroller;
        }
    }, {
        key: 'prepareWrapper',
        value: function prepareWrapper(props, state) {
            var virtualRendering = props.virtualRendering;

            var data = props.data;
            var startIndex = state.startIndex;
            var endIndex = virtualRendering ? this.getRenderEndIndex(props, state) : 0;

            var renderCount = virtualRendering ? endIndex + 1 - startIndex : data.length;

            var totalLength = state.groupData ? data.length + state.groupData.groupsCount : data.length;

            // var topLoader
            // var bottomLoader
            // var loadersSize = 0

            // if (props.virtualPagination){

            //     if (props.page < props.maxPage){
            //         loadersSize += 2 * props.rowHeight
            //         bottomLoader = <div style={{height: 2 * props.rowHeight, position: 'relative', width: props.columnFlexCount? 'calc(100% - ' + props.scrollbarSize + ')': props.minRowWidth - props.scrollbarSize}}>
            //             <LoadMask visible={true} style={{background: 'rgba(128, 128, 128, 0.17)'}}/>
            //         </div>
            //     }

            //     if (props.page > props.minPage){
            //         loadersSize += 2 * props.rowHeight
            //         topLoader = <div style={{height: 2 * props.rowHeight, position: 'relative', width: props.columnFlexCount? 'calc(100% - ' + props.scrollbarSize + ')': props.minRowWidth - props.scrollbarSize}}>
            //             <LoadMask visible={true} style={{background: 'rgba(128, 128, 128, 0.17)'}}/>
            //         </div>
            //     }
            // }

            var wrapperProps = assign({
                ref: 'wrapper',
                onMount: this.onWrapperMount,
                topOffset: state.topOffset,
                startIndex: startIndex,
                totalLength: totalLength,
                renderCount: renderCount,
                endIndex: endIndex,

                allColumns: props.columns,

                onScroll: this.handleScroll,
                // onScrollOverflow: props.virtualPagination? this.handleVerticalScrollOverflow: null,

                menu: state.menu,
                menuColumn: state.menuColumn,
                showMenu: this.showMenu,
                scrollerHeight: props.style.height,

                // cellFactory     : props.cellFactory,
                // rowStyle        : props.rowStyle,
                // rowClassName    : props.rowClassName,
                // rowContextMenu  : props.rowContextMenu,

                // topLoader: topLoader,
                // bottomLoader: bottomLoader,
                // loadersSize: loadersSize,

                // onRowClick: this.handleRowClick,
                selected: props.selected == null ? state.defaultSelected : props.selected
            }, props);

            wrapperProps.columns = getVisibleColumns(props, state);
            wrapperProps.tableProps = this.getTableProps(wrapperProps, state);

            return (props.WrapperFactory || WrapperFactory)(wrapperProps);
        }
    }, {
        key: 'handleScroll',
        value: function handleScroll() {
            if (this.scrollLeft !== this.refs.wrapper.refs.table.scrollLeft) {
                this.handleScrollLeft(this.refs.wrapper.refs.table.scrollLeft);
            }
        }
    }, {
        key: 'handleRowClick',
        value: function handleRowClick(rowProps, event) {
            if (this.props.onRowClick) {
                this.props.onRowClick(rowProps.data, rowProps, event);
            }

            this.handleSelection(rowProps, event);
        }
    }, {
        key: 'prepareProps',
        value: function prepareProps(thisProps, state) {
            var props = assign({}, thisProps);

            props.loading = this.prepareLoading(props);
            props.data = this.prepareData(props);
            props.dataSource = this.prepareDataSource(props);
            props.empty = !props.data.length;

            props.rowHeight = this.prepareRowHeight(props);
            props.virtualRendering = this.isVirtualRendering(props);

            props.filterable = this.prepareFilterable(props);
            props.resizableColumns = this.prepareResizableColumns(props);
            props.reorderColumns = this.prepareReorderColumns(props);

            this.prepareClassName(props);
            props.style = this.prepareStyle(props);

            this.preparePaging(props, state);
            this.prepareColumns(props, state);

            props.minRowWidth = props.totalColumnWidth + props.scrollbarSize;

            return props;
        }
    }, {
        key: 'prepareLoading',
        value: function prepareLoading(props) {
            var showLoadMask = props.showLoadMask || !this.isMounted(); //ismounted check for initial load
            return props.loading == null ? showLoadMask && this.state.defaultLoading : props.loading;
        }
    }, {
        key: 'preparePaging',
        value: function preparePaging(props, state) {
            props.pagination = this.preparePagination(props);

            if (props.pagination) {
                props.pageSize = this.preparePageSize(props);
                props.dataSourceCount = this.prepareDataSourceCount(props);

                props.minPage = 1;
                props.maxPage = Math.ceil((props.dataSourceCount || 1) / props.pageSize);
                props.page = clamp(this.preparePage(props), props.minPage, props.maxPage);
            }
        }
    }, {
        key: 'preparePagination',
        value: function preparePagination(props) {
            return props.pagination === false ? false : !!props.pageSize || !!props.paginationFactory || this.isRemoteDataSource(props);
        }
    }, {
        key: 'prepareDataSourceCount',
        value: function prepareDataSourceCount(props) {
            return props.dataSourceCount == null ? this.state.defaultDataSourceCount : props.dataSourceCount;
        }
    }, {
        key: 'preparePageSize',
        value: function preparePageSize(props) {
            return props.pageSize == null ? this.state.defaultPageSize : props.pageSize;
        }
    }, {
        key: 'preparePage',
        value: function preparePage(props) {
            return props.page == null ? this.state.defaultPage : props.page;
        }
        /**
         * Returns true if in the current configuration,
         * the datagrid should load its data remotely.
         *
         * @param  {Object}  [props] Optional. If not given, this.props will be used
         * @return {Boolean}
         */

    }, {
        key: 'isRemoteDataSource',
        value: function isRemoteDataSource(props) {
            props = props || this.props;

            return props.dataSource && !isArray(props.dataSource);
        }
    }, {
        key: 'prepareDataSource',
        value: function prepareDataSource(props) {
            var dataSource = props.dataSource;

            if (isArray(dataSource)) {
                dataSource = null;
            }

            return dataSource;
        }
    }, {
        key: 'prepareData',
        value: function prepareData(props) {

            var data = null;

            if (isArray(props.data)) {
                data = props.data;
            }

            if (isArray(props.dataSource)) {
                data = props.dataSource;
            }

            data = data == null ? this.state.defaultData : data;

            if (!isArray(data)) {
                data = [];
            }

            return data;
        }
    }, {
        key: 'prepareFilterable',
        value: function prepareFilterable(props) {
            if (props.filterable === false) {
                return false;
            }

            return props.filterable || !!props.onFilter;
        }
    }, {
        key: 'prepareResizableColumns',
        value: function prepareResizableColumns(props) {
            if (props.resizableColumns === false) {
                return false;
            }

            return props.resizableColumns || !!props.onColumnResize;
        }
    }, {
        key: 'prepareReorderColumns',
        value: function prepareReorderColumns(props) {
            if (props.reorderColumns === false) {
                return false;
            }

            return props.reorderColumns || !!props.onColumnOrderChange;
        }
    }, {
        key: 'isVirtualRendering',
        value: function isVirtualRendering(props) {
            props = props || this.props;

            return props.virtualRendering || props.rowHeight != null;
        }
    }, {
        key: 'prepareRowHeight',
        value: function prepareRowHeight() {
            return this.props.rowHeight == null ? this.state.rowHeight : this.props.rowHeight;
        }
    }, {
        key: 'groupData',
        value: function groupData(props) {
            if (props.groupBy) {
                var data = this.prepareData(props);

                this.setState({
                    groupData: group(data, props.groupBy)
                });

                delete this.groupedRows;
            }
        }
    }, {
        key: 'isValidPage',
        value: function isValidPage(page, props) {
            return page >= 1 && page <= this.getMaxPage(props);
        }
    }, {
        key: 'getMaxPage',
        value: function getMaxPage(props) {
            props = props || this.props;

            var count = this.prepareDataSourceCount(props) || 1;
            var pageSize = this.preparePageSize(props);

            return Math.ceil(count / pageSize);
        }
    }, {
        key: 'reload',
        value: function reload() {
            if (this.dataSource) {
                return this.loadDataSource(this.dataSource, this.props);
            }
        }
    }, {
        key: 'clampPage',
        value: function clampPage(page) {
            return clamp(page, 1, this.getMaxPage(this.props));
        }
    }, {
        key: 'setPageSize',
        value: function setPageSize(pageSize) {

            var stateful;
            var newPage = this.preparePage(this.props);
            var newState = {};

            if (typeof this.props.onPageSizeChange == 'function') {
                this.props.onPageSizeChange(pageSize, this.p);
            }

            if (this.props.pageSize == null) {
                stateful = true;
                this.state.defaultPageSize = pageSize;
                newState.defaultPageSize = pageSize;
            }

            if (!this.isValidPage(newPage, this.props)) {

                newPage = this.clampPage(newPage);

                if (typeof this.props.onPageChange == 'function') {
                    this.props.onPageChange(newPage);
                }

                if (this.props.page == null) {
                    stateful = true;
                    this.state.defaultPage = newPage;
                    newState.defaultPage = newPage;
                }
            }

            if (stateful) {
                this.reload();
                this.setState(newState);
            }
        }
    }, {
        key: 'gotoPage',
        value: function gotoPage(page) {
            if (typeof this.props.onPageChange == 'function') {
                this.props.onPageChange(page);
            } else {
                this.state.defaultPage = page;
                var result = this.reload();
                this.setState({
                    defaultPage: page
                });

                return result;
            }
        }

        /**
         * Loads remote data
         *
         * @param  {String/Function/Promise} [dataSource]
         * @param  {Object} [props]
         */

    }, {
        key: 'loadDataSource',
        value: function loadDataSource(dataSource, props) {
            props = props || this.props;

            if (!arguments.length) {
                dataSource = props.dataSource;
            }

            var dataSourceQuery = {};

            if (props.sortInfo) {
                dataSourceQuery.sortInfo = props.sortInfo;
            }

            var pagination = this.preparePagination(props);
            var pageSize;
            var page;

            if (pagination) {
                pageSize = this.preparePageSize(props);
                page = this.preparePage(props);

                assign(dataSourceQuery, {
                    pageSize: pageSize,
                    page: page,
                    skip: (page - 1) * pageSize
                });
            }

            if (typeof dataSource == 'function') {
                dataSource = dataSource(dataSourceQuery, props);
            }

            if (typeof dataSource == 'string') {
                var fetch = this.props.fetch || global.fetch;

                var keys = Object.keys(dataSourceQuery);
                if (props.appendDataSourceQueryParams && keys.length) {
                    //dataSource was initially passed as a string
                    //so we append quey params
                    dataSource += '?' + keys.map(function (param) {
                        return param + '=' + JSON.stringify(dataSourceQuery[param]);
                    }).join('&');
                }

                dataSource = fetch(dataSource);
            }

            if (dataSource && dataSource.then) {

                if (props.onDataSourceResponse) {
                    dataSource.then(props.onDataSourceResponse, props.onDataSourceResponse);
                } else {
                    this.setState({
                        defaultLoading: true
                    });

                    var errorFn = function (err) {
                        if (props.onDataSourceError) {
                            props.onDataSourceError(err);
                        }

                        this.setState({
                            defaultLoading: false
                        });
                    }.bind(this);

                    var noCatchFn = dataSource['catch'] ? null : errorFn;

                    dataSource = dataSource.then(function (response) {
                        return response && typeof response.json == 'function' ? response.json() : response;
                    }).then(function (json) {

                        if (props.onDataSourceSuccess) {
                            props.onDataSourceSuccess(json);
                            this.setState({
                                defaultLoading: false
                            });
                            return;
                        }

                        var info;
                        if (typeof props.getDataSourceInfo == 'function') {
                            info = props.getDataSourceInfo(json);
                        }

                        var data = info ? info.data : Array.isArray(json) ? json : json.data;

                        var count = info ? info.count : json.count != null ? json.count : null;

                        var newState = {
                            defaultData: data,
                            defaultLoading: false
                        };
                        if (props.groupBy) {
                            newState.groupData = group(data, props.groupBy);
                            delete this.groupedRows;
                        }

                        if (count != null) {
                            newState.defaultDataSourceCount = count;
                        }

                        this.setState(newState);
                    }.bind(this), noCatchFn);

                    if (dataSource['catch']) {
                        dataSource['catch'](errorFn);
                    }
                }

                if (props.onDataSourceLoaded) {
                    dataSource.then(props.onDataSourceLoaded);
                }
            }

            return dataSource;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.rowCache = {};
            this.groupData(this.props);

            if (this.isRemoteDataSource(this.props)) {
                this.loadDataSource(this.props.dataSource, this.props);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.rowCache = {};
            this.groupData(nextProps);

            if (this.isRemoteDataSource(nextProps)) {
                var otherPage = this.props.page != nextProps.page;
                var otherPageSize = this.props.pageSize != nextProps.pageSize;

                if (nextProps.reload || otherPage || otherPageSize) {
                    this.loadDataSource(nextProps.dataSource, nextProps);
                }
            }
        }
    }, {
        key: 'prepareStyle',
        value: function prepareStyle(props) {
            var style = {};

            assign(style, props.defaultStyle, props.style);

            return style;
        }
    }, {
        key: 'prepareClassName',
        value: function prepareClassName(props) {
            props.className = props.className || '';
            props.className += ' ' + props.defaultClassName;

            if (props.cellEllipsis) {
                props.className += ' ' + props.cellEllipsisCls;
            }

            if (props.styleAlternateRows) {
                props.className += ' ' + props.styleAlternateRowsCls;
            }

            if (props.showCellBorders) {
                var cellBordersCls = props.showCellBorders === true ? props.showCellBordersCls + '-horizontal ' + props.showCellBordersCls + '-vertical' : props.showCellBordersCls + '-' + props.showCellBorders;

                props.className += ' ' + cellBordersCls;
            }

            if (props.withColumnMenu) {
                props.className += ' ' + props.withColumnMenuCls;
            }

            if (props.empty) {
                props.className += ' ' + props.emptyCls;
            }
        }

        ///////////////////////////////////////
        ///
        /// Code dealing with preparing columns
        ///
        ///////////////////////////////////////

    }, {
        key: 'prepareColumns',
        value: function prepareColumns(props, state) {
            props.columns = props.columns.map(function (col, index) {
                col = Column(col, props);
                col.index = index;
                return col;
            }, this);

            this.prepareColumnSizes(props, state);

            props.columns.forEach(this.prepareColumnStyle.bind(this, props));
        }
    }, {
        key: 'prepareColumnStyle',
        value: function prepareColumnStyle(props, column) {
            var style = column.sizeStyle = {};

            column.style = assign({}, column.style);
            column.textAlign = column.textAlign || column.style.textAlign;

            var minWidth = column.minWidth || props.columnMinWidth;

            style.minWidth = minWidth;

            if (column.flexible) {
                style.flex = column.flex || 1;
            } else {
                style.width = column.width;
                style.minWidth = column.width;
            }
        }
    }, {
        key: 'prepareColumnSizes',
        value: function prepareColumnSizes(props, state) {

            var visibleColumns = getVisibleColumns(props, state);
            var totalWidth = 0;
            var flexCount = 0;

            visibleColumns.forEach(function (column) {
                column.minWidth = column.minWidth || props.columnMinWidth;

                if (!column.flexible) {
                    totalWidth += column.width;
                    return 0;
                } else if (column.minWidth) {
                    totalWidth += column.minWidth;
                }

                flexCount++;
            }, this);

            props.columnFlexCount = flexCount;
            props.totalColumnWidth = totalWidth;
        }
    }, {
        key: 'prepareResizeProxy',
        value: function prepareResizeProxy(props, state) {
            return _react2.default.createElement(ResizeProxy, { ref: 'resizeProxy', active: state.resizing });
        }
    }, {
        key: 'onColumnResizeDragStart',
        value: function onColumnResizeDragStart(config) {

            var domNode = (0, _reactDom.findDOMNode)(this);
            var region = Region.from(domNode);

            this.resizeProxyLeft = config.resizeProxyLeft - region.left;

            this.setState({
                resizing: true,
                resizeOffset: this.resizeProxyLeft
            });
        }
    }, {
        key: 'onColumnResizeDrag',
        value: function onColumnResizeDrag(config) {
            this.refs.resizeProxy.setState({
                offset: this.resizeProxyLeft + config.resizeProxyDiff
            });
        }
    }, {
        key: 'onColumnResizeDrop',
        value: function onColumnResizeDrop(config, resizeInfo) {

            var horizScrollbar = this.refs.wrapper.refs.horizScrollbar;

            if (horizScrollbar && this.scrollLeft) {

                setTimeout(function () {
                    //FF needs this, since it does not trigger scroll event when scrollbar dissapears
                    //so we might end up with grid content not visible (to the left)

                    var domNode = (0, _reactDom.findDOMNode)(horizScrollbar);
                    if (domNode && !domNode.scrollLeft) {
                        this.handleScrollLeft(0);
                    }
                }.bind(this), 1);
            }

            var props = this.props;
            var columns = props.columns;

            var onColumnResize = props.onColumnResize || emptyFn;
            var first = resizeInfo[0];

            var firstCol = findColumn(columns, first.name);
            var firstSize = first.size;

            var second = resizeInfo[1];
            var secondCol = second ? findColumn(columns, second.name) : undefined;
            var secondSize = second ? second.size : undefined;

            //if defaultWidth specified, update it
            if (firstCol.width == null && firstCol.defaultWidth) {
                firstCol.defaultWidth = firstSize;
            }

            if (secondCol && secondCol.width == null && secondCol.defaultWidth) {
                secondCol.defaultWidth = secondSize;
            }

            this.setState(config);

            onColumnResize(firstCol, firstSize, secondCol, secondSize);
        }
    }]);

    return ReactDataGrid;
}(_react2.default.Component);

exports.default = ReactDataGrid;