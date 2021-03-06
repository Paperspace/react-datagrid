'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var Region = require('region');
var assign = require('object-assign');
var normalize = require('react-style-normalizer');
var Cell = require('../Cell');
var CellFactory = React.createFactory(Cell);
var ReactMenu = require('react-menus');
var ReactMenuFactory = React.createFactory(ReactMenu);

var Row = function (_React$Component) {
  _inherits(Row, _React$Component);

  function Row() {
    _classCallCheck(this, Row);

    return _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).apply(this, arguments));
  }

  _createClass(Row, [{
    key: 'getDefaultProps',
    value: function getDefaultProps() {

      return {
        defaultStyle: {}
      };
    }
  }, {
    key: 'getInitialState',
    value: function getInitialState() {
      return {
        mouseOver: false
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.prepareProps(this.props);
      var cells = props.children || props.columns.map(this.renderCell.bind(this, this.props));

      return React.createElement(
        'div',
        { className: props.className,
          style: props.style,
          onClick: props.onClick,
          onContextMenu: props.onContextMenu,
          onMouseEnter: props.onMouseEnter,
          onMouseLeave: props.onMouseLeave },
        cells
      );
    }
  }, {
    key: 'prepareProps',
    value: function prepareProps(thisProps) {
      var props = assign({}, thisProps);

      props.className = this.prepareClassName(props, this.state);
      props.style = this.prepareStyle(props);

      props.onMouseEnter = this.handleMouseEnter;
      props.onMouseLeave = this.handleMouseLeave;
      props.onContextMenu = this.handleContextMenu;
      props.onClick = this.handleRowClick;

      delete props.data;
      delete props.cellPadding;

      return props;
    }
  }, {
    key: 'handleRowClick',
    value: function handleRowClick(event) {
      if (!this.props.data.selectable) {
        return;
      }

      if (this.props.onClick) {
        this.props.onClick(event);
      }

      if (this.props._onClick) {
        this.props._onClick(this.props, event);
      }
    }
  }, {
    key: 'handleContextMenu',
    value: function handleContextMenu(event) {

      if (this.props.rowContextMenu) {
        this.showMenu(event);
      }

      if (this.props.onContextMenu) {
        this.props.onContextMenu(event);
      }
    }
  }, {
    key: 'showMenu',
    value: function showMenu(event) {
      var factory = this.props.rowContextMenu;
      var alignTo = Region.from(event);

      var props = {
        style: {
          position: 'absolute'
        },
        rowProps: this.props,
        data: this.props.data,
        alignTo: alignTo,
        alignPositions: ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
        items: [{
          label: 'stop'
        }]
      };

      var menu = factory(props);

      if (menu === undefined) {
        menu = ReactMenuFactory(props);
      }

      event.preventDefault();

      this.props.showMenu(function () {
        return menu;
      });
    }
  }, {
    key: 'handleMouseLeave',
    value: function handleMouseLeave(event) {
      this.setState({
        mouseOver: false
      });

      if (this.props.onMouseLeave) {
        this.props.onMouseLeave(event);
      }
    }
  }, {
    key: 'handleMouseEnter',
    value: function handleMouseEnter(event) {
      this.setState({
        mouseOver: true
      });

      if (this.props.onMouseEnter) {
        this.props.onMouseEnter(event);
      }
    }
  }, {
    key: 'renderCell',
    value: function renderCell(props, column, index) {

      var text = props.data[column.name];
      var columns = props.columns;

      var cellProps = {
        style: column.style,
        className: column.className,

        key: column.name,
        name: column.name,

        data: props.data,
        columns: columns,
        index: index,
        rowIndex: props.index,
        textPadding: props.cellPadding,
        renderCell: props.renderCell,
        renderText: props.renderText
      };

      if (typeof column.render == 'function') {
        text = column.render(text, props.data, cellProps);
      }

      cellProps.text = text;

      var result;

      if (props.cellFactory) {
        result = props.cellFactory(cellProps);
      }

      if (result === undefined) {
        result = CellFactory(cellProps);
      }

      return result;
    }
  }, {
    key: 'prepareClassName',
    value: function prepareClassName(props, state) {
      var className = props.className || '';

      className += ' z-row ';

      if (props.index % 2 === 0) {
        className += ' z-even ' + (props.evenClassName || '');
      } else {
        className += ' z-odd ' + (props.oddClassName || '');
      }

      if (state.mouseOver) {
        className += ' z-over ' + (props.overClassName || '');
      }

      if (props.selected) {
        className += ' z-selected ' + (props.selectedClassName || '');
      }

      if (!props.data.selectable) {
        className += ' z-not-selectable';
      }

      return className;
    }
  }, {
    key: 'prepareStyle',
    value: function prepareStyle(props) {

      var style = assign({}, props.defaultStyle, props.style);

      style.minHeight = props.rowHeight;
      style.minWidth = props.minWidth;

      return style;
    }
  }]);

  return Row;
}(React.Component);

exports.default = Wrapper;