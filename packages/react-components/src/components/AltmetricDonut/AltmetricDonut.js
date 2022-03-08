import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../../dataManagement/api/axios';

export function AltmetricDonut({doi, ...props}) {
  const [donut, setDonut] = useState();
  
  useEffect(() => {
    if (typeof doi !== 'string') return;
    const response = axios.get(`https://api.altmetric.com/v1/doi/${doi}`);
    response
      .promise
      .then(response => {
        setDonut(response.data);
      }).catch((err) => {
        if (err.__CANCEL__) {
          //we safely ignore this. It was cancelled
        } else {
          console.error(err);
        }
      });
      return function cleanup() {
        response.cancel();
      };
  }, [doi]);

  if (typeof doi !== 'string') return null;

  if (!doi || !donut) return null;
  return <a href={donut.details_url} {...props}>
    <img src={donut.images.medium} width={50}/>
  </a>
};

AltmetricDonut.propTypes = {
  doi: PropTypes.string
};
