'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Link2, Linkedin, ListTree, MessageCircle, Send, Twitter } from 'lucide-react';
import type { TocEntry } from '../../types/blog';
import { recordArticleView } from '../../modules/site/articleViews';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

/** Counts this opening of the article, once the page is in the visitor's browser. */
export const ArticleViewTracker: React.FC<{ id: number }> = ({ id }) => {
  const sent = useRef<number | null>(null);
  useEffect(() => {
    // Development runs effects twice; one opening is one view
    if (sent.current === id) return;
    sent.current = id;
    recordArticleView(id);
  }, [id]);
  return null;
};

/** A thin gold bar along the top of the window showing how far into the article the reader is. */
export const ReadingProgress: React.FC<{ targetId: string; label: string }> = ({ targetId, label }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = target.getBoundingClientRect();
      const span = height - window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, span > 0 ? -top / span : 1)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent"
    >
      <div className="h-full origin-[var(--origin)] bg-gradient-to-r from-gold-deep-fill via-gold-fill to-brand-fill [--origin:right] ltr:[--origin:left]" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
};

/** The article's headings; the one being read is marked. */
export const TableOfContents: React.FC<{ items: TocEntry[]; title: string; collapsible?: boolean; dir?: 'rtl' | 'ltr'; lang?: string }> = ({ items, title, collapsible, dir, lang }) => {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-90px 0px -65% 0px' },
    );
    items.forEach((item) => {
      const heading = document.getElementById(item.id);
      if (heading) observer.observe(heading);
    });
    return () => observer.disconnect();
  }, [items]);

  const list = (
    // In the body's own direction: an untranslated article's headings are in its original language
    <ol dir={dir} lang={lang} className="space-y-0.5 border-s border-ink/10">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? 'location' : undefined}
              className={`-ms-px block border-s-2 py-1.5 text-[13px] leading-6 transition-colors ${FOCUS} ${item.level === 3 ? 'ps-7' : 'ps-4'} ${
                current ? 'border-gold-line font-bold text-ink-strong' : 'border-transparent text-ink-muted hover:text-ink-strong'
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (collapsible) {
    return (
      <details className="group rounded-2xl border border-ink/10 bg-surface p-4">
        <summary className={`flex cursor-pointer list-none items-center gap-2 text-sm font-black text-ink ${FOCUS}`}>
          <ListTree aria-hidden="true" className="h-4 w-4 text-gold" />
          {title}
          <span aria-hidden="true" className="ms-auto text-ink-dim transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <nav aria-label={title} className="mt-4">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label={title}>
      <p className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
        <ListTree aria-hidden="true" className="h-4 w-4 text-gold" />
        {title}
      </p>
      {list}
    </nav>
  );
};

/** Share links for the messengers people here use, plus copying the address. */
export const ShareButtons: React.FC<{ url: string; title: string; labels: { share: string; copy: string; copied: string } }> = ({ url, title, labels }) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const targets = [
    { name: 'Telegram', icon: Send, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];
  const button = `flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-brand hover:bg-brand-fill hover:text-on-accent ${FOCUS}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="me-1 text-sm font-black text-ink">{labels.share}</span>
      {targets.map(({ name, icon: Icon, href }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${labels.share}: ${name}`} title={name} className={button}>
          <Icon aria-hidden="true" className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        aria-label={copied ? labels.copied : labels.copy}
        title={copied ? labels.copied : labels.copy}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt(labels.copy, url);
          }
        }}
        className={button}
      >
        {copied ? <Check aria-hidden="true" className="h-4 w-4 text-brand" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? labels.copied : ''}
      </span>
    </div>
  );
};
