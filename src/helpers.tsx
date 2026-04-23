import { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h2 className="sectionTitle">{title}</h2>
      {children}
    </section>
  );
}

export function CaseGrid({ children }: { children: ReactNode }) {
  return <div className="caseGrid">{children}</div>;
}

export function Case({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="case">
      <p className="caseLabel">{label}</p>
      {children}
    </div>
  );
}
