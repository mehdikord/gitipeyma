import 'server-only';
import sanitizeHtml from 'sanitize-html';

/**
 * Article bodies are HTML from the panel's editor. They are cleaned when saved and again when shown,
 * so only what the editor can make reaches the page: no scripts, no event handlers, no frames, and
 * styles limited to alignment and colors.
 */

const SIZE = /^\d+(\.\d+)?(px|%)$/;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|var\(--tt-[a-z0-9-]+\))$/i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'span', 'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr',
    'img', 'figure', 'figcaption', 'table', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'sub', 'sup',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    th: ['colspan', 'rowspan', 'colwidth', 'style'],
    td: ['colspan', 'rowspan', 'colwidth', 'style'],
    col: ['style'],
    table: ['style'],
    mark: ['data-color', 'style'],
    span: ['style'],
    ol: ['start', 'type'],
    '*': ['style', 'dir'],
  },
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify|start|end)$/],
      color: [COLOR],
      'background-color': [COLOR],
      width: [SIZE],
      'min-width': [SIZE],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // Pictures come from this site's uploads or a full https address, never data: URIs
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    // Links out of the site open in a new tab and pass nothing back to it
    a: (tagName, attribs) => {
      const href = attribs.href ?? '';
      const external = /^https?:\/\//i.test(href);
      return {
        tagName,
        attribs: external ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' } : { href, ...(attribs.title ? { title: attribs.title } : {}) },
      };
    },
    b: 'strong',
    i: 'em',
    // The page title is the only h1; a pasted h1 becomes a section heading
    h1: 'h2',
  },
  // A picture whose address was removed as unsafe is dropped altogether
  exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
};

export const sanitizeArticleHtml = (html: string) => sanitizeHtml(html, OPTIONS).trim();

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));

/** The words of an article body, without its markup. */
export const htmlToText = (html: string) =>
  decodeEntities(html.replace(/<(br|\/p|\/h\d|\/li|\/td|\/th|\/blockquote|\/figcaption)\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();

/** True when the editor holds nothing a reader would see: no words and no pictures. */
export const isBlankHtml = (html: string) => !htmlToText(html) && !/<img\s/i.test(html);

/** About how long the article takes to read, at 200 words a minute; at least one minute. */
export const readingMinutes = (html: string) => {
  const words = htmlToText(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * The body ready for the article page: cleaned, its h2 and h3 given ids for the table of contents,
 * pictures loaded lazily and tables wrapped so they scroll sideways on a phone.
 */
export function prepareArticleHtml(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let prepared = sanitizeArticleHtml(html).replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, level: string, attrs: string, inner: string) => {
    const text = htmlToText(inner);
    if (!text) return `<h${level}${attrs}>${inner}</h${level}>`;
    const id = `section-${toc.length + 1}`;
    toc.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
  prepared = prepared
    .replace(/<img\s/gi, '<img loading="lazy" decoding="async" ')
    .replace(/<table/gi, '<div class="article-table"><table')
    .replace(/<\/table>/gi, '</table></div>');
  return { html: prepared, toc };
}

const TURKISH: Record<string, string> = { ı: 'i', İ: 'i', ş: 's', Ş: 's', ğ: 'g', Ğ: 'g', ç: 'c', Ç: 'c', ö: 'o', Ö: 'o', ü: 'u', Ü: 'u' };

/** A Latin address from a title ("Moving to Istanbul: 5 tips" → "moving-to-istanbul-5-tips"); empty if it has no Latin letters. */
export const slugify = (text: string) =>
  text
    .replace(/[ıİşŞğĞçÇöÖüÜ]/g, (char) => TURKISH[char])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
