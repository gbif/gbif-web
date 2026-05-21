import { DynamicLink } from '@/reactRouterPlugins';
import { FaFacebookF, FaLinkedinIn, FaMastodon } from 'react-icons/fa';
import { FaBluesky } from 'react-icons/fa6';
import { IoLogoVimeo } from 'react-icons/io5';
import { FormattedMessage, useIntl } from 'react-intl';
import gbifLogoUrl from './full-gbif-logo-white.svg';
import gbcLogoUrl from './gbc.svg';

const cssSeparator = "after:g-content-['|'] after:g-px-2";
const footerLink = 'g-inline-flex g-items-center g-py-2 g-min-h-9 sm:g-min-h-7 hover:g-underline';
const socialLink =
  'g-inline-flex g-w-11 g-h-11 g-bg-white g-rounded-full g-justify-center g-items-center hover:g-opacity-80';

export function Footer() {
  const intl = useIntl();
  const footerNavLabel = intl.formatMessage({
    id: 'footer.navAriaLabel',
    defaultMessage: 'Footer',
  });
  const socialNavLabel = intl.formatMessage({
    id: 'footer.socialNavAriaLabel',
    defaultMessage: 'GBIF on social media',
  });

  return (
    <footer className="g-text-white" role="contentinfo">
      <section className="g-bg-[#686a68] g-py-6 g-px-4 g-text-base sm:g-text-sm">
        <nav aria-label={footerNavLabel}>
          <ul className="g-flex g-justify-center g-w-full g-flex-wrap">
            <li className={cssSeparator}>
              <DynamicLink to="/what-is-gbif" className={footerLink}>
                <FormattedMessage id="footer.whatIsGbif" defaultMessage="What is GBIF?" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/developer/summary" className={footerLink}>
                <FormattedMessage id="footer.api" defaultMessage="API" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/faq" className={footerLink}>
                <FormattedMessage id="footer.faq" defaultMessage="FAQ" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/subscribe" className={footerLink}>
                <FormattedMessage id="footer.newsletter" defaultMessage="Newsletter" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/terms/privacy-policy" className={footerLink}>
                <FormattedMessage id="footer.privacy" defaultMessage="Privacy" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/terms" className={footerLink}>
                <FormattedMessage id="footer.terms" defaultMessage="Terms and agreements" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/citation-guidelines" className={footerLink}>
                <FormattedMessage id="footer.citation" defaultMessage="Citation" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/code-of-conduct" className={footerLink}>
                <FormattedMessage id="footer.codeOfConduct" defaultMessage="Code of Conduct" />
              </DynamicLink>
            </li>
            <li>
              <DynamicLink to="/acknowledgements" className={footerLink}>
                <FormattedMessage id="footer.acknowledgements" defaultMessage="Acknowledgements" />
              </DynamicLink>
            </li>
          </ul>
          <address className="g-mt-2 g-not-italic g-flex g-w-full g-justify-center g-flex-wrap g-items-center">
            <DynamicLink to="/contact-us" className={`${cssSeparator} ${footerLink}`}>
              <FormattedMessage id="footer.contact" defaultMessage="Contact" />
            </DynamicLink>
            <span className="g-font-semibold">GBIF Secretariat&nbsp;</span>
            <span className={cssSeparator}>Universitetsparken 15</span>
            <span className={cssSeparator}>DK-2100 Copenhagen Ø</span>
            <span>Denmark</span>
          </address>
        </nav>
      </section>
      <section className="g-bg-[#5b5b5b] g-flex g-w-full g-justify-center g-py-6 g-px-6 g-text-base sm:g-text-sm">
        <DynamicLink
          to="/news/6PHdgoyIF6RmI7u4VOouuD"
          className="g-flex g-items-center g-min-h-11 hover:g-underline"
        >
          <img src={gbcLogoUrl} className="g-h-10 g-p-r-6" alt="" />
          <span className="g-ps-4">
            <span className="g-font-semibold">GBIF</span> is a Global Core Biodata Resource
          </span>
        </DynamicLink>
      </section>
      <section className="g-bg-[#414141] g-text-[#414141] g-py-6 g-px-6">
        <ul
          className="g-flex g-w-full g-justify-center g-items-center g-gap-5 g-flex-wrap"
          aria-label={socialNavLabel}
        >
          <li>
            <a
              href="https://www.linkedin.com/company/gbif"
              aria-label="LinkedIn"
              className={socialLink}
            >
              <FaLinkedinIn aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/gbifnews"
              aria-label="Facebook"
              className={socialLink}
            >
              <FaFacebookF aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="https://bsky.app/profile/gbif.org" aria-label="Bluesky" className={socialLink}>
              <FaBluesky aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://biodiversity.social/@gbif"
              rel="me"
              aria-label="Mastodon"
              className={socialLink}
            >
              <FaMastodon size={18} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="https://vimeo.com/gbif" aria-label="Vimeo" className={socialLink}>
              <IoLogoVimeo size={18} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </section>
      <section className="g-bg-[#222222] g-py-6 g-px-6 g-flex g-justify-center g-w-full">
        <img className="g-h-[40px]" src={gbifLogoUrl} alt="GBIF" />
      </section>
    </footer>
  );
}
