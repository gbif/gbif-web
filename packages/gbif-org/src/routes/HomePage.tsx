import { DynamicLink } from '@/components/DynamicLink';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export function HomePage(): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="prose">
        <h2>This demo includes</h2>
        <ul>
          <li>
            <DynamicLink to="/news/6qTuv5Xf1qa05arROvx7Y1">
              News (wip) (skeleton loading demo)
            </DynamicLink>
          </li>
          <li>
            <DynamicLink to="/data-use/2NcRzaklrkf5X1mvyOvg5V">Data use (wip)</DynamicLink>
          </li>
          <li>
            <DynamicLink to="/article/ExNixkGbYWCsgcWE4YScw">
              Article - Data papers (wip)
            </DynamicLink>
            <DynamicLink to="/article/3wusV3o9X2WO6aWU8MK2WG">
              Article - Data standards (wip)
            </DynamicLink>
          </li>
          <li>
            <DynamicLink to="/event/NVM72rVLfCkY4oyFEnGmq">Event (wip)</DynamicLink>
          </li>
          <li>
            <DynamicLink to="/tool/XHl9BhJPvhn9jNKVPH6oG">Tool (wip)</DynamicLink>
            <DynamicLink to="/tool/82599">Small Image (wip)</DynamicLink>
          </li>
          <li>
            <DynamicLink to="/project/82750">Project (wip)</DynamicLink>
          </li>
        </ul>
      </div>
    </>
  );
}
