
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import * as styles from './Input.styles';

export const Input = React.forwardRef(({
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  // return <button ref={ref} {...props} css={styles.input({theme})} />
  return <button ref={ref} {...props} />
});

Input.displayName = 'Input'


// export const FilterInput2 = React.forwardRef(({
//   suffix,
//   ...props
// }, ref) => {
//   const theme = useContext(ThemeContext);
//   return <Input {...props} 
//     style={{flex: '1 1 auto'}}
//     addonAfter={<Button appearance="outline" style={{ flex: '0 0 auto' }} >
//       <MdClose style={{ verticalAlign: 'middle' }} />
//     </Button>}
//     />
// });

// export const FilterInput = React.forwardRef(({
//   isApplied,
//   onClearRequest = () => { },
//   ...props
// }, ref) => {
//   const theme = useContext(ThemeContext);
//   return <div css={styles.inputGroup({theme})}>
//     <Input {...props} style={{flex: '1 1 auto'}} css={styles.inputGroupChild({theme})}/>
//     {/* <select {...props} style={{flex: '1 1 auto'}} css={{...styles.inputGroupChild({theme}), ...styles.input({theme})}}>
//       <option>sdf</option>
//       <option>sdf</option>
//       <option>sdf</option>
//       <option>sdf</option>
//     </select> */}
//     {/* <Example {...props} style={{flex: '1 1 auto'}}/> */}
//     <Button appearance="outline" style={{ flex: '0 0 auto' }} css={styles.inputGroupChild({theme})}>
//       <MdClose style={{ verticalAlign: 'middle' }} />
//     </Button>
//   </div>
// });
