import { CircleCheck, PackageCheck, Wallet, LifeBuoy } from 'lucide-react';

/**
 * Split-card auth shell — the customer sibling of the admin login
 * (navy brand panel + white form panel).
 */
export function AuthShell({ feats, chip, sideTitle, sideText, head, title, sub, children, alt }) {
  return (
    <div className="bs-container">
      <div className="bs-auth">
        <div className="bs-auth-side">
          <div className="bs-auth-side-inner">
            <div className="bs-auth-logo">
              <img src="/assets/images/btcmlai-logo.png" alt="BTCMLTAI" width={104} height={104} />
            </div>
            <h2>{sideTitle}</h2>
            <p>{sideText}</p>
            <ul className="bs-auth-feats">
              {feats.map((f) => {
                const Icon = f.icon || CircleCheck;
                return (
                  <li key={f.text}>
                    <Icon size={17} aria-hidden="true" />
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
            <span className="bs-auth-chip">{chip}</span>
          </div>
        </div>

        <div className="bs-auth-form">
          <div className="bs-auth-form-head">{head}</div>
          <h1 className="bs-auth-title">{title}</h1>
          {sub ? <p className="bs-auth-sub">{sub}</p> : null}
          {children}
          {alt ? <p className="bs-auth-alt">{alt}</p> : null}
        </div>
      </div>
    </div>
  );
}

export const DEFAULT_FEATS = [
  { icon: PackageCheck, text: 'Track every order in one place' },
  { icon: Wallet, text: 'Instant digital delivery with setup files' },
  { icon: LifeBuoy, text: 'Support replies within 2–3 hours' },
];

export function AuthHead({ icon: Icon, children }) {
  return (
    <>
      <Icon size={16} aria-hidden="true" />
      <span>{children}</span>
    </>
  );
}