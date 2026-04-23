import { ReactNode } from 'react';
import type { SelectOption } from './components/Select';

export const PEOPLE: SelectOption[] = [
  { value: 'lana', label: 'Lana Travis' },
  { value: 'arielle', label: 'Arielle Bolton' },
  { value: 'dale', label: 'Dale Crawford' },
  { value: 'jamar', label: 'Jamar Cochran' },
  { value: 'madelyn', label: 'Madelyn Petersen' },
  { value: 'carly', label: 'Carly Velez' },
  { value: 'reina', label: 'Reina Pitts' },
  { value: 'antonio', label: 'Antonio Bullock', disabled: true },
  { value: 'josue', label: 'Josue Nguyen', disabled: true },
];

const PersonOption = ({ name, email }: { name: string; email: string }): ReactNode => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: '#eaebee', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#737373">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </span>
    <span>
      <span style={{ display: 'block', fontSize: 14, color: '#2e2e2e' }}>{name}</span>
      <span style={{ display: 'block', fontSize: 12, color: '#737373' }}>{email}</span>
    </span>
  </span>
);

export const PEOPLE_RICH: SelectOption[] = [
  { value: 'william', label: 'William Montgomery', content: <PersonOption name="William Montgomery" email="w.montgomery@bank.pl" /> },
  { value: 'emily', label: 'Emily Arnold', content: <PersonOption name="Emily Arnold" email="e.arnold@bank.pl" /> },
  { value: 'antoine', label: 'Antoine Pope', content: <PersonOption name="Antoine Pope" email="a.pope@bank.pl" /> },
  { value: 'maria', label: 'Maria Santos', content: <PersonOption name="Maria Santos" email="m.santos@bank.pl" /> },
];

export const COUNTRIES: SelectOption[] = [
  { value: 'pl', label: 'Polska' },
  { value: 'de', label: 'Niemcy' },
  { value: 'fr', label: 'Francja' },
  { value: 'uk', label: 'Wielka Brytania' },
  { value: 'us', label: 'Stany Zjednoczone' },
  { value: 'es', label: 'Hiszpania' },
  { value: 'it', label: 'Włochy' },
];
