import React, { Component } from "react";
import withContext from "../../filters/state/withFilter";
import { query } from '../../../OccurrenceSearch/api/queryAdapter';
import { TablePresentation } from './TablePresentation';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
			loading: true, 
			error: false, 
			size: 20,
			from: 0,
			data: {hits: {hits: []}},
		};
  }

  loadData = () => {
		this.setState({ loading: true, error: false });
		if (this.runningQuery && this.runningQuery.cancel) this.runningQuery.cancel();
		
    this.runningQuery = query(this.props.filter, this.state.size, this.state.from);
		this.runningQuery.then(response => {
        if (this._isMount) {
					this.setState({ loading: false, error: false, data: response.data });
				}
      })
      .catch(err => {
				console.error(err);//TODO error handling
				if (this._isMount) {
					this.setState({ loading: false, error: true });
				}
			});
  };

  componentDidMount() {
    this._isMount = true;
    this.loadData();
	}

	componentWillUnmount() {
		this._isMount = false;
	}

	componentDidUpdate(prevProps) {
    if (prevProps.filterHash !== this.props.filterHash) {
			this.setState({from: 0}, this.loadData);
    }
  }
	
	next = () => {
		this.setState({from: Math.max(0, this.state.from + this.state.size)}, this.loadData);
	}

	prev = () => {
		this.setState({from: Math.max(0, this.state.from - this.state.size)}, this.loadData);
	}

	first = () => {
		this.setState({from: 0}, this.loadData);
	}

  render() {
		return <TablePresentation loading={this.state.loading} result={this.state.data} next={this.next} prev={this.prev} first={this.first} size={this.state.size} from={this.state.from} />
  }
}

const mapContextToProps = ({ filter, filterHash, api, components }) => ({ filter, filterHash, api, components });
export default withContext(mapContextToProps)(Table);
