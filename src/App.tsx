import { useState, useRef, FormEvent } from 'react';
import { Select } from './components/Select';
import { PEOPLE, PEOPLE_RICH, COUNTRIES } from './data';
import { Section, CaseGrid, Case } from './helpers';
import './App.css';

const HINT = (
  <>
    Standard hint message below the control with very{' '}
    <a href="#">long text</a> that consists of a large number of various characters.
  </>
);

export default function App() {
  const [country, setCountry] = useState<string | null>(null);
  const [person, setPerson] = useState<string>('arielle');

  const [formCountry, setFormCountry] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formSelectRef = useRef<HTMLButtonElement>(null);

  const [controlledPerson, setControlledPerson] = useState<string | null>(null);

  const [formWithoutNameCountry, setFormWithoutNameCountry] = useState<string | null>(null);
  const [formWithoutNameResult, setFormWithoutNameResult] = useState<string | null>(null);
  const [formWithNameResult, setFormWithNameResult] = useState<string | null>(null);

  function handleFormSubmit() {
    if (!formCountry) {
      setFormSubmitted(true);
      formSelectRef.current?.focus();
      return;
    }
    setFormSubmitted(false);
    alert(`Wysłano: ${formCountry}`);
  }

  function handleFormWithoutNameSubmit(e: FormEvent) {
    e.preventDefault();
    setFormWithoutNameResult(formWithoutNameCountry);
  }

  function handleFormWithNameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setFormWithNameResult(data.get('country') as string | null);
  }

  return (
    <div className="appRoot">
      <header className="appHeader">
        <div className="appHeaderInner">
          <span className="appLogo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#bd004f" />
              <path d="M6 17V7h3l3 6 3-6h3v10h-2.5v-6.5L13 17h-2l-2.5-6.5V17H6z" fill="#fff" />
            </svg>
          </span>
          <span className="appTitle">Dropdown — showcase zadania rekrutacyjnego</span>
        </div>
      </header>

      <main className="appMain">

        {/* ── 1. Basic states ── */}
        <Section title="1. Stany podstawowe">
          <CaseGrid>
            <Case label="Bez wybranej wartości">
              <Select
                label="Label text example"
                tip="Krótki tekst pomocniczy dla tego pola"
                options={PEOPLE}
                placeholder="Placeholder text example"
                hint={HINT}
              />
            </Case>

            <Case label="Stan disabled">
              <Select
                label="Label text example"
                tip="Krótki tekst pomocniczy dla tego pola"
                options={PEOPLE}
                placeholder="Placeholder text example"
                disabled
                hint={HINT}
              />
            </Case>

            <Case label="Wybrana wartość (controlled)">
              <Select
                label="Label text example"
                tip="Krótki tekst pomocniczy dla tego pola"
                options={PEOPLE}
                value={person}
                onChange={setPerson}
                hint={HINT}
              />
            </Case>

            <Case label="Stan z błędem">
              <Select
                label="Label text example"
                tip="Krótki tekst pomocniczy dla tego pola"
                options={PEOPLE}
                placeholder="Placeholder text example"
                error='Imporant validation error'
                hint={HINT}
              />
            </Case>
          </CaseGrid>
        </Section>

        {/* ── 2. Custom content ── */}
        <Section title="2. Custom content w opcjach i triggerze">
          <CaseGrid>
            <Case label="Lista z avatarami i opisem">
              <Select
                label="Label text example"
                tip="Opcje mogą renderować dowolny ReactNode"
                options={PEOPLE_RICH}
                placeholder="Placeholder text example"
                hint="Każda opcja zawiera ikonkę, imię i email."
              />
            </Case>

            <Case label="Wybrana wartość z avatarem">
              <Select
                label="Label text example"
                tip="Wybrany element też pokazuje custom content"
                options={PEOPLE_RICH}
                defaultValue="antoine"
                hint="Trigger renderuje ten sam ReactNode co opcja."
              />
            </Case>
          </CaseGrid>
        </Section>

        {/* ── 3. Flip demo ── */}
        <Section title="3. Flip — otwieranie w górę przy granicy viewport">
          <p className="sectionDesc">
            Przewiń stronę w dół. Gdy trigger zbliży się do dolnej krawędzi okna,
            lista automatycznie otworzy się <strong>w górę</strong>.
          </p>
          <div className="flipScroll">
            <div className="flipSpacer" />
            <div className="flipAnchor">
              <Select
                label="Scroll demo — flip"
                tip="Ta lista otwiera się w górę gdy nie ma miejsca poniżej"
                options={COUNTRIES}
                value={country ?? undefined}
                onChange={setCountry}
                placeholder="Wybierz kraj..."
                hint="Spróbuj otworzyć gdy ten element jest blisko dołu okna."
              />
            </div>
            <div className="flipSpacer" />
          </div>
        </Section>

        {/* ── 4. Ref — programmatic focus ── */}
        <Section title="4. Ref — programmatic focus po walidacji">
          <p className="sectionDesc">
            Kliknij „Wyślij" bez wyboru kraju. Błąd walidacji przeniesie fokus
            bezpośrednio na trigger selecta — jak w prawdziwym formularzu.
          </p>
          <div className="demoFormWrapper">
            <Select
              ref={formSelectRef}
              label="Kraj wysyłki"
              tip="Pole wymagane"
              options={COUNTRIES}
              value={formCountry ?? undefined}
              onChange={setFormCountry}
              placeholder="Wybierz kraj..."
              error={formSubmitted && !formCountry ? 'Wybierz kraj przed wysłaniem' : undefined}
            />
            <button onClick={handleFormSubmit} className="demoBtn">
              Wyślij
            </button>
          </div>
        </Section>

        {/* ── 5. Controlled vs Uncontrolled ── */}
        <Section title="5. Controlled vs Uncontrolled">
          <CaseGrid>
            <Case label="Controlled — stan w rodzicu">
              <Select
                label="Wybierz osobę"
                options={PEOPLE}
                placeholder="Wybierz..."
                value={controlledPerson ?? undefined}
                onChange={setControlledPerson}
                hint="Rodzic trzyma stan. Wartość poniżej aktualizuje się natychmiast."
              />
              <p className="demoStateLabel">
                Stan w React: <strong>{controlledPerson ?? '—'}</strong>
              </p>
            </Case>

            <Case label="Uncontrolled — stan wewnętrzny">
              <Select
                label="Wybierz osobę"
                options={PEOPLE}
                placeholder="Wybierz..."
                defaultValue="lana"
                hint="Komponent sam zarządza stanem. Rodzic nie wie co jest wybrane."
              />
              <p className="demoStateLabel">
                Stan w React: <strong>niewidoczny dla rodzica</strong>
              </p>
            </Case>
          </CaseGrid>
        </Section>

        {/* ── 6. Form submission: with name vs without name ── */}
        <Section title="6. Form submission — z name vs bez name">
          <CaseGrid>
            <Case label="Z name — FormData odczytuje wartość automatycznie">
              <form onSubmit={handleFormWithNameSubmit} className="demoForm">
                <Select
                  label="Kraj"
                  options={COUNTRIES}
                  placeholder="Wybierz kraj..."
                  defaultValue="pl"
                  name="country"
                  hint="Select renderuje hidden <select name='country'> — FormData go widzi."
                />
                <button type="submit" className="demoBtn">Wyślij</button>
                {formWithNameResult !== null && (
                  <p className="demoResult">
                    FormData: <strong>{formWithNameResult || '(puste)'}</strong>
                  </p>
                )}
              </form>
            </Case>

            <Case label="Bez name — odczyt ręczny ze stanu (wymaga controlled)">
              <form onSubmit={handleFormWithoutNameSubmit} className="demoForm">
                <Select
                  label="Kraj"
                  options={COUNTRIES}
                  placeholder="Wybierz kraj..."
                  value={formWithoutNameCountry ?? undefined}
                  onChange={setFormWithoutNameCountry}
                  hint="Brak name — FormData nic nie widzi. Wartość żyje tylko w stanie React."
                />
                <button type="submit" className="demoBtn">Wyślij</button>
                {formWithoutNameResult !== null && (
                  <p className="demoResult">
                    Stan React: <strong>{formWithoutNameResult || '(puste)'}</strong>
                  </p>
                )}
              </form>
            </Case>
          </CaseGrid>
        </Section>

        {/* ── 7. Keyboard & a11y ── */}
        <Section title="7. Nawigacja klawiaturą (WAI-ARIA Listbox)">
          <div className="a11yTable">
            <div className="a11yRow"><kbd>↓</kbd> / <kbd>↑</kbd><span>Nawigacja po opcjach</span></div>
            <div className="a11yRow"><kbd>Enter</kbd> / <kbd>Space</kbd><span>Wybór zaznaczonej opcji / otwarcie listy</span></div>
            <div className="a11yRow"><kbd>Home</kbd> / <kbd>End</kbd><span>Pierwsza / ostatnia opcja</span></div>
            <div className="a11yRow"><kbd>Escape</kbd><span>Zamknięcie listy, focus wraca na trigger</span></div>
            <div className="a11yRow"><kbd>Tab</kbd><span>Zamknięcie i przejście do kolejnego elementu</span></div>
            <div className="a11yRow"><kbd>a</kbd>–<kbd>z</kbd><span>Type-ahead: skocz do opcji po pierwszej literze</span></div>
          </div>
          <div className="demoSelectWrap">
            <Select
              label="Testuj klawiaturę"
              tip="Przejdź tabem i używaj strzałek"
              options={PEOPLE}
              placeholder="Placeholder text example"
              hint="Użyj Tab aby przejść na trigger, potem ↓ aby otworzyć listę."
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
