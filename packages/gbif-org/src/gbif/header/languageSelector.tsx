import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdownMenu';
import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import React from 'react';
import { MdCheck, MdTranslate } from 'react-icons/md';

export function LanguageSelector({ trigger = <MdTranslate /> }): React.ReactElement {
  const { locale, setLocale } = useI18n();
  const { languages } = useConfig();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="g-w-96 g-shadow-2xl g-p-6">
        <div className="g-grid g-gap-4">
          <div className="g-space-y-2">
            <h4 className="g-font-medium g-leading-none">Change language</h4>
            <p className="g-text-sm g-text-muted-foreground">
              Translations are a community effort. Learn more about the network of{' '}
              <a className="g-underline" href="/translators">
                volunteer translators
              </a>
              .
            </p>
          </div>
        </div>
        <div className="g-mt-4">
          <DropdownMenuSeparator />
          {languages.map((language) => (
            <DropdownMenuItem key={language.code} onClick={() => setLocale(language.code)}>
              <span className="g-w-5">{locale.code === language.code && <MdCheck />}</span>
              {language.label}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
