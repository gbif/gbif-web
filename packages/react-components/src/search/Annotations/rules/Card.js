import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from '../../../dataManagement/api/axios';
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, JazzIcon } from "../../../components";
import { MdDelete, MdModeComment, MdThumbDown, MdThumbUp } from "react-icons/md";
import { CommentForm } from './CommentForm';
import { FormattedDate } from 'react-intl';
import SearchContext from '../../../search/SearchContext';
import MapWithGeoJSON from './MapWithGeoJSON';
import getFeature from './getFeature';
import { FilterContext } from '../../../widgets/Filter/state';

const MAPBOX_GEOJSON_SIZE_LIMIT = 1;
const Card = ({ annotation, onSupport, onContest, onRemoveSupport, onRemoveContest, onDelete, token }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const { labelMap } = useContext(SearchContext);
  const currentFilterContext = useContext(FilterContext);

  const { geojson: geoJsonString, error: wktError } = getFeature(annotation.geometry);

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
    'NATIVE': 'Native',
    'INTRODUCED': 'Introduced',
    'MANAGED': 'Managed',
    'FORMER': 'Former',
    'VAGRANT': 'Vagrant',
    'CAPTIVITY': 'Captivity',
    'SUSPICIOUS': 'Suspicious',
    'OTHER': 'Other',
  }
  const author = annotation.createdBy;
  const title = titleMap[annotation.annotation] || 'Unknown type';
  const hasSupported = annotation.supportedBy && annotation.supportedBy.includes(userName);
  const hasContested = annotation.contestedBy && annotation.contestedBy.includes(userName);
  const hasCommented = comments.find(x => x.createdBy === userName);

  const firstComment = comments.slice(-1)[0];
  const showDescription = firstComment?.createdBy === author;
  
  const TaxonLabel = labelMap.taxonKey;
  return (
    <AnnotationWrapper style={{ margin: 12 }}>
      <CardWrapper>
        {geoJsonString?.length < MAPBOX_GEOJSON_SIZE_LIMIT && <TitleImage>
          <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${encodeURIComponent(geoJsonString)})/auto/400x200?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA&padding=50`} alt="Title image" />
        </TitleImage>}
        {geoJsonString?.length >= MAPBOX_GEOJSON_SIZE_LIMIT && <TitleImage>
          <MapWithGeoJSON type={annotation.annotation} geojson={JSON.parse(geoJsonString)} style={{width: '100%', height: '100%'}}/>
        </TitleImage>}
        {wktError && <TitleImage css={css`background: linear-gradient(to right top, #ea3365, #ee3054, #ef3142, #ee362d, #eb3e12); text-align: center;`}>
          <span css={css`background: #00000011; display: inline-block; border-radius: 4px; padding: 5px 8px; color: #880000; border: 1px solid #88000088; margin-top: 65px;`}>Invalid geometry</span>
        </TitleImage>}
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
          <div style={{ color: 'rgba(0,0,0,.65)' }}>
            {typeof annotation.taxonKey !== 'undefined' && <p>Taxon: <Button look="text" onClick={e => currentFilterContext.setField('taxonKey', [annotation.taxonKey])}><TaxonLabel id={annotation.taxonKey} /></Button></p>}
            {showDescription && <p css={css`white-space: pre;`}>{firstComment.comment}</p>}
          </div>
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
        {!isExpired && <CommentForm token={token} id={annotation.id} onCreate={fetchComments} />}
        {comments.map((comment) => (
          <Comment comment={comment} onDelete={handleCommentDelete} token={token} key={comment.id} userName={userName} isExpired={isExpired} />
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
          <div css={css`white-space: pre;`}>{comment.comment}</div>
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
  > img, > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
