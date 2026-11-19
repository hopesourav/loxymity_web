import { LogoFull } from '../_components/Logo';
import { StoreButtons } from '../_components/StoreButtons';

// Reached when a phone's CAMERA scans the code another Loxymity phone shows to link a phone
// (Loxymity repo: supabase/functions/_shared/childPairing.ts pairingLink, scanned in-app by
// app/(auth)/pair.tsx). The code only works inside the app's own scanner, so this page says that and
// offers the stores. It never reads, shows or sends the code in the fragment (`#…`).
export default function PairPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-dark-bg px-6 py-16 text-center">
      <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        <LogoFull className="text-3xl" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-dark-text">Open this code in Loxymity</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-dark-muted">
            This code links a phone to a Loxymity account. It works only inside the Loxymity app, not
            with the camera.
          </p>
        </div>
        <p className="text-[13px] leading-relaxed text-dark-muted">
          Install Loxymity on the phone being set up, open it and scan the code from there. Ask the
          person showing you the code if you are not sure.
        </p>
        <StoreButtons />
      </div>
    </main>
  );
}
