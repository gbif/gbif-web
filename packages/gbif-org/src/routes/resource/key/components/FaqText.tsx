import { useEffect, useState } from 'react';
import { HelpText } from '../../../../components/HelpText';
import { cn } from '@/utils/shadcn';

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
          `max-h-[calc(100vh_-_6rem)] box-content bg-white w-[32rem] hover:w-[32rem] max-w-full]`,
          `z-[100] transition-opacity duration-500 md:hover:opacity-100 overflow-auto shadow-2xl`,
          `fixed rounded border border-slate-200 prose end-0 md:end-6 bottom-0 md:bottom-6`,
          modal ? 'opacity-100' : 'opacity-0'
        )}
      >
        {typeof modal === 'object' && typeof modal.question === 'string' && (
          <HelpText identifier={modal.question} includeTitle className="p-4" />
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
