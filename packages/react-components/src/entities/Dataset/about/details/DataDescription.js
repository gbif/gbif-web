import React, { useState, useEffect } from "react";
import { jsx } from '@emotion/react';
import { Properties, Button, HyperText } from "../../../../components";
import { FormattedMessage } from "react-intl";

const { Term: T, Value: V } = Properties;

export function BibliographicCitations({
  bibliographicCitations = [],
  ...props
}) {
  // I really dislike "show all"-buttons that only show me one more item. Just show the damn item to begin with then. It is such a disappointing experience.
  // So instead we do: if less than 10 items then show them all. If above 10, then show 5 + expand button.
  // then it feels like you are rewarded for your action
  const [threshold, setThreshold] = useState(5);
  const citations = bibliographicCitations.length < 10 ? bibliographicCitations : bibliographicCitations.slice(0,threshold);
  const hasHidden = bibliographicCitations.length > citations.length;
  return <>
    <ul>
      {citations.map(x => <BibiliographicCitation citation={x} />)}
    </ul>
    {hasHidden && <Button onClick={() => setThreshold(500)}>Show all</Button>}
  </>
}

function BibiliographicCitation({citation}) {
  const pattern = /^http(s)?:\/\/.+/;
  const match = citation.identifier ? citation.identifier.match(pattern) : null;
  return <li>
    {citation.text && (
      <div>
        <HyperText text={citation.text} />
      </div>
    )}
    {citation.identifier && match && <a href={citation.identifier}><FormattedMessage id="components.dataset.viewArticle" /></a>}
    {citation.identifier && !match && <><span style={{color: '#888'}}>Identifier: </span><span>{citation.identifier}</span></>}
    {/* {citation.identifier && <a href={'https://scholar.google.com/scholar?q=' + encodeURIComponent(citation.text)}>Google Scholar</a>} */}
  </li>;
}



/*

<section class="horizontal-stripe--paddingless dataset-key__contributors small" ng-if="datasetKey.dataset.dataLanguage || datasetKey.dataset.language || datasetKey.dataset.dataDescriptions.length > 0">
    <div>
        <a href="" id="dataDescription"></a>
        <div class="anchor-block--tabs" id="dataDescriptionBlock">
            <h3 translate="dataset.dataDescription"></h3>
            <div>
                <dl class="inline">

                    <div ng-if="datasetKey.dataset.language">
                        <dt translate="dataset.metadataLanguage"></dt>
                        <dd dir="auto" translate="language.{{ datasetKey.dataset.language }}"></dd>
                    </div>

                    <div ng-if="datasetKey.dataset.dataLanguage">
                        <dt translate="dataset.dataLanguage"></dt>
                        <dd dir="auto" translate="language.{{ datasetKey.dataset.dataLanguage }}"></dd>
                    </div>

                    <div ng-if="datasetKey.dataset.dataDescriptions.length > 0">
                        <dt translate="dataset.dataDescriptions"></dt>
                        <dd>
                            <ul class="inline-bullet-list">
                                <li dir="auto" ng-repeat="descr in datasetKey.dataset.dataDescriptions">
                                    <a ng-href="{{ descr.url }}">
                                        <span ng-if="descr.name">{{ descr.name }}</span>
                                        <span ng-if="!descr.name && descr.url">{{ descr.url }}</span>
                                    </a>
                                </li>
                            </ul>
                        </dd>
                    </div>

                </dl>
            </div>
        </div>
    </div>
</section>

*/