import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Gallery, GalleryCaption, GalleryTiles, GalleryTile } from './Gallery';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

const mockData = [
  {
    src: `https://via.placeholder.com/${100 + 50 * Math.floor(Math.random() * 10)}x150`,
    scientificName: 'Puma concolor Linneaus',
    description: 'Observed in Denmark 19 Januar 2017'
  },
  {
    src: `https://via.placeholder.com/${100 + 50 * Math.floor(Math.random() * 10)}x150`,
    scientificName: 'Flabellina',
    description: 'Catched in Spain 25 Febrary 2019'
  },
  {
    src: `https://via.placeholder.com/${100 + 50 * Math.floor(Math.random() * 10)}x150`,
    scientificName: 'Puma concolor Linneaus',
    description: 'Observed in Denmark 19 Januar 2017'
  },
  {
    src: `https://via.placeholder.com/${100 + 50 * Math.floor(Math.random() * 10)}x150`,
    scientificName: 'Flabellina',
    description: 'Catched in Spain 25 Febrary 2019'
  }
];

export default {
  title: 'Components/Gallery',
  component: Gallery,
};

export const Example = () => {
  const [items, setItems] = useState(mockData);
  return <>
    <Gallery 
      caption={({ item }) => <GalleryCaption>
        {item.scientificName}
      </GalleryCaption>}
      title={item => item.scientificName}
      subtitle={item => item.description}
      details={item => <pre>{JSON.stringify(item, null, 2)}</pre>}
      loading={false}
      items={items}
      loadMore={() => setItems([...items, ...items])}
      imageSrc={item => item.src}
    />
    {/* <StyledProse source={readme}></StyledProse> */}
  </>
};

Example.story = {
  name: 'Gallery',
};

export const SimpleExample = () => {
  const [items, setItems] = useState(mockData);
  return <>
    <GalleryTiles>
      {[1,2,3,4,5,6,7,8].map(x => {
        return <GalleryTile key={x} height={100} src={`https://via.placeholder.com/${100 + 50 * Math.floor(Math.random() * 10)}x150`} />
      })}
    </GalleryTiles> 
  </>
};

SimpleExample.story = {
  name: 'Plain gallery tiles',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'Gallery text')}