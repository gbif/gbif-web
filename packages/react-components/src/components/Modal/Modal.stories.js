import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Modal, DialogContent } from './Modal';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import DocsWrapper from '../DocsWrapper';
import { Button } from '../Button';

export default {
  title: 'Components/Modal',
  component: Modal,
};

export const Example = () => {
  const [open, setOpen] = useState(false);
  return <DocsWrapper>
    <Modal disclosure={<Button>Open modal</Button>}>
      <div>
        <p>Uncontrolled</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nis</p>
      </div>
    </Modal>
    <Button style={{margin: '0 12px'}} onClick={() => setOpen(!open)}>Controlled toggle</Button>
    <Modal open={open} onClose={() => setOpen(false)}>
      <DialogContent title="Login" style={{minWidth: 400}} onCancel={() => setOpen(false)}>
        sdflkjh sldkjfh lskdjhf lskdjhf 
      </DialogContent>
    </Modal>
    {/* <StyledProse source={readme}></StyledProse> */}
  </DocsWrapper>
}

Example.story = {
  name: 'Modal',
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
// {text('Text', 'Modal text')}