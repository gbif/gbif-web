import React, {useEffect, useCallback, useContext, useState} from 'react';
import { useUpdateEffect } from 'react-use';
import SearchContext from '../../../SearchContext';
import {Button, Col, DetailsDrawer, Row, Skeleton, Tag, Tags} from '../../../../components';
import { useQuery } from '../../../../dataManagement/api';
import * as style from "../List/style";
import { FilterContext } from "../../../../widgets/Filter/state";
import { useDialogState } from "reakit/Dialog";
import {useGraphQLContext} from "../../../../dataManagement/api/GraphQLContext";
import {EventSidebar} from "../../../../entities/EventSidebar/EventSidebar";
import Wkt from "wicket";
import {css} from "@emotion/react";
import env from "../../../../../.env.json";
import ThemeContext from "../../../../style/themes/ThemeContext";
import {ResultsHeader} from "../../../ResultsHeader";

export const List = ({query, first, prev, next, size, from, data, total, loading }) => {

    const { filters } = useContext(SearchContext);
    const dialog = useDialogState({ animated: true, modal: false });
    const [activeEventID, setActiveEventID] = useState(null);
    const [activeDatasetKey, setActiveDatasetKey] = useState(null);
    const currentFilterContext = useContext(FilterContext);

    const surveys = data?.results?.facet?.surveyID;

    const {details, setQuery} = useGraphQLContext();

    useEffect(() => {
        setQuery({ query, size, from });
    }, [query, size, from]);

    useEffect(() => {
        activeEventID ? dialog.show() : dialog.hide();
    }, [activeEventID]);

    useUpdateEffect(() => {
        if (!dialog.visible) {
            setActiveEventID(null);
        }
    }, [dialog.visible]);


    function addToSearch (eventID) {
        currentFilterContext.setField('eventHierarchy', [eventID], true);
        setActiveEventID(null);
        setActiveDatasetKey(null);
    }

    function addEventTypeToSearch (eventID, eventType) {
        currentFilterContext.setField('eventHierarchy', [eventID], true);
        currentFilterContext.setField('eventType', [eventType], true);
        setActiveEventID(null);
        setActiveDatasetKey(null);
    }

    const nextItem = useCallback(() => {
        const activeIndex = surveys.findIndex(x => x.key === activeEventID);
        const next = Math.min(surveys.length - 1, activeIndex + 1);
        if (surveys[next]) {
            setActiveEventID(surveys[next].key);
        }
    }, [activeEventID, surveys]);

    const previousItem = useCallback(() => {
        const activeIndex = surveys.findIndex(x => x.key === activeEventID);
        const prev = Math.max(0, activeIndex - 1);
        if (surveys[prev]) {
            setActiveEventID(surveys[prev].key);
        }
    }, [activeEventID, surveys]);

    function setActiveEvent(eventID, datasetKey){
        setActiveEventID(eventID);
        setActiveDatasetKey(datasetKey);
    }

    function closeDialog(){
        setActiveEventID(null);
        setActiveDatasetKey(null);
        dialog.setVisible(false);
    }

    if (!data || loading) return <><DatasetSkeleton /><DatasetSkeleton /><DatasetSkeleton /></>;

    if (!surveys || surveys.length == 0){
        return <>No datasets matching this search</>;
    }

    return <div style={{
        flex: "1 1 100%",
        display: "flex",
        height: "100%",
        maxHeight: "100vh",
        flexDirection: "column",
    }}>
        {dialog.visible && <DetailsDrawer dialog={dialog} nextItem={nextItem} previousItem={previousItem}>

            <EventSidebar
                eventID={activeEventID}
                datasetKey={activeDatasetKey}
                defaultTab='details'
                style={{ maxWidth: '100%', height: '100%' }}
                onCloseRequest={() => closeDialog()}
                setActiveEvent={setActiveEvent}
                addToSearch={addToSearch}
                addEventTypeToSearch={addEventTypeToSearch}
            />

        </DetailsDrawer>}
        <ResultsHeader loading={loading} total={data?.results?.facet?.surveyID?.length} />
        <ul css={style.datasetList}>
            {surveys.map(x => <li  key={x.key}>
                <Survey eventID={x.key} filters={filters} setActiveEvent={setActiveEvent} />
            </li>)}
        </ul>
    </div>
}

