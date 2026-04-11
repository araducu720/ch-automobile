import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'AGB',
  description: `Allgemeine Geschäftsbedingungen von ${SITE_NAME}.`,
};

export default function AGBPage() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="prose-custom space-y-8">
          <section>
            <h2>§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Kaufverträge, die zwischen
              {SITE_NAME} (nachfolgend &quot;Verkäufer&quot;) und dem Käufer geschlossen werden.
            </p>
          </section>

          <section>
            <h2>§ 2 Vertragsschluss</h2>
            <p>
              Die Darstellung der Fahrzeuge auf unserer Website stellt kein rechtlich bindendes
              Angebot, sondern eine unverbindliche Aufforderung zur Abgabe einer Bestellung dar.
            </p>
            <p>
              Durch Absenden einer Anfrage oder Reservierung geben Sie ein verbindliches
              Kaufinteresse ab. Der Kaufvertrag kommt erst durch unsere ausdrückliche schriftliche
              Bestätigung zustande.
            </p>
          </section>

          <section>
            <h2>§ 3 Preise und Zahlung</h2>
            <p>
              Alle angegebenen Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer
              (sofern nicht als &quot;MwSt. nicht ausweisbar&quot; gekennzeichnet).
            </p>
            <p>
              Die Zahlung erfolgt per Banküberweisung. Eine Reservierung erfordert eine Anzahlung
              von mindestens 10% des Kaufpreises (mindestens €500).
            </p>
          </section>

          <section>
            <h2>§ 4 Reservierung</h2>
            <p>
              Eine Reservierung ist nach Eingang der Anzahlung auf unserem Konto für 72 Stunden
              gültig. Bei Nichterfüllung des Kaufvertrags innerhalb der vereinbarten Frist kann die
              Anzahlung einbehalten werden.
            </p>
          </section>

          <section>
            <h2>§ 5 Gewährleistung</h2>
            <p>
              Für Gebrauchtfahrzeuge gelten die gesetzlichen Gewährleistungsfristen. Die
              Gewährleistungsfrist beträgt bei Verbrauchern 12 Monate ab Übergabe des Fahrzeugs.
            </p>
          </section>

          <section>
            <h2>§ 6 Haftung</h2>
            <p>
              Die Haftung des Verkäufers für leicht fahrlässige Pflichtverletzungen ist
              ausgeschlossen, sofern diese keine vertragswesentlichen Pflichten, Schäden aus der
              Verletzung des Lebens, des Körpers oder der Gesundheit betreffen.
            </p>
          </section>

          <section>
            <h2>§ 7 Datenschutz</h2>
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{' '}
              <Link href="/datenschutz" className="text-brand hover:underline">Datenschutzerklärung</Link>.
            </p>
          </section>

          <section>
            <h2>§ 8 Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Friedberg
              (Hessen), sofern der Käufer Kaufmann ist.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
