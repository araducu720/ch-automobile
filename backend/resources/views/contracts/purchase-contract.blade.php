<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Kaufvertrag – {{ $reservation->payment_reference }}</title>
    <style>
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
            font-size: 10pt;
            color: #1a1a1a;
            line-height: 1.5;
            padding: 15mm 20mm;
        }

        /* Header */
        .header {
            border-bottom: 3px solid #c8a864;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18pt;
            color: #1a1a1a;
            margin-bottom: 3px;
        }
        .header .subtitle {
            font-size: 9pt;
            color: #666;
        }
        .header .company-info {
            font-size: 8pt;
            color: #666;
            margin-top: 5px;
        }

        /* Contract title */
        .contract-title {
            text-align: center;
            margin: 25px 0;
        }
        .contract-title h2 {
            font-size: 16pt;
            color: #1a1a1a;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .contract-title .ref {
            font-size: 9pt;
            color: #888;
            margin-top: 3px;
        }

        /* Sections */
        .section {
            margin-bottom: 18px;
        }
        .section-title {
            font-size: 11pt;
            font-weight: bold;
            color: #c8a864;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 4px;
            margin-bottom: 10px;
        }

        /* Two-column layout */
        .two-col {
            width: 100%;
            border-collapse: collapse;
        }
        .two-col td {
            width: 50%;
            vertical-align: top;
            padding: 0 10px 0 0;
        }
        .two-col td:last-child {
            padding: 0 0 0 10px;
        }

        /* Info rows */
        .info-row {
            margin-bottom: 4px;
        }
        .info-label {
            font-size: 8pt;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-value {
            font-size: 10pt;
            font-weight: 600;
        }

        /* Vehicle details table */
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        .details-table td {
            padding: 5px 8px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 9.5pt;
        }
        .details-table td:first-child {
            color: #666;
            width: 40%;
        }
        .details-table td:last-child {
            font-weight: 600;
        }
        .details-table tr:last-child td { border-bottom: none; }

        /* Price highlight */
        .price-box {
            background: #faf6eb;
            border: 1px solid #c8a864;
            border-radius: 4px;
            padding: 12px 15px;
            margin: 15px 0;
        }
        .price-box .total-label { font-size: 9pt; color: #666; }
        .price-box .total-price {
            font-size: 16pt;
            font-weight: bold;
            color: #1a1a1a;
        }
        .price-box .deposit-info {
            font-size: 9pt;
            color: #c8a864;
            margin-top: 3px;
        }

        /* Terms */
        .terms {
            font-size: 8.5pt;
            color: #444;
            line-height: 1.6;
        }
        .terms ol {
            padding-left: 20px;
        }
        .terms ol li {
            margin-bottom: 8px;
        }
        .terms .term-title {
            font-weight: bold;
            color: #1a1a1a;
        }

        /* Signature area */
        .signatures {
            margin-top: 40px;
            page-break-inside: avoid;
        }
        .sig-table {
            width: 100%;
            border-collapse: collapse;
        }
        .sig-table td {
            width: 45%;
            vertical-align: top;
            padding: 0;
        }
        .sig-table td.spacer { width: 10%; }
        .sig-line {
            border-top: 1px solid #333;
            margin-top: 60px;
            padding-top: 5px;
        }
        .sig-label {
            font-size: 8pt;
            color: #888;
        }
        .sig-name {
            font-size: 9pt;
            font-weight: bold;
        }

        /* Company stamp area */
        .stamp-area {
            width: 120px;
            height: 60px;
            border: 1px dashed #ccc;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7pt;
            color: #ccc;
            text-align: center;
            padding: 5px;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 10mm;
            left: 20mm;
            right: 20mm;
            border-top: 1px solid #e5e5e5;
            padding-top: 5px;
            font-size: 7pt;
            color: #999;
            text-align: center;
        }

        /* Page break control */
        .no-break { page-break-inside: avoid; }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <h1>C-H Automobile &amp; Exclusive Cars</h1>
        <div class="subtitle">Premium-Fahrzeughandel · Seit 2005</div>
        <div class="company-info">
            {{ $company->street }} · {{ $company->postal_code }} {{ $company->city }} · {{ $company->country }}<br>
            Tel: {{ $company->phone }} · E-Mail: {{ $company->email }}
            @if($company->website) · {{ $company->website }}@endif
            <br>
            @if($company->tax_id)USt-IdNr.: {{ $company->tax_id }}@endif
            @if($company->trade_register) · {{ $company->trade_register }}@endif
        </div>
    </div>

    <!-- Contract Title -->
    <div class="contract-title">
        <h2>Kaufvertrag</h2>
        <div class="ref">Vertragsnr.: {{ $reservation->payment_reference }} · Datum: {{ $date }}</div>
    </div>

    <!-- Parties -->
    <div class="section">
        <div class="section-title">§ 1 Vertragsparteien</div>
        <table class="two-col">
            <tr>
                <td>
                    <div class="info-row">
                        <div class="info-label">Verkäufer</div>
                        <div class="info-value">{{ $company->company_name ?? 'C-H Automobile & Exclusive Cars' }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Adresse</div>
                        <div class="info-value">{{ $company->full_address }}</div>
                    </div>
                    @if($company->tax_id)
                    <div class="info-row">
                        <div class="info-label">USt-IdNr.</div>
                        <div class="info-value">{{ $company->tax_id }}</div>
                    </div>
                    @endif
                </td>
                <td>
                    <div class="info-row">
                        <div class="info-label">Käufer</div>
                        <div class="info-value">{{ $reservation->customer_name }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Adresse</div>
                        <div class="info-value">
                            @if($reservation->billing_street){{ $reservation->billing_street }}, @endif
                            {{ $reservation->billing_postal_code }} {{ $reservation->billing_city }},
                            {{ $reservation->billing_country }}
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Kontakt</div>
                        <div class="info-value">{{ $reservation->customer_email }} · {{ $reservation->customer_phone }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Vehicle Details -->
    <div class="section no-break">
        <div class="section-title">§ 2 Vertragsgegenstand (Fahrzeug)</div>
        <table class="details-table">
            <tr><td>Marke / Modell</td><td>{{ $vehicle->brand }} {{ $vehicle->model }}@if($vehicle->variant) {{ $vehicle->variant }}@endif</td></tr>
            <tr><td>Baujahr</td><td>{{ $vehicle->year }}</td></tr>
            @if($vehicle->vin)<tr><td>Fahrgestell-Nr. (VIN)</td><td>{{ $vehicle->vin }}</td></tr>@endif
            @if($vehicle->registration_date)<tr><td>Erstzulassung</td><td>{{ $vehicle->registration_date->format('d.m.Y') }}</td></tr>@endif
            <tr><td>Kilometerstand</td><td>{{ number_format($vehicle->mileage, 0, ',', '.') }} km</td></tr>
            <tr><td>Kraftstoff</td><td>{{ ucfirst($vehicle->fuel_type) }}</td></tr>
            <tr><td>Getriebe</td><td>{{ ucfirst($vehicle->transmission) }}</td></tr>
            @if($vehicle->power_hp)<tr><td>Leistung</td><td>{{ $vehicle->power_hp }} PS ({{ $vehicle->power_kw }} kW)</td></tr>@endif
            @if($vehicle->color)<tr><td>Farbe (außen)</td><td>{{ ucfirst($vehicle->color) }}</td></tr>@endif
            @if($vehicle->interior_color)<tr><td>Innenausstattung</td><td>{{ ucfirst($vehicle->interior_color) }}</td></tr>@endif
            @if($vehicle->body_type)<tr><td>Karosserieform</td><td>{{ ucfirst($vehicle->body_type) }}</td></tr>@endif
            <tr><td>Zustand</td><td>{{ $vehicle->condition === 'new' ? 'Neu' : ($vehicle->condition === 'used' ? 'Gebraucht' : ucfirst($vehicle->condition)) }}</td></tr>
            @if($vehicle->emission_class)<tr><td>Emissionsklasse</td><td>{{ $vehicle->emission_class }}</td></tr>@endif
            @if($vehicle->tuv_until)<tr><td>TÜV bis</td><td>{{ $vehicle->tuv_until->format('m/Y') }}</td></tr>@endif
            @if($vehicle->previous_owners !== null)<tr><td>Vorbesitzer</td><td>{{ $vehicle->previous_owners }}</td></tr>@endif
            @if($vehicle->accident_free)<tr><td>Unfallfrei</td><td>Ja</td></tr>@endif
        </table>
    </div>

    <!-- Price -->
    <div class="section no-break">
        <div class="section-title">§ 3 Kaufpreis und Zahlungsbedingungen</div>
        <div class="price-box">
            <div class="total-label">Gesamtkaufpreis (inkl. MwSt.)</div>
            <div class="total-price">{{ $vehicle->formatted_price }}</div>
            <div class="deposit-info">
                Anzahlung: {{ number_format($reservation->deposit_amount, 2, ',', '.') }} € (Referenz: {{ $reservation->payment_reference }})
            </div>
        </div>
        <table class="details-table">
            <tr><td>Zahlungsart</td><td>Banküberweisung</td></tr>
            <tr><td>Bank</td><td>{{ $company->bank_name }}</td></tr>
            <tr><td>IBAN</td><td>{{ $company->bank_iban }}</td></tr>
            <tr><td>BIC</td><td>{{ $company->bank_bic }}</td></tr>
            <tr><td>Kontoinhaber</td><td>{{ $company->bank_account_holder }}</td></tr>
            <tr><td>Zahlungsfrist</td><td>{{ $reservation->reservation_expires_at->format('d.m.Y') }}</td></tr>
        </table>
    </div>

    <!-- Warranty & Insurance -->
    <div class="section no-break">
        <div class="section-title">§ 4 Gewährleistung und Garantie</div>
        <div class="terms">
            <ol>
                <li>
                    <span class="term-title">Gewährleistung:</span>
                    @if($vehicle->condition === 'new')
                        Für dieses Neufahrzeug gilt die gesetzliche Gewährleistungsfrist von 24 Monaten ab Übergabe gemäß §§ 437 ff. BGB.
                    @else
                        Für dieses Gebrauchtfahrzeug wird die Gewährleistungsfrist auf 12 Monate ab Übergabe beschränkt, soweit gesetzlich zulässig (§ 476 Abs. 2 BGB). Die Gewährleistung erstreckt sich auf Mängel, die zum Zeitpunkt der Übergabe bereits vorhanden waren.
                    @endif
                </li>
                <li>
                    <span class="term-title">Fahrzeuggarantie:</span>
                    @if($vehicle->warranty)
                        Das Fahrzeug verfügt über eine Herstellergarantie: {{ $vehicle->warranty }}.
                    @else
                        Eine zusätzliche Herstellergarantie über die gesetzliche Gewährleistung hinaus besteht nicht. Auf Wunsch kann eine Gebrauchtwagengarantie separat vereinbart werden.
                    @endif
                </li>
                <li>
                    <span class="term-title">Zustandsbericht:</span>
                    Der Käufer bestätigt, dass er das Fahrzeug besichtigt hat oder auf eine Besichtigung verzichtet. Bekannte Mängel oder Besonderheiten sind dem Käufer mitgeteilt worden.
                    @if($vehicle->accident_free) Das Fahrzeug ist laut Verkäufer unfallfrei.@endif
                </li>
            </ol>
        </div>
    </div>

    <!-- Insurance -->
    <div class="section no-break">
        <div class="section-title">§ 5 Versicherung und Zulassung</div>
        <div class="terms">
            <ol>
                <li>
                    <span class="term-title">Kfz-Haftpflichtversicherung:</span>
                    Der Käufer ist verpflichtet, vor der Zulassung des Fahrzeugs eine Kfz-Haftpflichtversicherung gemäß dem Pflichtversicherungsgesetz (PflVG) abzuschließen. Der Nachweis einer gültigen elektronischen Versicherungsbestätigung (eVB) ist Voraussetzung für die Übergabe.
                </li>
                <li>
                    <span class="term-title">Kaskoversicherung:</span>
                    Der Abschluss einer Teil- oder Vollkaskoversicherung wird dringend empfohlen, ist jedoch nicht verpflichtend. Der Verkäufer berät gerne bei der Auswahl eines geeigneten Versicherungstarifs.
                </li>
                <li>
                    <span class="term-title">Zulassung und Abmeldung:</span>
                    Die Kosten für die Zulassung trägt der Käufer. Sofern das Fahrzeug noch zugelassen ist, wird die Abmeldung durch den Verkäufer veranlasst, es sei denn, es wird eine Umschreibung vereinbart.
                </li>
                <li>
                    <span class="term-title">Überführung:</span>
                    Die Überführung des Fahrzeugs erfolgt nach Absprache. Die Kosten hierfür trägt der Käufer, sofern nicht anders vereinbart.
                </li>
            </ol>
        </div>
    </div>

    <!-- General Terms -->
    <div class="section no-break">
        <div class="section-title">§ 6 Allgemeine Vertragsbedingungen</div>
        <div class="terms">
            <ol>
                <li>
                    <span class="term-title">Eigentumsübergang:</span>
                    Das Eigentum am Fahrzeug geht erst mit vollständiger Zahlung des Kaufpreises (Eigentumsvorbehalt gem. § 449 BGB) auf den Käufer über.
                </li>
                <li>
                    <span class="term-title">Übergabe:</span>
                    Die Übergabe des Fahrzeugs erfolgt nach vollständigem Zahlungseingang am Standort des Verkäufers: {{ $company->full_address }}.
                </li>
                <li>
                    <span class="term-title">Rücktritt:</span>
                    Bei Nichtzahlung innerhalb der Zahlungsfrist ({{ $reservation->reservation_expires_at->format('d.m.Y') }}) behält sich der Verkäufer das Recht zum Rücktritt vom Vertrag vor. Bereits geleistete Anzahlungen werden abzüglich einer Bearbeitungsgebühr von 5% zurückerstattet.
                </li>
                <li>
                    <span class="term-title">Datenschutz:</span>
                    Die personenbezogenen Daten des Käufers werden gemäß DSGVO verarbeitet und ausschließlich zur Vertragsabwicklung sowie gesetzlichen Aufbewahrungspflichten verwendet.
                </li>
                <li>
                    <span class="term-title">Gerichtsstand:</span>
                    Erfüllungsort und Gerichtsstand ist Friedberg (Hessen), soweit gesetzlich zulässig.
                </li>
                <li>
                    <span class="term-title">Salvatorische Klausel:</span>
                    Sollte eine Bestimmung dieses Vertrages ganz oder teilweise unwirksam sein oder werden, so wird hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt.
                </li>
            </ol>
        </div>
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="section-title">§ 7 Unterschriften</div>
        <p style="font-size: 8.5pt; color: #666; margin-bottom: 15px;">
            Beide Parteien bestätigen mit ihrer Unterschrift die Kenntnisnahme und das Einverständnis mit den vorstehenden Vertragsbedingungen.
        </p>
        <table class="sig-table">
            <tr>
                <td>
                    <div style="font-size: 8pt; color: #888;">Ort, Datum</div>
                    <div style="font-size: 9pt; margin-top: 3px;">Friedberg, {{ $date }}</div>
                    <div class="sig-line">
                        <div class="sig-label">Verkäufer</div>
                        <div class="sig-name">{{ $company->company_name ?? 'C-H Automobile & Exclusive Cars' }}</div>
                    </div>
                    <div class="stamp-area">
                        Firmenstempel /<br>Unterschrift Verkäufer
                    </div>
                </td>
                <td class="spacer"></td>
                <td>
                    <div style="font-size: 8pt; color: #888;">Ort, Datum</div>
                    <div style="font-size: 9pt; margin-top: 3px;">_________________________</div>
                    <div class="sig-line">
                        <div class="sig-label">Käufer</div>
                        <div class="sig-name">{{ $reservation->customer_name }}</div>
                    </div>
                    <div class="stamp-area">
                        Unterschrift Käufer
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        C-H Automobile &amp; Exclusive Cars · {{ $company->full_address }} · Tel: {{ $company->phone }}<br>
        Vertrag Nr. {{ $reservation->payment_reference }} · Erstellt am {{ $date }}
    </div>

</body>
</html>
