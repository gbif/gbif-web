import React, { Component } from "react";
import { GalleryPresentation } from './GalleryPresentation';
import merge from 'lodash/merge';

const OCCURRENCE_TABLE = `
query table($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      size
      from
      results {
        gbifId
        gbifClassification{
          usage {
            rank
            formattedName
          }
        }
        year
				basisOfRecord
        datasetTitle
        publisherTitle
        countryCode
      }
    }
  }
}
`;

class Gallery extends Component {
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
		
		let filter = merge({}, this.props.filter, {
      must: {
				gallery_media_type: ["StillImage"],
				// occurrenceId: ["http://bins.boldsystems.org/index.php/Public_RecordView?processid=EPRBE064-18"],
			}
		});
		
    this.runningQuery = query(filter, this.state.size, this.state.from);
		this.runningQuery.then(response => {
        if (this._isMount) {
					// extract first image in occurrence
					response.data.hits.hits.forEach(occ => {
						occ._galleryImages = occ.multimediaItems.filter(img => img.type === 'StillImage');
					});
					if (this.state.from > 0) {
						response.data.hits.hits = [...this.state.data.hits.hits, ...response.data.hits.hits];
						this.setState({ loading: false, error: false, data: response.data });
					} else {
						this.setState({ loading: false, error: false, data: response.data });
					}
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
			this.setState({from: 0, data: {}}, this.loadData);
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
		return <GalleryPresentation error={this.state.error} loading={this.state.loading} result={this.state.data} next={this.next} prev={this.prev} first={this.first} size={this.state.size} from={this.state.from} />
  }
}

const mapContextToProps = ({ filter, filterHash, api, components }) => ({ filter, filterHash, api, components });
export default withFilter(mapContextToProps)(Gallery);
