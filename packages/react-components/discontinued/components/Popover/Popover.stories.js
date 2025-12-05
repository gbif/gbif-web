import { text, boolean, select } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { Button } from '../Button';
import Popover from './Popover';

export default {
  title: 'Components/Popover',
  component: Popover,
};

const TaxonFilter = React.memo(({ focusRef, hide, ...props }) => {
  return <div>
    <h1>Taxon filter</h1>
    <Button onClick={() => hide()}>Close</Button>
    <Button ref={focusRef}>init focus</Button>
    <Button>test 3</Button>
    <Button>test 4</Button>
  </div>
});
TaxonFilter.displayName = 'TaxonFilter';

export const ModalExample = () => {
  const [visible, setVisible] = useState(false);
  return <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.</p>
    <div style={{paddingLeft: 50}}>
      <Popover
        trigger={<Button onClick={() => setVisible(true)}>Open modal</Button>}
        aria-label="Location filter"
        onClickOutside={action => console.log('close request', action)}
        visible={visible}
      >
        <TaxonFilter hide={() => setVisible(false)}/>
      </Popover>
    </div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.
    </p>
    <p>
      Integer condimentum magna diam, ac imperdiet purus ultrices eget. In facilisis aliquet nulla, vel tristique sem bibendum nec. Morbi lectus erat, finibus sit amet nunc vitae, sagittis blandit quam. Integer pulvinar leo massa, eu suscipit metus rhoncus non. Sed molestie sapien eget porta sagittis. Sed in erat consequat, rhoncus ante eget, tempus dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce sed mattis nibh, in pharetra ipsum. Proin sed lacus a quam accumsan efficitur non ac erat. Donec ultrices non est sit amet venenatis. In faucibus arcu sit amet leo aliquam, ut porta lorem laoreet. Fusce accumsan mi urna, ac ultricies ante gravida at. Suspendisse potenti.
    </p>
    <p>
      Praesent tempus neque massa, vitae pulvinar purus interdum at. Curabitur sit amet nibh vitae leo finibus mollis. Ut mauris ex, feugiat eget risus eget, maximus vestibulum dolor. Nullam interdum ligula vitae ullamcorper suscipit. Nam in euismod massa. Integer sit amet ornare ligula, nec fermentum magna. Suspendisse potenti. Donec ut sapien sagittis, condimentum nisi vitae, consequat elit. Vestibulum et nibh sed est viverra imperdiet. Ut a elit quis enim posuere aliquet non et lectus. Vestibulum eu neque quis quam auctor vehicula quis vitae erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam sem lorem, pharetra quis rutrum nec, finibus nec tortor.
    </p>
    <p>
      Phasellus enim risus, consequat eget eros sit amet, placerat lobortis magna. Phasellus sed turpis lorem. Curabitur in ipsum facilisis, tristique velit non, iaculis quam. Sed vulputate ipsum nec suscipit ultrices. Nulla urna velit, auctor quis volutpat sed, malesuada et ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec quam nisi, accumsan aliquam odio et, semper blandit risus. Maecenas luctus lobortis augue, sit amet gravida nibh pellentesque ut. Praesent rutrum, lacus quis mattis fermentum, tellus libero eleifend risus, quis cursus orci odio et dolor. Proin quis dapibus massa, in aliquet dui. Curabitur sed suscipit lacus, id condimentum ipsum. Sed convallis dictum elit, a sagittis libero elementum eu. Sed at nisi velit. Phasellus vulputate ultrices nulla, ut elementum sapien rhoncus in. Cras consequat lobortis dolor, rhoncus luctus elit faucibus quis.
   </p>
    <p>
      Maecenas metus justo, bibendum in mauris vel, aliquet venenatis arcu. Vestibulum aliquet ac massa porttitor maximus. Vivamus id posuere ex, vitae semper odio. Praesent ac eleifend quam, a gravida neque. Ut a luctus ex. Praesent sit amet laoreet urna. Sed aliquet condimentum odio, eget interdum metus cursus ut. Nullam suscipit fringilla lectus, et fringilla diam elementum ut. Duis facilisis nisi nisl, a pulvinar felis cursus id. Duis non lorem ut odio sodales finibus. Etiam tellus lorem, facilisis vel dictum non, congue ac leo. Praesent porttitor ex sit amet enim dignissim, ut aliquet quam elementum. Praesent suscipit orci ac purus fermentum tincidunt. Donec ac nisl eu nisl ullamcorper ultricies nec sed lorem.
    </p>
  </>
};

ModalExample.story = {
  name: 'Popover',
};
