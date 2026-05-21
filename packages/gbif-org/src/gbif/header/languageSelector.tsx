import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { Formatted } from 'maplibre-gl';
import React from 'react';
import { MdCheck, MdTranslate } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function LanguageSelector({ trigger = <MdTranslate /> }): React.ReactElement {
  const { locale, setLocale } = useI18n();
  const { languages } = useConfig();

  const primaryTranslations = ['en', 'ar', 'zh', 'fr', 'ru', 'es'];

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
          {languages
            .filter((language) => primaryTranslations.includes(language.code))
            .map((language) => {
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
          {languages
            .filter((language) => !primaryTranslations.includes(language.code))
            .map((language) => {
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
