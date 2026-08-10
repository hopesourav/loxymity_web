'use client';

import { useEffect, useState } from 'react';

const ROTATE_MS = 3400;
const SCENES = ['map', 'sos', 'geofence', 'activity'] as const;

function MapBackdrop() {
  return (
    <>
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
        backgroundSize: '22px 22px',
      }} />
      <div className="absolute top-[41%] left-0 right-0 h-[2px]" style={{ backgroundColor: '#1a1d24' }} />
      <div className="absolute top-[70%] left-0 right-0 h-[2px]" style={{ backgroundColor: '#1a1d24' }} />
      <div className="absolute left-[27%] top-0 bottom-0 w-[2px]" style={{ backgroundColor: '#1a1d24' }} />
      <div className="absolute left-[63%] top-0 bottom-0 w-[2px]" style={{ backgroundColor: '#1a1d24' }} />
    </>
  );
}

/* ── Scene 1: Live map ─────────────────────────────────────────── */
function SceneMap() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <p className="text-dark-text font-bold text-[11px] leading-tight">Family Circle</p>
          <p className="text-dark-muted text-[10px] leading-tight">4 members · all active</p>
        </div>
        <div className="flex -space-x-2">
          {[['S', '#C9A227'], ['A', '#5C8F6B'], ['R', '#C08B3E'], ['M', '#B5453F']].map(([init, col]) => (
            <div key={init} className="w-6 h-6 rounded-full border border-[#070d19] flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: col }}>{init}</div>
          ))}
        </div>
      </div>
      <div className="h-[150px] relative overflow-hidden" style={{ backgroundColor: '#0d0f13' }}>
        <MapBackdrop />
        <div className="absolute" style={{ top: '30%', left: '34%' }}>
          <div className="absolute rounded-full" style={{ width: 28, height: 28, top: -11, left: -11, backgroundColor: 'rgba(201,162,39,0.18)', animation: 'beacon-ring 2.4s ease-out infinite' }} />
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/25" style={{ backgroundColor: '#C9A227' }} />
        </div>
        <div className="absolute w-3 h-3 rounded-full" style={{ top: '58%', left: '61%', backgroundColor: '#5C8F6B' }} />
        <div className="absolute w-3 h-3 rounded-full" style={{ top: '39%', left: '15%', backgroundColor: '#C08B3E' }} />
        <div className="absolute text-[8px] text-dark-muted rounded-md px-1.5 py-0.5" style={{ top: '15%', left: '37%', backgroundColor: 'rgba(20,23,29,0.88)', border: '1px solid rgba(38,43,51,0.6)' }}>Home</div>
      </div>
      <div className="flex flex-col gap-1.5 px-3 py-3 flex-1">
        {[
          { name: 'Sourav', place: 'Home', time: 'Just now', color: '#C9A227', bat: 82 },
          { name: 'Ananya', place: 'Office', time: '3 min ago', color: '#5C8F6B', bat: 61 },
          { name: 'Rohan', place: 'School', time: '7 min ago', color: '#C08B3E', bat: 34 },
        ].map((m) => {
          const bc = m.bat > 50 ? '#5C8F6B' : m.bat > 20 ? '#C08B3E' : '#B5453F';
          const bb = m.bat > 50 ? 'rgba(92,143,107,0.12)' : m.bat > 20 ? 'rgba(192,139,62,0.12)' : 'rgba(181,69,63,0.12)';
          return (
            <div key={m.name} className="bg-dark-surface rounded-xl px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: m.color }}>{m.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-dark-text text-[11px] font-semibold leading-tight">{m.name}</p>
                <p className="text-dark-muted text-[10px] leading-tight">{m.place}</p>
              </div>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: bc, backgroundColor: bb }}>{m.bat}%</span>
              <p className="text-[9px]" style={{ color: '#5A5F68' }}>{m.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scene 2: SOS alert ────────────────────────────────────────── */
function SceneSos() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-[150px] relative overflow-hidden" style={{ backgroundColor: '#0d0f13' }}>
        <MapBackdrop />
        <div className="absolute" style={{ top: '46%', left: '50%' }}>
          <div className="absolute rounded-full" style={{ width: 48, height: 48, top: -24, left: -24, backgroundColor: 'rgba(181,69,63,0.22)', animation: 'beacon-ring 1.8s ease-out infinite' }} />
          <div className="absolute rounded-full" style={{ width: 30, height: 30, top: -15, left: -15, backgroundColor: 'rgba(181,69,63,0.3)', animation: 'beacon-ring 1.8s ease-out infinite', animationDelay: '0.6s' }} />
          <div className="w-4 h-4 rounded-full border-2 border-white/40 flex items-center justify-center -ml-2 -mt-2" style={{ backgroundColor: '#B5453F' }} />
        </div>
      </div>
      <div className="flex-1 px-3 py-3 flex flex-col gap-2">
        <div className="rounded-xl px-3 py-3" style={{ backgroundColor: 'rgba(181,69,63,0.1)', border: '1px solid rgba(181,69,63,0.35)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B5453F' }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: '#E07B75' }}>SOS · Rohan needs help</p>
              <p className="text-dark-muted text-[9px]">Elgin Road · 12 sec ago</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="flex-1 text-center text-[10px] font-bold text-white rounded-lg py-1.5" style={{ backgroundColor: '#B5453F' }}>Call now</div>
            <div className="flex-1 text-center text-[10px] font-semibold text-dark-text rounded-lg py-1.5 bg-dark-surface border border-dark-border">Directions</div>
          </div>
        </div>
        <p className="text-dark-muted text-[9px] text-center">Every circle member was alerted instantly — with exact GPS.</p>
      </div>
    </div>
  );
}

