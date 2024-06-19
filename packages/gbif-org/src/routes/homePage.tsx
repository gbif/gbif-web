import { DynamicLink } from '@/components/dynamicLink';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export function HomePage(): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className='g-p-4 g-pt-8 md:g-p-8 md:g-pt-16 g-max-w-3xl g-m-auto'>
        <div className='g-prose'>
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
            <p>Mostly done and should be reviewed by the content team.</p>
            <ul>
              <li>
                <DynamicLink className='g-me-4' to="/news/6qTuv5Xf1qa05arROvx7Y1">
                  News
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/data-use/2NcRzaklrkf5X1mvyOvg5V">
                  Data use
                </DynamicLink>
              </li>
              <li>
                Articles:{' '}
                <DynamicLink className='g-me-4' to="/article/ExNixkGbYWCsgcWE4YScw">
                  Data papers{' '}
                  <small className='g-font-normal'>(will be redirected to urlAlias)</small>
                </DynamicLink>
                <DynamicLink className='g-me-4' to="/standards">
                  Data standards{' '}
                  <small className='g-font-normal'>(links directly to the urlAlias)</small>
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/event/NVM72rVLfCkY4oyFEnGmq">
                  Event
                </DynamicLink>
              </li>
              <li>
                Tools:{' '}
                <DynamicLink className='g-me-4' to="/tool/XHl9BhJPvhn9jNKVPH6oG">
                  GeoPick (basic)
                </DynamicLink>
                <DynamicLink className='g-me-4' to="/tool/82599">
                  CAPFITOGEN (w small image)
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/project/82750">
                  Project
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/programme/82243">
                  Programme BID
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/composition/3fvWSwDCj8tZBpRFiWC8QQ">
                  Composition test page
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/document/80667">
                  Document test page
                </DynamicLink>
              </li>
              <li>
                The home page is essentially like a composition page, but with a special header
              </li>
              <li>
                <DynamicLink
                  className="me-4"
                  to="/composition/7zgSnALNuD1OvzanAUPG4z/hosted-portals-application-form"
                >
                  Hosted portals application form
                </DynamicLink>
              </li>
            </ul>
          </section>

          <section>
            <h2>API v1 driven pages (primary ID in the GBIF API)</h2>
            <p>Work in progress</p>
            <ul>
              <li>
                <DynamicLink className='g-me-4' to="/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6">
                  Network
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/dataset/84d26682-f762-11e1-a439-00145eb45e9a">
                  Dataset
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/publisher/4b44524a-3f31-47e4-a5d2-a4dc15a5dd07">
                  Publisher
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/installation/dbc06549-1795-4167-a247-9dcf90228ae7">
                  Installation
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/institution/955b0e63-c3b5-4d74-8dfa-15b384b9ae77">
                  Institution
                </DynamicLink>
              </li>
              <li>
                {/* <DynamicLink className='g-me-4' to="/collection/e9d2c520-d9fc-4331-9ed8-73bea2b22af0"> */}
                <DynamicLink className='g-me-4' to="/collection/03a64ffd-34d0-432c-a152-0d41d41c028f">
                  Collection
                </DynamicLink>
              </li>
              <li>
                Occurrences: <DynamicLink className='g-me-4' to="/occurrence/4126243325">Images</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/4045885848">Video</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/2434542261">RecordedBy ID</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/1934869005">Fossil</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/3013940180">iNat</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/4527469336">Phylogeny</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/4517957661">Extensions</DynamicLink>
                <DynamicLink className='g-me-4' to="/occurrence/4129776625">Oceanic</DynamicLink>
              </li>
              <li>
                Download, species, participant, country and profile pages have not been started
              </li>
            </ul>
          </section>
          <section>
            <h2>Custom one-off pages</h2>
            <p>
              This is pages like, contact directory, network, suggest a dataset, ipt, blast tool,
              occ snapshots, etc. Some have been implemented, but there is alot of these.
            </p>
            <ul>
              <li>
                <DynamicLink className='g-me-4' to="/become-a-publisher">
                  Become a publisher
                </DynamicLink>
              </li>
              <li>
                <DynamicLink className='g-me-4' to="/suggest-dataset">
                  Suggest a dataset
                </DynamicLink>
              </li>
            </ul>
          </section>
          <section>
            <h2>Search</h2>
            <p>
              This hasn't started yet. But it is search for occurrences, species, datasets,
              publishers, literature, news etc.
            </p>
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
