'use client';

import { useState } from 'react';

/**
 * A YouTube Short behind a click-to-play cover.
 *
 * Nothing loads from YouTube until the visitor presses play: the cover is our own image
 * (public/videos/), and only the tap swaps in the player, from youtube-nocookie.com. That keeps the
 * page fast and keeps the site's rule that a visit does not contact Google by itself (fonts and store
 * badges are served from loxymity.com for the same reason). The Privacy Policy (2.9 + providers)
 * says what YouTube receives once a video plays — keep that text if this component goes.
 *
 * The cover is a link to the Short on YouTube, so it still works with JavaScript off.
 * The player needs a Referer (YouTube refuses embeds without one): the site's
 * strict-origin-when-cross-origin policy sends the origin only.
 */
export function VideoShort({ id, poster, title }: { id: string; poster: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-dark-surface shadow-2xl">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <a
          href={`https://www.youtube.com/shorts/${id}`}
          onClick={(e) => { e.preventDefault(); setPlaying(true); }}
          className="group absolute inset-0 block"
          aria-label={`Play video: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" width={540} height={960} loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
          <span
            className="absolute left-1/2 top-[70%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform duration-200 group-hover:scale-105"
            aria-hidden="true"
          >
            <svg className="ml-1 h-7 w-7 text-dark-bg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" /></svg>
          </span>
          <span className="absolute inset-x-0 bottom-4 text-center text-[11px] text-white/80" aria-hidden="true">
            Plays from YouTube
          </span>
        </a>
      )}
    </div>
  );
}
