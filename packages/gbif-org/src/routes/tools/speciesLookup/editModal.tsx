import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { RefObject } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SuggestionRow } from './components';
import { SpeciesRow, SuggestResult } from './types';

type EditModalProps = {
  itemToEdit: SpeciesRow | null;
  searchQuery: string;
  suggestions: SuggestResult[];
  isSuggestLoading: boolean;
  searchInputRef: RefObject<HTMLInputElement>;
  onClose: () => void;
  onSearchChange: (query: string) => void;
  onSelectSuggestion: (suggestion: SuggestResult) => void;
  onDiscard: () => void;
};

export function EditModal({
  itemToEdit,
  searchQuery,
  suggestions,
  isSuggestLoading,
  searchInputRef,
  onClose,
  onSearchChange,
  onSelectSuggestion,
  onDiscard,
}: EditModalProps) {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      open={!!itemToEdit}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="g-bg-black/30" />
        <DialogPrimitive.Content
          className="gbif g-fixed g-z-50 g-left-[50%] g-w-full"
          style={{ top: '8%', transform: 'translateX(-50%)', maxWidth: '32rem' }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Card className="g-bg-white g-flex g-flex-col g-overflow-hidden g-max-h-[75vh]">
            <div className="g-px-4 g-pt-4 g-pb-3 g-border-b g-flex-shrink-0 g-space-y-2">
              <p className="g-text-xs g-text-slate-400">
                <FormattedMessage
                  id="tools.speciesLookup.matchCandidatesFor"
                  defaultMessage="Match candidates for"
                />
              </p>
              <p className="g-text-sm g-font-medium g-text-slate-800 g-italic">
                {itemToEdit?.verbatimScientificName}
              </p>
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={formatMessage({
                  id: 'tools.speciesLookup.searchSpecies',
                  defaultMessage: 'search species',
                })}
              />
            </div>

            <div className="g-overflow-y-auto g-flex-1 g-bg-slate-50">
              {searchQuery.trim() ? (
                <>
                  {isSuggestLoading ? (
                    <div className="g-px-4 g-py-3 g-space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="g-h-10 g-w-full" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {suggestions.length === 0 && (
                        <p className="g-text-center g-text-slate-400 g-text-sm g-py-8">
                          <FormattedMessage
                            id="tools.speciesLookup.noSuggestions"
                            defaultMessage="No results"
                          />
                        </p>
                      )}
                      {suggestions.map((s) => (
                        <SuggestionRow key={s.key} item={s} onClick={() => onSelectSuggestion(s)} />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  {(!itemToEdit?.alternatives || itemToEdit.alternatives.length === 0) && (
                    <p className="g-text-center g-text-slate-400 g-text-sm g-py-8">
                      <FormattedMessage
                        id="tools.speciesLookup.noAlternatives"
                        defaultMessage="No alternative matches — use the search above"
                      />
                    </p>
                  )}
                  {itemToEdit?.alternatives?.map((a) => (
                    <SuggestionRow key={a.key} item={a} onClick={() => onSelectSuggestion(a)} />
                  ))}
                </>
              )}
            </div>

            <div className="g-flex g-justify-between g-px-4 g-py-3 g-border-t g-flex-shrink-0">
              <Button variant="ghost" onClick={onClose}>
                <FormattedMessage id="tools.speciesLookup.cancel" defaultMessage="Cancel" />
              </Button>
              <Button variant="ghost" onClick={onDiscard}>
                <FormattedMessage id="tools.speciesLookup.discard" defaultMessage="Discard" />
              </Button>
            </div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
