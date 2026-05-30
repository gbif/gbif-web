import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useConfig } from '@/config/config';
import useBelow from '@/hooks/useBelow';
import { useI18n } from '@/reactRouterPlugins';
import React, { useState } from 'react';
import { MdCheck, MdTranslate } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

const primaryTranslations = ['en', 'ar', 'zh', 'fr', 'ru', 'es'];

type LanguageSelectorProps = {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function LanguageSelector({
  trigger = <MdTranslate />,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: LanguageSelectorProps): React.ReactElement {
  const { locale, setLocale } = useI18n();
  const { languages } = useConfig();
  const isMobileBreakpoint = useBelow(640);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  // Render as sheet on mobile breakpoint OR when opened externally (e.g. from the mobile sidebar)
  const useSheet = isMobileBreakpoint || controlledOpen !== undefined;

  const primary = languages.filter((language) => primaryTranslations.includes(language.code));
  const others = languages.filter((language) => !primaryTranslations.includes(language.code));

  if (useSheet) {
    const renderItem = (language: (typeof languages)[number]) => {
      const isCurrent = locale.code === language.code;
      return (
        <li key={language.code}>
          <button
            type="button"
            onClick={() => {
              setLocale(language.code);
              setOpen(false);
            }}
            aria-current={isCurrent ? 'true' : undefined}
            className="g-w-full g-text-start g-py-3 g-min-h-11 g-flex g-items-center g-border-b hover:g-underline"
          >
            <span className="g-w-6" aria-hidden="true">
              {isCurrent && <MdCheck />}
            </span>
            <span>{language.label}</span>
          </button>
        </li>
      );
    };

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {trigger && controlledOpen === undefined && (
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        )}
        <SheetContent
          side={locale.textDirection === 'rtl' ? 'left' : 'right'}
          className="g-w-full sm:g-max-w-full g-h-full g-overflow-y-auto g-p-4"
          dir={locale.textDirection || 'ltr'}
        >
          <SheetHeader className="g-pe-12">
            <SheetTitle dir="auto" className="g-text-start">
              <FormattedMessage id="languageSelector.title" />
            </SheetTitle>
            <SheetDescription dir="auto" className="g-text-start">
              <FormattedMessage
                id="languageSelector.description"
                values={{
                  translatorsLink: (
                    <a className="g-underline" href="/translators">
                      <FormattedMessage id="languageSelector.translatorsLink" />
                    </a>
                  ),
                }}
              />
            </SheetDescription>
          </SheetHeader>
          <ul className="g-mt-4">{primary.map(renderItem)}</ul>
          {others.length > 0 && <ul className="g-mt-2">{others.map(renderItem)}</ul>}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DropdownMenu modal={false} dir={locale.textDirection ?? 'ltr'}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="g-w-96 g-shadow-2xl g-p-6">
        <div className="g-grid g-gap-4">
          <div className="g-space-y-2">
            <h4 className="g-font-medium g-leading-none" dir="auto">
              <FormattedMessage id="languageSelector.title" />
            </h4>
            <p className="g-text-sm g-text-muted-foreground" dir="auto">
              <FormattedMessage
                id="languageSelector.description"
                values={{
                  translatorsLink: (
                    <a className="g-underline" href="/translators">
                      <FormattedMessage id="languageSelector.translatorsLink" />
                    </a>
                  ),
                }}
              />
            </p>
          </div>
        </div>
        <div className="g-mt-4">
          <DropdownMenuSeparator />
          {primary.map((language) => {
            const isCurrent = locale.code === language.code;
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setLocale(language.code)}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <span className="g-w-5" aria-hidden="true">
                  {isCurrent && <MdCheck />}
                </span>
                {language.label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          {others.map((language) => {
            const isCurrent = locale.code === language.code;
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setLocale(language.code)}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <span className="g-w-5" aria-hidden="true">
                  {isCurrent && <MdCheck />}
                </span>
                {language.label}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
