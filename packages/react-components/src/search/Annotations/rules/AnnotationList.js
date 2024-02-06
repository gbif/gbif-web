import React, { useContext } from 'react';
import axios from '../../../dataManagement/api/axios';
import { css } from '@emotion/react';
import Card from './Card';
import UserContext from '../../../dataManagement/UserProvider/UserContext';
import env from '../../../../.env.json';

export const AnnotationList = ({ token, annotations, setAnnotations, activeAnnotations, ...props }) => {
  const { user, signHeaders, broadcastLoginEvent } = useContext(UserContext);
  const handleSupport = async (id) => {
    const response = await (axios.post(`${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${id}/support`,
      null,
      {
        headers: signHeaders(),
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleContest = async (id) => {
    const response = await (axios.post(`${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${id}/contest`,
      null,
      {
        headers: signHeaders(),
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleRemoveSupport = async (id) => {
    const response = await (axios.post(`${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${id}/removeSupport`,
      null,
      {
        headers: signHeaders(),
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleRemoveContest = async (id) => {
    const response = await (axios.post(`${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${id}/removeContest`,
      null,
      {
        headers: signHeaders(),
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(`${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${id}`,
      {
        headers: signHeaders(),
      });
    if (response.status === 200) {
      setAnnotations((prevAnnotations) => prevAnnotations.filter((annotation) => annotation.id !== id));
    }
  };

  return (
    <div css={listStyle}>
      {annotations
        .filter(annotation => {
          if (activeAnnotations) {
            return activeAnnotations.includes(annotation.id);
          } else {
            return true;
          }
        })
        .map((annotation) => (
          <Card
            key={annotation.id}
            annotation={annotation}
            onSupport={handleSupport}
            onContest={handleContest}
            onRemoveSupport={handleRemoveSupport}
            onRemoveContest={handleRemoveContest}
            onDelete={handleDelete}
            {...{user, signHeaders, broadcastLoginEvent}}
          />
        ))}
    </div>
  );
};

const listStyle = css`
  margin: 0 auto;
  max-width: 600px;
`;
