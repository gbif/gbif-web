import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { Html } from './html';

const render = (element: React.ReactElement) => renderToStaticMarkup(element);

describe('Html', () => {
  test('renders sanitised HTML, keeping inline formatting', () => {
    expect(
      render(<Html html='<i>Puma concolor</i> (Linnaeus, 1771)<img src=x onerror="alert(1)">' />)
    ).toBe('<span><i>Puma concolor</i> (Linnaeus, 1771)</span>');
  });

  test('renders the fallback as text, never as HTML', () => {
    expect(render(<Html html={null} fallback='<img src=x onerror="alert(1)">' />)).toBe(
      '<span>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</span>'
    );
    expect(render(<Html html="" fallback="Puma concolor" />)).toBe('<span>Puma concolor</span>');
  });

  test('renders nothing when there is neither html nor a fallback', () => {
    expect(render(<Html html={undefined} />)).toBe('');
  });

  test('passes element and attributes through', () => {
    expect(render(<Html as="div" className="x" dir="auto" html="<b>a</b>" />)).toBe(
      '<div class="x" dir="auto"><b>a</b></div>'
    );
  });
});
