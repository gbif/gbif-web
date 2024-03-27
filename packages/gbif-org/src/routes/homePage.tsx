import { DynamicLink } from '@/components/dynamicLink';
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
            <h2>Pages with a Contentful ID</h2>
            <p>
              Mostly done and should be reviewed by the content team.
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
              <li>
                The home page is essentially like a composition page, but with a special header
              </li>
            </ul>
          </section>

          <section>
            <h2>API v1 driven pages (primary ID in the GBIF API)</h2>
            <p>Work in progress</p>
            <ul>
              <li>
                <DynamicLink className="me-4" to="/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6">
                  Network
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/dataset/8a863029-f435-446a-821e-275f4f641165">
                  Dataset
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/publisher/d3978a37-635a-4ae3-bb85-7b4d41bc0b88">
                  Publisher
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/installation/5155d542-ed70-40d8-b05b-55b13416d037">
                  Installation
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/institution/55efe71a-faba-4333-951c-d665509f3d67">
                  Institution
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className="me-4" to="/collection/e9d2c520-d9fc-4331-9ed8-73bea2b22af0">
                  Collection
                </DynamicLink>
              </li>
              <li>
                Occurrence, download, species, participant, country and profile pages have not been started
              </li>
            </ul>
          </section>
          <section>
            <h2>Custom one-off pages</h2>
            <p>This is pages like, contact directory, network, suggest a dataset, ipt, blast tool, occ snapshots, etc. None have been implemented yet. There is alot of these.</p>
          </section>
          <section>
            <h2>Search</h2>
            <p>This hasn't started yet. But it is search for occurrences, species, datasets, publishers, literature, news etc.</p>
          </section>
          <section>
            <h2>Site wide features</h2>
            <p>Not implemented, but is menu, login, feedback, footer, ...</p>
          </section>
        </div>
      </div>
    </>
  );
}
