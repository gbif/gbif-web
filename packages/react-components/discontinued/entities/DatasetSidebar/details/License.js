import { jsx } from '@emotion/react';
import React from "react";
import { FormattedMessage } from "react-intl";
import urlRegex from 'url-regex';


export function License({
  url,
  ...props
}) {

  if(!url){
      return <FormattedMessage id="enums.license.UNSPECIFIED" defaultMessage="Unspecified" />
  } else if(isLink(url)){
      switch (url) {
          case 'http://creativecommons.org/publicdomain/zero/1.0/legalcode':
            return <a href={url}><FormattedMessage id="enums.license.CC0_1_0" defaultMessage="CC0_1_0" /></a>
          case 'http://creativecommons.org/licenses/by/4.0/legalcode':
            return <a href={url}><FormattedMessage id="enums.license.CC_BY_4_0" defaultMessage="CC_BY_4_0" /></a>
          case 'http://creativecommons.org/licenses/by-nc/4.0/legalcode':
            return <a href={url}><FormattedMessage id="enums.license.CC_BY_NC_4_0" defaultMessage="CC_BY_NC_4_0" /></a>
          default:
            return <FormattedMessage id="enums.license.UNSUPPORTED" defaultMessage="UNSUPPORTED" />

      }
      
  } else {
      return <FormattedMessage id="enums.license.UNSPECIFIED" defaultMessage="Unspecified" />
  }

}

const isLink = data => {
    if (typeof data !== 'string') {
        return false;
    }
    return urlRegex({exact: true}).test(data);
}
