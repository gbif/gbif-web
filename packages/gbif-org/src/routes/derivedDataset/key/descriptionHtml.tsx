// The html is rendered and sanitized by the graphql api (see the descriptionHtml field), so it is safe to inject
export function DescriptionHtml({ html }: { html: string }) {
  return (
    <div
      className="g-break-all g-bg-slate-100 g-p-2 g-rounded g-font-[monospace] [&_a]:g-underline [&_:is(h3,h4,h5,h6)]:g-text-base [&_:is(h3,h4,h5,h6)]:g-font-bold [&_p:not(:last-child)]:g-mb-2 [&_ul]:g-list-disc [&_ol]:g-list-decimal [&_ul]:g-ps-5 [&_ol]:g-ps-5 [&_code]:g-bg-slate-200 [&_code]:g-rounded [&_code]:g-px-1 [&_pre]:g-bg-slate-800 [&_pre]:g-text-slate-100 [&_pre]:g-rounded [&_pre]:g-p-3 [&_pre]:g-overflow-x-auto [&_pre_code]:g-bg-transparent [&_pre_code]:g-p-0 [&_pre_code]:g-text-inherit"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
