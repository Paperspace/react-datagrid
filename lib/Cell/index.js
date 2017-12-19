'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var assign = require('object-assign');
var normalize = require('react-style-normalizer');

var TEXT_ALIGN_2_JUSTIFY = {
    right: 'right',
    center: 'center'
};

function copyProps(target, source, list) {

    list.forEach(function (name) {
        if (name in source) {
            target[name] = source[name];
        }
    });
}

var Cell = function (_React$Component) {
    _inherits(Cell, _React$Component);

    function Cell() {
        _classCallCheck(this, Cell);

        return _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).apply(this, arguments));
    }

    _createClass(Cell, [{
        key: 'getDefaultProps',
        value: function getDefaultProps() {
            return {
                text: '',

                firstClassName: 'z-first',
                lastClassName: 'z-last',

                defaultStyle: {}
            };
        }
    }, {
        key: 'prepareClassName',
        value: function prepareClassName(props) {
            var index = props.index;
            var columns = props.columns;
            var column = props.column;

            var textAlign = column && column.textAlign;
            var cellClassName = column && column.cellClassName;

            var className = props.className || '';

            className += ' ' + Cell.className;

            if (columns) {
                if (!index && props.firstClassName) {
                    className += ' ' + props.firstClassName;
                }

                if (index == columns.length - 1 && props.lastClassName) {
                    className += ' ' + props.lastClassName;
                }
            }

            if (textAlign) {
                className += ' z-align-' + textAlign;
            }

            if (cellClassName) {
                className += ' ' + cellClassName;
            }

            return className;
        }
    }, {
        key: 'prepareStyle',
        value: function prepareStyle(props) {
            var column = props.column;
            var sizeStyle = column && column.sizeStyle;

            var alignStyle;
            var textAlign = column && column.textAlign || (props.style || {}).textAlign;

            if (textAlign) {
                alignStyle = { textAlign: TEXT_ALIGN_2_JUSTIFY[textAlign] };
            }

            var style = assign({}, props.defaultStyle, sizeStyle, alignStyle, props.style);

            return normalize(style);
        }
    }, {
        key: 'prepareProps',
        value: function prepareProps(thisProps) {

            var props = assign({}, thisProps);

            if (!props.column && props.columns) {
                props.column = props.columns[props.index];
            }

            props.className = this.prepareClassName(props);
            props.style = this.prepareStyle(props);

            return props;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.p = this.prepareProps(this.props);

            var column = props.column;
            var textAlign = column && column.textAlign;
            var text = props.renderText ? props.renderText(props.text, column, props.rowIndex) : props.text;

            var contentProps = {
                className: 'z-content',
                style: {
                    padding: props.contentPadding
                },
                title: column.alt || props.title,
                onMouseUp: props.contentProps ? props.contentProps.onMouseUp : null,
                onMouseDown: props.contentProps ? props.contentProps.onMouseDown : null
            };

            delete props.contentProps;

            var content = props.renderCell ? props.renderCell(contentProps, text, props) : React.DOM.div(contentProps, text);

            var renderProps = assign({}, props);

            delete renderProps.data;

            return React.createElement(
                'div',
                { className: renderProps.className,
                    name: renderProps.name,
                    style: renderProps.style },
                content,
                props.children
            );
        }
    }]);

    return Cell;
}(React.Component);

Cell.propTypes = {
    className: PropTypes.string,
    firstClassName: PropTypes.string,
    lastClassName: PropTypes.string,

    contentPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    column: PropTypes.object,
    columns: PropTypes.array,
    index: PropTypes.number,

    style: PropTypes.object,
    text: PropTypes.any,
    rowIndex: PropTypes.number
};

Cell.className = 'z-cell';

exports.default = Cell;