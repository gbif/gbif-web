import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

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
            <Link to="/news/6qTuv5Xf1qa05arROvx7Y1">News (wip)</Link>
          </li>
          <li>
            <Link to="/data-use/2NcRzaklrkf5X1mvyOvg5V">Data use (wip)</Link>
          </li>
          <li>
            <Link to="/article/ExNixkGbYWCsgcWE4YScw">Article (wip)</Link>
          </li>
          <li>
            <Link to="/event/NVM72rVLfCkY4oyFEnGmq">Event (wip)</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
