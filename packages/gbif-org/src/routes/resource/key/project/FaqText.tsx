import { useEffect, useState } from 'react';
import { HelpText } from './HelpText';

export function FaqText({ dangerouslySetBody: html }: { dangerouslySetBody: string }) {
  const [modal, setModal] = useState<any>(false);
  const [timer, setTimer] = useState<any>(null);
  const [modalVisible, showModal] = useState(false);

  // 1 second after modal is set to false, then set new state to hidden
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
    const elements = document.querySelectorAll('a[href*="/faq?"]');

    // filter the faqLinks to only include the ones that have the search params question and inline=true
    const faqLinks = Array.from(elements).filter((link) => {
      if (!link?.href) return; // TODO @daniel - i struggle with typescript, how do i fix this?
      const url = new URL(link.href);
      return url.searchParams.has('question') && url.searchParams.get('inline') === 'true';
    });

    const mouseoverHandler:EventListener = e => {
      const element = e.target as HTMLAnchorElement;
      const url = new URL(element.href);
      const question = url.searchParams.get('question');
      setModal({question});
      showModal(true);
    }

    const mouseleaveHandler:EventListener = e => {
      setModal(false);
    }

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
      <div area-hidden="true" tabIndex={-1}
        onMouseMove={(e) => {
          clearTimeout(timer)
          showModal(true);
        }} onMouseLeave={e => showModal(false)}
        style={{visibility: modalVisible ? 'visible' : 'hidden'}}
        className={`fixed max-h-[calc(100vh_-_6rem)] box-content bg-white w-[32rem] hover:w-[32rem] max-w-full z-[100] opacity-${modal ? '100' : '0'} transition-opacity duration-500 md:hover:opacity-100 overflow-auto shadow-2xl rounded border border-slate-200 prose end-0 md:end-6 bottom-0 md:bottom-6`}>
        <HelpText identifier={modal.question} includeTitle className="p-4" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
