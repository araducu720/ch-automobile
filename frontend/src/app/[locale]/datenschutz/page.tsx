import type { Metadata } from 'next';
import { SITE_NAME, COMPANY_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: `Datenschutzerklärung von ${SITE_NAME}.`,
};

export default function DatenschutzPage() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>

        <div className="prose-custom space-y-8">
          <section>
            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2>2. Verantwortliche Stelle</h2>
            <p>
              <strong>{SITE_NAME}</strong><br />
              {COMPANY_INFO.street}<br />
              {COMPANY_INFO.zip} {COMPANY_INFO.city}<br />
              Telefon: {COMPANY_INFO.phone}<br />
              E-Mail: {COMPANY_INFO.email}
            </p>
          </section>

          <section>
            <h2>3. Datenerfassung auf dieser Website</h2>
            <h3>Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf
              Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher
              und sicherer zu machen.
            </p>
            <h3>Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten
              Server-Log-Dateien, die Ihr Browser automatisch übermittelt.
            </p>
          </section>

          <section>
            <h2>4. Kontaktformular</h2>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
              Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
              Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <p>
              Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt somit
              ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          </section>

          <section>
            <h2>5. Newsletter</h2>
            <p>
              Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir
              von Ihnen eine E-Mail-Adresse. Die Datenverarbeitung zum Zwecke des
              Newsletter-Versands erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          </section>

          <section>
            <h2>6. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul>
              <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
              <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
              <li>Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen</li>
              <li>Die Einschränkung der Datenverarbeitung zu verlangen</li>
              <li>Datenübertragbarkeit zu verlangen</li>
              <li>Sich bei einer Aufsichtsbehörde zu beschweren</li>
            </ul>
          </section>

          <section>
            <h2>7. SSL- bzw. TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
              Inhalte eine SSL- bzw. TLS-Verschlüsselung.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