/* ── Scene 3: Geofence arrival ─────────────────────────────────── */
function SceneGeofence() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-[150px] relative overflow-hidden" style={{ backgroundColor: '#0d0f13' }}>
        <MapBackdrop />
        <div className="absolute rounded-full" style={{ width: 74, height: 74, top: '26%', left: '42%', border: '1.5px dashed rgba(95,130,165,0.5)', backgroundColor: 'rgba(95,130,165,0.08)' }} />
        <div className="absolute" style={{ top: '46%', left: '55%' }}>
          <div className="absolute rounded-full" style={{ width: 26, height: 26, top: -11, left: -11, backgroundColor: 'rgba(92,143,107,0.2)', animation: 'beacon-ring 2.4s ease-out infinite' }} />
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/25" style={{ backgroundColor: '#5C8F6B' }} />
        </div>
        <div className="absolute text-[8px] text-accent-cyan rounded-md px-1.5 py-0.5" style={{ top: '20%', left: '40%', backgroundColor: 'rgba(20,23,29,0.9)', border: '1px solid rgba(95,130,165,0.4)' }}>School</div>
      </div>
      <div className="flex-1 px-3 py-3 flex flex-col gap-2">
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 bg-dark-surface border border-dark-border">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(92,143,107,0.14)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#5C8F6B" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-dark-text text-[11px] font-semibold leading-tight">Rohan arrived at School</p>
            <p className="text-dark-muted text-[9px] leading-tight">Geofence · 3:24 PM</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 bg-dark-surface border border-dark-border opacity-70">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,162,39,0.14)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#C9A227" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-dark-text text-[11px] font-semibold leading-tight">Ananya left Office</p>
            <p className="text-dark-muted text-[9px] leading-tight">Geofence · 3:02 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 4: Activity feed ────────────────────────────────────── */
