import { css } from '@emotion/react';
import React from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { ResourceLink } from '../../../components';

export function ExternalLink({ type, id, label, icon: Icon }) {
  return (
    <ResourceLink type={type} id={id} target='_blank'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {Icon && <Icon />}
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: 12,
              fontWeight: 500,
              marginLeft: 8,
            }}
          >
            {label || 'No Label'}
          </span>
        </div>
        <HiOutlineExternalLink />
      </div>
    </ResourceLink>
  );
}
