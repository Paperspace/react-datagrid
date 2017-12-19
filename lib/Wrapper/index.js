'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var assign = require('object-assign');

function emptyFn() {}

var Wrapper = function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper() {
        _classCallCheck(this, Wrapper);

        return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
    }

    _createClass(Wrapper, [{
        key: 'getDefaultProps',
        value: function getDefaultProps() {
            return {
                scrollLeft: 0,
                scrollTop: 0
            };
        }
    }, {
        key: 'onMount',
        value: function onMount(scroller) {
            ;(this.props.onMount || emptyFn)(this, scroller);
        }
    }, {
        key: 'toTheTop',
        value: function toTheTop() {
            if (this.refs.scroller) {
                this.refs.scroller.toTheTop();
            }
        }
    }, {
        key: 'render',
        value: function render() {

            var props = this.prepareProps(this.props);
            var rowsCount = props.renderCount;

            var groupsCount = 0;
            if (props.groupData) {
                groupsCount = props.groupData.groupsCount;
            }

            rowsCount += groupsCount;

            // var loadersSize = props.loadersSize
            var verticalScrollerSize = (props.totalLength + groupsCount) * props.rowHeight; // + loadersSize

            var content = props.empty ? React.createElement(
                'div',
                { className: 'z-empty-text', style: props.emptyTextStyle },
                props.emptyText
            ) : React.createElement('div', _extends({}, props.tableProps, { ref: 'table' }));

            return content;
        }
    }, {
        key: 'onVerticalScrollOverflow',
        value: function onVerticalScrollOverflow() {}
    }, {
        key: 'onHorizontalScrollOverflow',
        value: function onHorizontalScrollOverflow() {}
    }, {
        key: 'onHorizontalScroll',
        value: function onHorizontalScroll(scrollLeft) {
            this.props.onScrollLeft(scrollLeft);
        }
    }, {
        key: 'onVerticalScroll',
        value: function onVerticalScroll(pos) {
            this.props.onScrollTop(pos);
        }
    }, {
        key: 'prepareProps',
        value: function prepareProps(thisProps) {
            var props = {};

            assign(props, thisProps);

            return props;
        }
    }]);

    return Wrapper;
}(React.Component);

exports.default = Wrapper;