function SceneActivity() {
  const rows = [
    { c: '#5C8F6B', t: 'Ananya checked in safe', s: 'Just now', p: 'M9 12.75L11.25 15 15 9.75' },
    { c: '#5F82A5', t: 'Rohan entered School zone', s: '3:24 PM', p: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' },
    { c: '#C9A227', t: 'Sourav asked Alexa “where’s Rohan?”', s: '2:10 PM', p: 'M12 18.75a6 6 0 006-6v-1.5' },
    { c: '#C08B3E', t: 'Rohan’s battery low (34%)', s: '1:48 PM', p: 'M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25' },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2">
        <p className="text-dark-text font-bold text-[11px]">Activity</p>
        <p className="text-dark-muted text-[10px]">Everything, as it happens</p>
      </div>
      <div className="flex-1 px-3 pb-3 flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.t} className="bg-dark-surface rounded-xl px-2.5 py-2 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.c}22` }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke={r.c} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={r.p} /></svg>
            </div>
            <p className="flex-1 min-w-0 text-dark-text text-[10px] font-medium leading-snug truncate">{r.t}</p>
            <p className="text-[9px] flex-shrink-0" style={{ color: '#5A5F68' }}>{r.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCENE_LABEL: Record<(typeof SCENES)[number], string> = {
  map: 'Live map', sos: 'SOS alert', geofence: 'Place alerts', activity: 'Activity feed',
};

export function HeroPhoneCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % SCENES.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-[285px] mx-auto lg:mx-0">
      <div className="animate-float" style={{ willChange: 'transform' }}>
        <div className="absolute -inset-8 bg-primary/8 blur-3xl rounded-full" />
        {/* Chassis */}
        <div className="relative bg-dark-surface rounded-[3rem] p-[3px] ring-1 ring-dark-border shadow-2xl" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}>
          <div className="bg-[#070d19] rounded-[2.8rem] overflow-hidden">
            {/* Status bar */}
            <div className="h-9 flex items-center justify-between px-5 pt-2">
              <span className="text-dark-text text-[10px] font-semibold">9:41</span>
              <div className="w-14 h-[18px] bg-black rounded-full" />
              <div className="flex items-center gap-1.5 opacity-70">
                <svg className="w-3 h-3 text-dark-text" fill="currentColor" viewBox="0 0 10 12"><rect x="0" y="6.5" width="1.8" height="5.5" rx="0.4" /><rect x="2.7" y="4.5" width="1.8" height="7.5" rx="0.4" /><rect x="5.4" y="2.5" width="1.8" height="9.5" rx="0.4" /><rect x="8.1" y="0.5" width="1.8" height="11.5" rx="0.4" /></svg>
                <svg className="w-[18px] h-3 text-dark-text" fill="none" viewBox="0 0 20 12"><rect x="0.5" y="0.5" width="16.5" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.45" /><rect x="2" y="2" width="11.5" height="8" rx="1.5" fill="currentColor" fillOpacity="0.75" /><path d="M18 4v4a2 2 0 000-4z" fill="currentColor" fillOpacity="0.35" /></svg>
              </div>
            </div>

            {/* Rotating scene area (fixed height so the frame never jumps) */}
            <div className="relative h-[300px]">
              {SCENES.map((s, idx) => (
                <div
                  key={s}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
                  style={{ opacity: idx === i ? 1 : 0 }}
                  aria-hidden={idx !== i}
                >
                  {s === 'map' && <SceneMap />}
                  {s === 'sos' && <SceneSos />}
                  {s === 'geofence' && <SceneGeofence />}
                  {s === 'activity' && <SceneActivity />}
                </div>
              ))}
            </div>

            {/* Bottom tab bar */}
            <div className="h-12 border-t border-dark-border flex items-center justify-around px-3 pb-1">
              <svg className="w-[17px] h-[17px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25M3 17.25V6.75a1.125 1.125 0 01.622-1.06l4.125-2.063a1.125 1.125 0 011.006 0l4.5 2.25a1.125 1.125 0 001.006 0l4.125-2.063A1.125 1.125 0 0121 4.813V15.5a1.125 1.125 0 01-.622 1.06l-4.125 2.063a1.125 1.125 0 01-1.006 0l-4.5-2.25a1.125 1.125 0 00-1.006 0L3.622 18.44" /></svg>
              <svg className="w-[17px] h-[17px] text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12" /></svg>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(181,69,63,0.12)', border: '1px solid rgba(181,69,63,0.22)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#B5453F" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <svg className="w-[17px] h-[17px] text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              <svg className="w-[17px] h-[17px] text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scene indicator */}
      <div className="relative z-20 mt-6 flex items-center justify-center gap-2">
        {SCENES.map((s, idx) => (
          <button
            key={s}
            type="button"
            onClick={() => setI(idx)}
            aria-label={SCENE_LABEL[s]}
            aria-current={idx === i}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? 'w-5 bg-primary' : 'w-1.5 bg-dark-border hover:bg-dark-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}
