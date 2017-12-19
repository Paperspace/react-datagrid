'use strict';

var React  = require('react')
var PropTypes = require('prop-types')
var assign = require('object-assign')
var normalize = require('react-style-normalizer')

var TEXT_ALIGN_2_JUSTIFY = {
    right : 'right',
    center: 'center'
}

function copyProps(target, source, list){

    list.forEach(function(name){
        if (name in source){
            target[name] = source[name]
        }
    })

}

class Cell extends React.Component {

    displayName: 'ReactDataGrid.Cell'

    getDefaultProps (){
        return {
            text: '',

            firstClassName: 'z-first',
            lastClassName : 'z-last',

            defaultStyle: {}
        }
    }

    prepareClassName (props) {
        var index     = props.index
        var columns   = props.columns
        var column    = props.column

        var textAlign = column && column.textAlign
        var cellClassName = column && column.cellClassName;

        var className = props.className || ''

        className += ' ' + Cell.className

        if (columns){
            if (!index && props.firstClassName){
                className += ' ' + props.firstClassName
            }

            if (index == columns.length - 1 && props.lastClassName){
                className += ' ' + props.lastClassName
            }
        }

        if (textAlign){
            className += ' z-align-' + textAlign
        }
        
        if(cellClassName) {
          className += ' ' + cellClassName;
        }

        return className
    }

    prepareStyle (props) {
        var column    = props.column
        var sizeStyle = column && column.sizeStyle

        var alignStyle
        var textAlign = (column && column.textAlign) || (props.style || {}).textAlign

        if (textAlign){
            alignStyle = { textAlign: TEXT_ALIGN_2_JUSTIFY[textAlign] }
        }

        var style = assign({}, props.defaultStyle, sizeStyle, alignStyle, props.style)

        return normalize(style)
    }

    prepareProps (thisProps){

        var props = assign({}, thisProps)

        if (!props.column && props.columns){
            props.column  = props.columns[props.index]
        }

        props.className = this.prepareClassName(props)
        props.style     = this.prepareStyle(props)

        return props
    }

    render (){
        var props = this.p = this.prepareProps(this.props)

        var column    = props.column
        var textAlign = column && column.textAlign
        var text      = props.renderText?
            props.renderText(props.text, column, props.rowIndex):
            props.text

        var contentProps = {
            className: 'z-content',
            style    : {
              padding: props.contentPadding
            },
            title: column.alt || props.title,
            onMouseUp: props.contentProps ? props.contentProps.onMouseUp : null,
            onMouseDown: props.contentProps ? props.contentProps.onMouseDown : null
        }
        
        delete props.contentProps
        
        var content = props.renderCell?
                            props.renderCell(contentProps, text, props):
                            React.DOM.div(contentProps, text)

        var renderProps = assign({}, props)

        delete renderProps.data




        return (
            <div className={renderProps.className}
              name={renderProps.name} 
              style={renderProps.style}>
                {content}
                {props.children}
            </div>
        )
    }
}

Cell.propTypes = {
    className     : PropTypes.string,
    firstClassName: PropTypes.string,
    lastClassName : PropTypes.string,

    contentPadding: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),

    column : PropTypes.object,
    columns: PropTypes.array,
    index  : PropTypes.number,

    style      : PropTypes.object,
    text       : PropTypes.any,
    rowIndex   : PropTypes.number
}

Cell.className = 'z-cell'

export default Cell
