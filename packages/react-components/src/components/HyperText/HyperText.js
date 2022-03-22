import React from 'react';
import { jsx } from '@emotion/react';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import doiRegex from 'doi-regex';
import { Doi } from '../IdentifierBadge';
import Orcid from '../Orcid/Orcid';
import Lsid from '../Lsid/Lsid';
import BooleanValue from '../BooleanValue/BooleanValue'
import {content} from './styles'

const autolinker = new Autolinker(
    {
    truncate: { length: 64, location: 'middle' }, 
    stripPrefix: false,
    email: false, 
    phone: false
});

const getLsid = (text) => {
    if(typeof text !== "string" || /\s/.test(text.trim())){
        return null
    } else {
        const trimmed = text.trim();
        if (trimmed.startsWith('urn:lsid:')) {
            return trimmed; 
        } else {
            return null
        }
    } 
}

const getOrcid = (text) => {
    if(typeof text !== "string" || /\s/.test(text.trim())){
        return null
    } else {
        const trimmed = text.trim();
        if (trimmed.startsWith('orcid.org/') ) {
            return 'https://' + trimmed;
        } else if(trimmed.startsWith('https://orcid.org/') || trimmed.startsWith('http://orcid.org/')){
            return trimmed;
        } else {
            return null
        }
    } 
}

const getDoi = (text) => {
    if(typeof text !== "string" || /\s/.test(text.trim())){
        return null
    } else {
        const doi = text.trim().match(doiRegex())?.[0];
        if (doi) {
            return 'https://doi.org/' + doi;
        } else {
            return null;
        }
    } 
}

export const HyperText = ({text, ...props}) =>  {
    if(text === false || text === true){
        return <BooleanValue value={text} {...props}/>
    }
    if(typeof text === "undefined"){
        return null;
    }
    if(typeof text !== "string"){
        return <span {...props}>{text}</span>;
    }
    const sanitized = DOMPurify.sanitize(text);
    const doi = getDoi(sanitized);
    if(doi){
        return <Doi id={doi} {...props}/>
    }
    const orcid = getOrcid(sanitized);
    if(orcid){
        return <Orcid href={orcid} {...props}/>
    }
    const lsid = getLsid(sanitized);
    if(lsid){
        return <Lsid identifier={lsid} {...props}/>
    }
    
    return <div css={content()} dangerouslySetInnerHTML={{ __html: autolinker.link(sanitized) }} {...props}></div>
}