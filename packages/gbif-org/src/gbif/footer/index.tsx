import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import gbifLogoUrl from './full-gbif-logo-white.svg';
import gbcLogoUrl from './gbc.svg';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoVimeo } from 'react-icons/io5';
import { FaYoutube } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaMastodon } from 'react-icons/fa';

const cssSeparator = "after:g-content-['|'] after:g-p-2";

export function Footer() {
  return (
    <footer className="g-text-white">
      <section className="g-bg-[#686a68] g-py-6 g-px-4 g-text-sm">
        <nav>
          <ul className="g-flex g-justify-center g-w-full g-flex-wrap">
            <li className={cssSeparator}>
              <DynamicLink to="/what-is-gbif">
                <FormattedMessage id="footer.whatIsGbif" defaultMessage="What is GBIF?" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/developer/summary">
                <FormattedMessage id="footer.api" defaultMessage="API" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/faq">
                <FormattedMessage id="footer.faq" defaultMessage="FAQ" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/newsletters">
                <FormattedMessage id="footer.newsletter" defaultMessage="Newsletter" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/terms/privacy-policy">
                <FormattedMessage id="footer.privacy" defaultMessage="Privacy" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/terms">
                <FormattedMessage id="footer.terms" defaultMessage="Terms and agreements" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/citation-guidelines">
                <FormattedMessage id="footer.citation" defaultMessage="Citation" />
              </DynamicLink>
            </li>
            <li className={cssSeparator}>
              <DynamicLink to="/code-of-conduct">
                <FormattedMessage id="footer.codeOfConduct" defaultMessage="Code of Conduct" />
              </DynamicLink>
            </li>
            <li>
              <DynamicLink to="/acknowledgements">
                <FormattedMessage id="footer.acknowledgements" defaultMessage="Acknowledgements" />
              </DynamicLink>
            </li>
          </ul>
          <address className="g-pt-4 g-not-italic g-flex g-w-full g-justify-center g-flex-wrap">
            <DynamicLink to="/contact-us" className={cssSeparator}>
              <FormattedMessage id="footer.contact" defaultMessage="Contact" />
            </DynamicLink>
            <span className="g-font-semibold">GBIF Secretariat&nbsp;</span>
            <span className={cssSeparator}>Universitetsparken 15</span>
            <span className={cssSeparator}>DK-2100 Copenhagen Ø</span>
            <span>Denmark</span>
          </address>
        </nav>
      </section>
      <section className="g-bg-[#5b5b5b] g-flex g-w-full g-justify-center g-py-6 g-px-6 g-text-sm">
        <DynamicLink to="/news/6PHdgoyIF6RmI7u4VOouuD" className="g-flex g-items-center">
          <img src={gbcLogoUrl} className="g-h-10 g-p-r-6" />
          <span className="g-pl-4">
            <span className="g-font-semibold">GBIF</span> is a Global Core Biodata Resource
          </span>
        </DynamicLink>
      </section>
      <section className="g-bg-[#414141] g-text-[#414141] g-py-6 g-px-6">
        <ul className="g-flex g-w-full g-justify-center g-items-center g-gap-5 g-flex-wrap">
          <li>
            <a
              href="https://www.facebook.com/gbifnews"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <FaFacebookF />
            </a>
          </li>
          <li>
            <a
              href="https://biodiversity.social/@gbif"
              rel="me"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <FaMastodon size={18} />
            </a>
          </li>
          <li>
            <a
              href="https://x.com/GBIF"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <FaXTwitter />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/gbif"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <FaLinkedinIn />
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/user/GBIFvideo"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <FaYoutube size={20} />
            </a>
          </li>
          <li>
            <a
              href="https://vimeo.com/gbif"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <IoLogoVimeo size={18} />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/gbifs/"
              className="g-w-8 g-h-8 g-bg-white g-rounded-full g-flex g-justify-center g-items-center"
            >
              <FiInstagram />
            </a>
          </li>
        </ul>
      </section>
      <section className="g-bg-[#222222] g-py-6 g-px-6 g-flex g-justify-center g-w-full">
        <img className="g-h-[40px]" src={gbifLogoUrl} />
      </section>
    </footer>
  );
}
