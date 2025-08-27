import { HelpText } from '@/components/helpText';

export function AboutContent() {
  return (
    <div>
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'what-is-a-participant'} includeTitle />
      </div>
    </div>
  );
}
