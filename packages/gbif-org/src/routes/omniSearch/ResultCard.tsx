import { MdLink } from 'react-icons/md';
import { SearchResult } from './search';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="g-bg-white g-rounded-lg g-shadow-sm g-border g-border-gray-100 g-p-4 hover:g-shadow-md g-transition-shadow">
      <div className="g-flex g-gap-4">
        {result.thumbnail && (
          <img
            src={result.thumbnail}
            alt={result.title}
            className="g-w-24 g-h-24 g-object-cover g-rounded-md"
          />
        )}
        <div className="g-flex-1">
          <div className="g-flex g-items-start g-justify-between">
            <h3 className="g-text-lg g-font-semibold g-text-gray-900">{result.title}</h3>
            <span className="g-px-3 g-py-1 g-rounded-full g-text-sm g-font-medium g-capitalize g-bg-primary-100 g-text-primary-800">
              {result.type}
            </span>
          </div>
          <p className="g-mt-2 g-text-gray-600 g-line-clamp-2">{result.description}</p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="g-mt-2 g-inline-flex g-items-center g-text-primary-600 hover:g-text-primary-700"
          >
            View details
            <MdLink className="g-ml-1 g-h-4 g-w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
