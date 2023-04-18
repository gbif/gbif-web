import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA";

const MapContainer = () => {
  const [observations, setObservations] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [radius, setRadius] = useState(10);
  const [map, setMap] = useState();
  const [position, setPosition] = useState();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude })

          const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: 10,
          });

          map.on("load", () => {
            map.resize();
            map.addLayer({
              id: "observations",
              type: "circle",
              source: {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [],
                },
              },
              paint: {
                "circle-radius": 5,
                "circle-color": "#007cbf",
                "circle-opacity": 0.7,
              },
            });
            setMap(map);
          });

          const fetchObservations = async () => {
            const response = await fetch(
              `https://api.gbif.org/v1/occurrence/search?hasCoordinate=true&geoDistance=${latitude},${longitude},${radius}km&year=${new Date().getFullYear() - 5}`
            );
            const data = await response.json();

            setObservations(data.results);
          };

          fetchObservations();
        },
        (error) => console.error(error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [radius]);

  useEffect(() => {
    if (map) {
      const fetchVectorTiles = async () => {
        const { latitude, longitude } = position;
        const tileUrl = `https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&geoDistance=${latitude},${longitude},${radius}km&year=${new Date().getFullYear() - 5}`;

        const sourceOptions = {
          type: "vector",
          tiles: [tileUrl],
          minzoom: 0,
          maxzoom: 14,
          attribution:
            '<a href="https://www.gbif.org/" target="_blank">© GBIF</a>',
        };

        if (map.getSource("occurrences")) {
          map.removeLayer("occurrences");
          map.removeSource("occurrences");
        }

        map.addSource("occurrences", sourceOptions);

        map.addLayer({
          id: "occurrences",
          type: "circle",
          source: "occurrences",
          "source-layer": "occurrence",
          paint: {
            "circle-color": "#ff4d4d",
            "circle-radius": 5,
          },
        });
      };

      fetchVectorTiles();
    }
  }, [map, position, radius]);

  useEffect(() => {
    const species = {};
    if (!position || !observations) return;
    const { latitude, longitude } = position;
    observations.forEach((observation) => {
      if (!species[observation.taxonKey]) {
        species[observation.taxonKey] = {
          taxonKey: observation.taxonKey,
          scientificName: observation.scientificName,
          latitude: observation.decimalLatitude,
          longitude: observation.decimalLongitude,
        };
      } else {
        const distance1 = distanceFromCentroid(
          latitude,
          longitude,
          species[observation.taxonKey].latitude,
          species[observation.taxonKey].longitude
        );

        const distance2 = distanceFromCentroid(
          latitude,
          longitude,
          observation.decimalLatitude,
          observation.decimalLongitude
        );

        if (distance2 < distance1) {
          species[observation.taxonKey].latitude = observation.decimalLatitude;
          species[observation.taxonKey].longitude = observation.decimalLongitude;
        }
      }
    });

    const speciesArr = Object.keys(species).map((key) => species[key]);

    setSpeciesList(speciesArr);
  }, [observations, position]);

  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
  };

  if (!position) return <h2>loading</h2>;
  const { latitude, longitude } = position;
  return (
    <div css={containerStyles}>
      <div css={mapStyles} id="map" />
      <div css={listStyles}>
        <h2>Species List</h2>
        <div>
          <label htmlFor="radius">Radius (km):</label>
          <input
            type="range"
            id="radius"

            min="1"
            max="50"
            step="1"
            value={radius}
            onChange={handleRadiusChange}
          />
          <span>{radius} km</span>
        </div>
        {/* <ul>
          {speciesList.map((species) => (
            <li key={species.taxonKey}>
              {species.scientificName} - {distanceFromCentroid(latitude, longitude, species.latitude, species.longitude).toFixed(2)} km
            </li>
          ))}
        </ul> */}
        <div>
        <SpeciesList species={speciesList} handleClick={console.log} latitude={latitude} longitude={longitude} />
  </div>
      </div>
    </div>
  );
};

const SpeciesList = ({ species, handleClick, latitude, longitude }) => {
  return (
    <div css={{ display: 'flex', flexWrap: 'wrap' }}>
      {species.map((item) => (
        <div css={cardStyles} key={item.taxonKey}>
          <TaxonImage taxonKey={item.taxonKey} />
          <h2>{item.scientificName}</h2>
          <p>Distance from centroid: {distanceFromCentroid(latitude, longitude, item.latitude, item.longitude).toFixed(2)} km</p>
          <button onClick={() => handleClick(item.id)}>Learn More</button>
        </div>
      ))}
    </div>
  );
};

const distanceFromCentroid = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c / 1000;
};

const containerStyles = css`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const mapStyles = css`
  flex-grow: 1;
  width: 100%;
  height: 100%;
`;

const listStyles = css`
  background-color: #fff;
  padding: 1rem;
  width: 30%;
  height: 100%;
  overflow: auto;
`;

const cardStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  img {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    text-align: center;
  }

  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #0077cc;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #0062a3;
    }
  }
`;

function TaxonImage({ taxonKey }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(`https://api.gbif.org/v1/occurrence/search?taxonKey=${taxonKey}&mediaType=StillImage&limit=1`);
        const data = await response.json();
        const image = data.results[0]?.media[0]?.identifier;
        setImageUrl(image);
      } catch (error) {
        console.error(error);
      }
    }

    fetchImage();
  }, [taxonKey]);

  return imageUrl ? <img src={imageUrl} alt={`Image of taxon with key ${taxonKey}`} /> : null;
}

export default MapContainer;