const SURVEY_QUERY = `
    query survey($eventDetailsPredicate: Predicate, $eventHierarchyPredicate: Predicate) {
      eventDetails: eventSearch(predicate: $eventDetailsPredicate) {
        documents {
          total
          results {
            eventID
            eventName
            eventType {
              concept
            }
            datasetTitle
            datasetKey
            temporalCoverage {
              gte
              lte
            }
            wktConvexHull
          }
        }                
      }
      eventHierarchy: eventSearch(predicate: $eventHierarchyPredicate) {
        cardinality {
          locationID
          surveyID
        }   
        facet {
          measurementOrFactTypes {
            key
          }
          samplingProtocol {
            key
          }    
        }   
        occurrenceFacet {
          samplingProtocol {
            key
          }
          occurrenceStatus {
            key
          }          
        }        
      }
    }
`;

function DatasetSkeleton() {
    return <div css={style.datasetSkeleton}>
        <Skeleton width="random" style={{ height: '1.5em' }} />
        <Skeleton width="random" />
        <Skeleton width="random" />
        <Skeleton width="random" />
    </div>
}

function Survey({ eventID, setActiveEvent, filters, ...props }) {

    const theme = useContext(ThemeContext);
    const eventDetailsPredicate = { type: "and", predicates: [
            {
                type: "equals",
                key: "eventID",
                value: eventID
            },
            {
                type: "equals",
                key: "eventType",
                value: "Survey"
            }
        ]}
    ;
    const eventHierarchyPredicate = { type: "and", predicates: [
            {
                type: "equals",
                key: "eventHierarchy",
                value: eventID
            }
        ]}
    ;

    const { data, error, loading, load } = useQuery(SURVEY_QUERY, { lazyLoad: true });
    const currentFilterContext = useContext(FilterContext);

    useEffect(() => {
        load({ keepDataWhileLoading: true, variables: {
            eventDetailsPredicate: eventDetailsPredicate,
            eventHierarchyPredicate:eventHierarchyPredicate
        } });
    }, [eventID]);

    if (!data || loading) return <DatasetSkeleton />;

    const event = data?.eventDetails?.documents?.results?.[0];
    const cardinality = data?.eventHierarchy?.cardinality;
    const facet = data?.eventHierarchy?.facet;
    const occurrenceFacet = data?.eventHierarchy?.occurrenceFacet;

    function onClick(){
        setActiveEvent(event.eventID, event.datasetKey);
    }

    const filterByThisSurvey = (event) => {
        currentFilterContext.setField('eventHierarchy', [event.eventID], true);
    }

    function getBbox(gj){
        let coords = getCoordinatesDump(gj);
        let bbox = [ Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,];
        return coords.reduce(function(prev,coord) {
            return [
                Math.min(coord[0], prev[0]),
                Math.min(coord[1], prev[1]),
                Math.max(coord[0], prev[2]),
                Math.max(coord[1], prev[3])
            ];
        }, bbox);
    };

    function getCoordinatesDump(gj) {
        var coords;
        if (gj.type == 'Point') {
            // coords = [gj.coordinates];
            coords = [[0, 0],[0, 90],[90,90],[90, 0], [0,0]]
        } else if (gj.type == 'LineString' || gj.type == 'MultiPoint') {
            coords = gj.coordinates;
        } else if (gj.type == 'Polygon' || gj.type == 'MultiLineString') {
            coords = gj.coordinates.reduce(function(dump,part) {
                return dump.concat(part);
            }, []);
        } else if (gj.type == 'MultiPolygon') {
            coords = gj.coordinates.reduce(function(dump,poly) {
                return dump.concat(poly.reduce(function(points,part) {
                    return points.concat(part);
                },[]));
            },[]);
        } else if (gj.type == 'Feature') {
            coords =  getCoordinatesDump(gj.geometry);
        } else if (gj.type == 'GeometryCollection') {
            coords = gj.geometries.reduce(function(dump,g) {
                return dump.concat(getCoordinatesDump(g));
            },[]);
        } else if (gj.type == 'FeatureCollection') {
            coords = gj.features.reduce(function(dump,f) {
                return dump.concat(getCoordinatesDump(f));
            },[]);
        }
        return coords;
    }

    let geojson = null;
    let extent = null;

    if (event && event.wktConvexHull ) {
        let wicket = new Wkt.Wkt();

        // Read in any kind of WKT string
        wicket.read(event.wktConvexHull);

        // convert to geojson
        geojson = wicket.toJson();
        if (geojson.type != "Point"){
            geojson = {
                "type": "Feature",
                "geometry": geojson,
                "properties":{
                    'fill': theme.primary.replace('#','%23'),
                    'strokeColor': theme.primary.replace('#','%23')
                }
            }
            extent = getBbox(geojson);
        } else {
            geojson = null;
        }
    }

    const hasPresenceData = occurrenceFacet.occurrenceStatus.find(x => x.key == 'PRESENT')
    const hasAbsenceData = occurrenceFacet.occurrenceStatus.find(x => x.key == 'ABSENT')
    const hasOccurrenceData = hasPresenceData || hasAbsenceData;

    return <article>
        <div css={style.summary}>

            <div style={{ display: 'flex', width: '100%'}}>
                <div style={{ flex: '1', flexBasis: '35%'}}>
                    <div css={style.details} style={{ fontSize: "18px", paddingRight: '20px', borderRight: '1px solid #E6E6E6', height: '100%' }}>
                        <Button look="link">
                            <h2 css={css` font-size: 1.4rem;`} onClick={onClick}>{event.eventType?.concept}: {event.eventName} {event.eventID}</h2>
                        </Button>
                        <div>Dataset: <span>{event.datasetTitle}</span></div>
                        <div>Sites: <span>{cardinality.locationID?.toLocaleString()}</span></div>
                        {facet.samplingProtocol && facet.samplingProtocol.length > 0 &&
                            <div>Sampling protocol: <span>{facet.samplingProtocol.map(x => x.key).join(', ')}</span></div>
                        }

                        <Button
                            style={{ marginTop: '20px' }}
                            onClick={() => filterByThisSurvey(event)}
                            look="primaryOutline"
                            css={css` font-size: 14px;`}>Add to filter
                        </Button>
                    </div>
                </div>
                <div  style={{ flex: '1',  flexBasis: '25%'}}>
                    <div css={style.details} style={{ paddingLeft: '20px', fontSize: '16px'}}>
                        {event.temporalCoverage?.gte &&
                            <div>Start date: <span>{event.temporalCoverage?.gte}</span></div>
                        }
                        {event.temporalCoverage?.lte &&
                            <div style={{ marginTop: '10px'}}>End date: <span>{event.temporalCoverage?.lte}</span> </div>
                        }
                        {facet.measurementOrFactTypes && facet.measurementOrFactTypes.length > 0 &&
                            <div style={{
                                marginTop: "20px",
                            }}><div style={{ marginBottom: '10px'}}>Measurements</div>
                                <Tags style={{fontSize: '12px'}}>
                                    {facet.measurementOrFactTypes.map(x => <Tag key={x.key} type="light" outline={true}>{x.key}</Tag>)}
                                </Tags>
                            </div>
                        }
                        {hasOccurrenceData && <div style={{ marginTop: '20px'}}>
                            {hasPresenceData && hasAbsenceData &&
                                <Tag type="light">Species presence and absence data </Tag>
                            }
                            {hasPresenceData && !hasAbsenceData &&
                                <Tag type="light">Species presence data only </Tag>
                            }
                            {!hasPresenceData && hasAbsenceData &&
                                <Tag type="light">Species absence data only </Tag>
                            }
                        </div>
                        }
                    </div>
                </div>
                <div style={{  flex: '1',  flexBasis: '40%' }}>
                    <div style={{ float: 'right' }}>
                        {extent && geojson &&
                            <img
                                src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/geojson(${JSON.stringify(geojson)})/${JSON.stringify(extent)}/350x200?access_token=${env.MAPBOX_KEY}`}/>
                        }
                    </div>
                </div>
            </div>

        </div>
    </article>;
}