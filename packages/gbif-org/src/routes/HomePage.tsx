import { DynamicLink } from '@/components/DynamicLink';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export function HomePage(): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="p-4 pt-8 md:p-8 md:pt-16 max-w-3xl m-auto">
        <div className="prose">
          <p>
            Here you can see the various detail pages for the new GBIF.org. This is intended
            primarily as a technical migration to make it easier to maintain hosted portals and
            GBIF.org at the same time. As well as updating an aging tech stack.
          </p>
          <p>
            It is not intended as a fundamental redesign of the site, neither visually or in
            functional, but some changes are inevitable. As is always the case we are happy to do
            changes and iterations as we go along. But for now it is a migration task.
          </p>
          <hr />
          <section>
            <h2>Pages with a Contentful ID - work in progress</h2>
            <p>
              I expect Kyle, Daniel and Javier will be the primary people involved in reviewing
              this. But please feel free to add comments and feedback. I will try to keep this up to
              date as we go along.
            </p>
            <ul>
              <li>
                <DynamicLink className="me-4" to="/news/6qTuv5Xf1qa05arROvx7Y1">
                  News
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/data-use/2NcRzaklrkf5X1mvyOvg5V">
                  Data use
                </DynamicLink>
              </li>
              <li>
                Articles:{' '}
                <DynamicLink className="me-4" to="/article/ExNixkGbYWCsgcWE4YScw">
                  Data papers{' '}
                  <small className="font-normal">(will be redirected to urlAlias)</small>
                </DynamicLink>
                <DynamicLink className="me-4" to="/standards">
                  Data standards{' '}
                  <small className="font-normal">(links directly to the urlAlias)</small>
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/event/NVM72rVLfCkY4oyFEnGmq">
                  Event
                </DynamicLink>
              </li>
              <li>
                Tools:{' '}
                <DynamicLink className="me-4" to="/tool/XHl9BhJPvhn9jNKVPH6oG">
                  GeoPick (basic)
                </DynamicLink>
                <DynamicLink className="me-4" to="/tool/82599">
                  CAPFITOGEN (w small image)
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/project/82750">
                  Project
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/programme/82243">
                  Programme BID
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/composition/3fvWSwDCj8tZBpRFiWC8QQ">
                  Composition test page
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/document/80667">
                  Document test page
                </DynamicLink>
              </li>
            </ul>
          </section>

          <section>
            <h2>API v1 driven pages (primary ID in the GBIF API)</h2>
            <ul>
              <li>
                <DynamicLink className="me-4" to="/dataset/8a863029-f435-446a-821e-275f4f641165">
                  Occurrence dataset
                </DynamicLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
