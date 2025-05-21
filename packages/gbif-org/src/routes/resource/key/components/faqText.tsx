// this component helps with rendering pages with faq links like on this page article/6S38ZH4I85kHGHkBvpa02y/bid-2020-frequently-asked-questions
import { HelpText } from '@/components/helpText';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';

export function FaqText({ dangerouslySetBody: html }: { dangerouslySetBody: string }) {
  const [modal, setModal] = useState<boolean | { question: string | null }>(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [modalVisible, showModal] = useState(false);

  // 1 second after modal content is set to false, then hide the modal. This is to remove it from the screen so it doesn't pop on hover
  useEffect(() => {
    if (modal) return;
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      showModal(false);
    }, 1000);
    setTimer(timeout);
    return () => clearTimeout(timeout);
  }, [modal]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLAnchorElement>('a[href*="/faq?"]');

    // filter the faqLinks to only include the ones that have the search params question and inline=true
    const faqLinks = Array.from(elements).filter((link) => {
      if (!link.href) return;
      const url = new URL(link.href);
      return url.searchParams.has('question') && url.searchParams.get('inline') === 'true';
    });

    const mouseoverHandler: EventListener = (e) => {
      const element = e.target as HTMLAnchorElement;
      const url = new URL(element.href);
      const question = url.searchParams.get('question');
      setModal({ question });
      showModal(true);
    };

    const mouseleaveHandler: EventListener = () => {
      setModal(false);
    };

    faqLinks.forEach((element) => {
      element.addEventListener('mouseover', mouseoverHandler);
      element.addEventListener('mouseleave', mouseleaveHandler);
    });

    // remove event listeners when component unmounts
    return () => {
      faqLinks.forEach((element) => {
        element.removeEventListener('mouseover', mouseoverHandler);
        element.removeEventListener('mouseleave', mouseleaveHandler);
      });
    };
  }, [html]);

  return (
    <>
      <div
        area-hidden="true"
        tabIndex={-1}
        onMouseMove={() => {
          if (timer) clearTimeout(timer);
          showModal(true);
        }}
        onMouseLeave={() => showModal(false)}
        style={{ visibility: modalVisible ? 'visible' : 'hidden' }}
        className={cn(
          `g-max-h-[calc(100vh_-_6rem)] g-box-content g-bg-white g-w-[32rem] hover:g-w-[32rem] g-max-w-full]`,
          `g-z-[100] g-transition-opacity g-duration-500 md:hover:g-opacity-100 g-overflow-auto g-shadow-2xl`,
          `g-fixed g-rounded g-border g-border-solid g-border-slate-200 g-prose g-end-0 md:g-end-6 g-bottom-0 md:g-bottom-6`,
          modal ? 'g-opacity-100' : 'g-opacity-0'
        )}
      >
        {typeof modal === 'object' && typeof modal.question === 'string' && (
          <HelpText identifier={modal.question} includeTitle className="g-p-4" />
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
