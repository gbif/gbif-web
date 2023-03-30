import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../dataManagement/api/axios';
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { JazzIcon } from "../../components";
import { MdDelete, MdModeComment, MdOutlineThumbUp, MdThumbDown, MdThumbUp } from "react-icons/md";
import { CommentForm } from './CommentForm';
import { FormattedDate } from 'react-intl';
import WKT from 'ol/format/WKT.js';
import GeoJSON from 'ol/format/GeoJSON.js';

const Card = ({ annotation, onSupport, onContest, onRemoveSupport, onRemoveContest, onDelete, token }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const geoJsonString = getFeature(annotation.geometry);

  const userProfileString = atob(token.split('.')[1]);
  const userProfile = JSON.parse(userProfileString);
  const { userName, exp } = userProfile;
  const isExpired = exp < Date.now() / 1000;

  const fetchComments = useCallback(async () => {
    const response = await (axios.get(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${annotation.id}/comment`)).promise;
    setComments(response.data);
  }, [annotation]);

  useEffect(() => {
    fetchComments(annotation.id);
  }, []);

  const handleSupport = () => {
    onSupport(annotation.id);
  };

  const handleContest = () => {
    onContest(annotation.id);
  };

  const handleRemoveSupport = () => {
    onRemoveSupport(annotation.id);
  };

  const handleRemoveContest = () => {
    onRemoveContest(annotation.id);
  };

  const handleDelete = () => {
    onDelete(annotation.id);
  };

  const handleCommentDelete = async (id) => {
    const response = await axios.delete(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${annotation.id}/comment/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      });
    if (response.status === 200) {
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    }
  };

  const titleMap = {
    'IDENTIFICATION': 'Wrong identification',
    'LOCATION': 'Wrong location',
  }
  const author = annotation.createdBy;
  const title = titleMap[annotation.errorType] || annotation.errorType;
  const hasSupported = annotation.supportedBy && annotation.supportedBy.includes(userName);
  const hasContested = annotation.contestedBy && annotation.contestedBy.includes(userName);
  const hasCommented = comments.find(x => x.createdBy === userName);

  const firstComment = comments.slice(-1)[0];
  const showDescription = firstComment?.createdBy === author;

  return (
    <AnnotationWrapper style={{ margin: 12 }}>
      <CardWrapper>
        <TitleImage>
          <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${encodeURIComponent(geoJsonString)})/auto/400x200?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA&padding=50`} alt="Title image" />
        </TitleImage>
        <ContentWrapper>
          <MediaWrapper>
            <AuthorImage>
              <JazzIcon seed={author} style={{ width: '100%', height: '100%' }} />
              {/* <img src="https://avatars0.githubusercontent.com/u/4245213?v=4" alt={author} style={{width: 40, height: 40, borderRadius: 20}}/> */}
            </AuthorImage>
            <div>
              <CardAuthor>
                <div style={{ color: '#888', fontSize: '13px' }}>
                  <span style={{ marginRight: 12 }}>{author}</span>
                  <FormattedDate value={annotation.created}
                    year="numeric"
                    month="long"
                    day="2-digit" /></div>
                <CardTitle>{title}</CardTitle>
              </CardAuthor>
            </div>
          </MediaWrapper>
          {showDescription && <div style={{ color: 'rgba(0,0,0,.45)' }}>
            <p>{firstComment.comment}</p>
          </div>}
        </ContentWrapper>
        <ActionBar>
          {!isExpired && author === userName && <DeleteAction isActive={false} onClick={handleDelete} />}
          <span style={{ flex: '1 1 100%' }}></span>
          <SupportAction isActive={hasSupported} count={annotation.supportedBy.length} onClick={hasSupported ? handleRemoveSupport : handleSupport} />
          <ContestAction isActive={hasContested} count={annotation.contestedBy.length} onClick={hasContested ? handleRemoveContest : handleContest} />
          <CommentAction isActive={hasCommented} count={comments.length} onClick={() => setShowComments(!showComments)} />
        </ActionBar>
      </CardWrapper>
      {showComments && <CommentWrapper>
        <CommentForm token={token} id={annotation.id} onCreate={fetchComments} />
        {comments.map((comment) => (
          <Comment comment={comment} onDelete={handleCommentDelete} token={token} key={comment.id} userName={userName} isExpired={isExpired}/>
        ))}
      </CommentWrapper>}
    </AnnotationWrapper>
  );
};

function Action({ count, color, isActive, children, ...props }) {
  return <button css={actionButton({ color, isActive })} {...props}>
    {children} {count ? count : null}
  </button>
}

function SupportAction({ isActive, count, ...props }) {
  return <Action isActive={isActive} count={count} color="deepskyblue" {...props}>
    <MdThumbUp />
  </Action>
}

function ContestAction({ isActive, count, ...props }) {
  return <Action isActive={isActive} count={count} color="deepskyblue" {...props}>
    <MdThumbDown />
  </Action>
}

function CommentAction({ isActive, count, ...props }) {
  return <Action isActive={isActive} count={count} color="deepskyblue" {...props}>
    <MdModeComment />
  </Action>
}

function DeleteAction({ isActive, count, ...props }) {
  return <Action isActive={isActive} color="tomato" {...props}>
    <MdDelete />
  </Action>
}

const Comment = ({ comment, onDelete, userName, isExpired }) => {
  return <div css={css`padding: 12px 0; position: relative; border-top: 1px solid #ddd;`}>
    <MediaWrapper>
      <AuthorImage>
        <JazzIcon seed={comment.createdBy} style={{ width: '100%', height: '100%' }} />
      </AuthorImage>
      <div>
        <CardAuthor>
          <div style={{ color: '#888', fontSize: '13px' }}>
            <span style={{ marginRight: 12 }}>{comment.createdBy}</span>
            <FormattedDate value={comment.created}
              year="numeric"
              month="long"
              day="2-digit" /></div>
          <div>{comment.comment}</div>
        </CardAuthor>
      </div>
    </MediaWrapper>
    {!isExpired && comment.createdBy === userName && <button css={css`
      position: absolute;
      top: 0;
      right: 0;
      margin: 12px -12px;
      color: tomato;
      border: none;
      font-size: 16px;
      background: none;
      cursor: pointer;
    `} onClick={() => onDelete(comment.id)}>
      <MdDelete />
    </button>}
  </div>
};

export default Card;

const CommentWrapper = styled.div`
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 16px;
  margin: 0 8px;
  border-top: 1px solid #ddd;
`;

const AnnotationWrapper = styled.div`
`;

const CardWrapper = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const TitleImage = styled.div`
  height: 0;
  padding-bottom: 50%;
  width: 100%;
  position: relative;
  > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  padding: 16px 16px 0 16px;
`;

const CardTitle = styled.h2`
  color: rgba(0,0,0,.88);
  font-weight: 600;
  font-size: 16px;
  margin: 0;  
`;

const MediaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
`;

const AuthorImage = styled.div`
  border-radius: 50%;
  margin-right: 16px;
  width: 40px;
  height: 40px;
`;

const CardAuthor = styled.div`
  font-size: 16px;
  margin: 0;
`;

const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-top: 16px;

  /* z-index: 200;
  position: relative;
  padding: 0 12px; */
  padding: 8px 4px;
`;

const actionButton = ({ color = 'tomato', isActive }) => css`
  margin: 0 2px;
  color: ${color};
  ${isActive ? `color: white;` : ""}
  background-color: white;
  ${isActive ? `background: ${color};` : ""}

  display: flex;
  align-items: center;

  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 8px;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  > svg {
    margin: 0 4px;
  }
`;

const format = new WKT();

function getFeature(wktStr) {
  // https://openlayers.org/en/latest/examples/wkt.html
  // https://openlayers.org/en/latest/examples/geojson.html
  const feature = format.readFeature(wktStr);
  const geoJsonString = new GeoJSON().writeFeature(feature);
  return geoJsonString;
}