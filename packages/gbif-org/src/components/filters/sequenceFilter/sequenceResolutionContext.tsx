import { createContext, useContext } from 'react';

// Publishes whether the "Similar sequences" filter is still resolving its pasted sequence into
// nucleotideSequenceIDs (via vsearch). The filter chip reads this to show a spinner while the
// resolution is in flight. The default (`pending: false`) makes the hook safe to call outside a
// provider — e.g. an embedded occurrence search that doesn't wire it up just gets no spinner.
type SequenceResolution = { pending: boolean };

const SequenceResolutionContext = createContext<SequenceResolution>({ pending: false });

export const SequenceResolutionProvider = SequenceResolutionContext.Provider;

export const useSequenceResolution = (): SequenceResolution =>
  useContext(SequenceResolutionContext);
