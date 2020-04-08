/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
    constructor (props) {
        super(props);

        this.portalEl = document.createElement('div');
    }

    componentDidMount () {
        document.body.appendChild(this.portalEl);
    }

    componentWillUnmount () {
        document.body.removeChild(this.portalEl);
    }

    render () {
        return ReactDOM.createPortal(this.props.children, this.portalEl);
    }
}

export default Portal;