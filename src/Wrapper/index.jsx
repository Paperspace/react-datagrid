'use strict';

var React    = require('react')
var assign   = require('object-assign')

function emptyFn(){}

class Wrapper extends React.Component {

    displayName: 'ReactDataGrid.Wrapper'

    propTypes: {
        scrollLeft   : React.PropTypes.number,
        scrollTop    : React.PropTypes.number,
        scrollbarSize: React.PropTypes.number,
        rowHeight   : React.PropTypes.any,
        renderCount : React.PropTypes.number
    }

    getDefaultProps (){
        return {
            scrollLeft: 0,
            scrollTop : 0
        }
    }

    onMount (scroller){
        ;(this.props.onMount || emptyFn)(this, scroller)
    }
    
    toTheTop () {
      if(this.refs.scroller) {
        this.refs.scroller.toTheTop();
      }
    }

    render () {

        var props     = this.prepareProps(this.props)
        var rowsCount = props.renderCount

        var groupsCount = 0
        if (props.groupData){
            groupsCount = props.groupData.groupsCount
        }

        rowsCount += groupsCount

        // var loadersSize = props.loadersSize
        var verticalScrollerSize = (props.totalLength + groupsCount) * props.rowHeight// + loadersSize

        var content = props.empty?
            <div className="z-empty-text" style={props.emptyTextStyle}>{props.emptyText}</div>:
            <div {...props.tableProps} ref="table"/>


        return content
    }

    onVerticalScrollOverflow () {
    }

    onHorizontalScrollOverflow () {
    }

    onHorizontalScroll (scrollLeft) {
        this.props.onScrollLeft(scrollLeft)
    }

    onVerticalScroll (pos){
        this.props.onScrollTop(pos)
    }

    prepareProps (thisProps){
        var props = {}

        assign(props, thisProps)

        return props
    }
}

export default Wrapper
