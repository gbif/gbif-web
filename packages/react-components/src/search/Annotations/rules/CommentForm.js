import React, { useState } from 'react';
import { css } from '@emotion/react';
import axios from 'axios';
import { MdSend } from 'react-icons/md';
import env from '../../../../.env.json';
import { Button } from '../../../components';

export const CommentForm = ({ id, signHeaders, onCreate }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${env.ANNOTATION_API}/occurrence/experimental/annotation/rule/${id}/comment`,
        {
          comment: commentText,
        },
        {
          headers: signHeaders()
        }
      );
      setCommentText('');
      onCreate(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      css={css`
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        border: 1px solid #ccc;
      `}
    >
      <label
        htmlFor="comment-text"
        css={css`
          display: none;
        `}
      >
        Leave a comment:
      </label>
      <textarea
        placeholder="Leave a comment"
        id="comment-text"
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        css={css`
          resize: none;
          height: 80px;
          border: none;
        `}
      />
      <div style={{textAlign: 'right'}}>
        <button type="submit" css={css`
          top: 0;
          right: 0;
          color: deepskyblue;
          border: none;
          font-size: 16px;
          background: none;
          cursor: pointer;
          margin: 0;
          padding: 0;
        `}>
          <MdSend />
        </button>
      </div>
    </form>
  );
};

export default Comment

export function CommentFormWrapper({ id, signHeaders, onCreate, defaultShow = false }) {
  const [show, setShow] = useState(defaultShow);
  
  if (!show) {
    return <div style={{textAlign: 'end', marginBottom: 8}}>
      <Button look="primaryOutline" style={{fontSize: '12px'}} onClick={() => setShow(true)}>Leave a comment</Button>
    </div>
  }
  return <CommentForm id={id} signHeaders={signHeaders} onCreate={onCreate} />
}