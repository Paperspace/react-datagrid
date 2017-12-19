'use strict';

var React  = require('react')
var assign = require('object-assign')

class ResizeProxy extends React.Component {

    displayName: 'ReactDataGrid.ResizeProxy'

    propTypes: {
        active: React.PropTypes.bool
    }

    getInitialState (){
        return {
            offset: 0
        }
    }

    render (){

        var props = assign({}, this.props)
        var state = this.state

        var style  = {}
        var active = props.active

        if (active){
            style.display = 'block'
            style.left    = state.offset
        }

        return <div className='z-resize-proxy' style={style} />
    }
}

export default ResizeProxy
