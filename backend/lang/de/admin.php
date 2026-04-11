<?php

return [
    // Navigation groups
    'nav' => [
        'vehicles' => 'Fahrzeuge',
        'customer_service' => 'Kundenservice',
        'content' => 'Inhalt',
        'settings' => 'Einstellungen',
    ],

    // Vehicle Resource
    'vehicle' => [
        'label' => 'Fahrzeug',
        'plural' => 'Fahrzeuge',
        'nav' => 'Fahrzeuge',
        'new' => 'Neues Fahrzeug',

        // Tabs
        'tab_basic' => 'Grunddaten',
        'tab_technical' => 'Technische Daten',
        'tab_details' => 'Details',
        'tab_images' => 'Bilder',
        'tab_external' => 'Extern',

        // Sections
        'section_data' => 'Fahrzeugdaten',
        'section_engine' => 'Motor & Antrieb',
        'section_environment' => 'Umwelt & Verbrauch',
        'section_registration' => 'Registrierung & Historie',
        'section_description' => 'Beschreibung',
        'section_equipment' => 'Ausstattung',
        'section_external' => 'Externe Plattformen',

        // Fields
        'brand' => 'Marke',
        'model' => 'Modell',
        'variant' => 'Variante',
        'year' => 'Baujahr',
        'price' => 'Preis',
        'price_eur' => 'Preis (€)',
        'price_on_request' => 'Preis auf Anfrage',
        'mileage' => 'Kilometerstand',
        'km' => 'km',
        'condition' => 'Zustand',
        'status' => 'Status',
        'featured' => 'Hervorgehoben',
        'featured_help' => 'Auf der Startseite anzeigen',
        'image' => 'Bild',
        'created' => 'Erstellt',

        // Condition options
        'condition_new' => 'Neuwagen',
        'condition_used' => 'Gebrauchtwagen',
        'condition_classic' => 'Oldtimer',
        'condition_demo' => 'Vorführwagen',

        // Status options
        'status_available' => 'Verfügbar',
        'status_reserved' => 'Reserviert',
        'status_sold' => 'Verkauft',
        'status_draft' => 'Entwurf',

        // Fuel
        'fuel_type' => 'Kraftstoff',
        'fuel_petrol' => 'Benzin',
        'fuel_diesel' => 'Diesel',
        'fuel_electric' => 'Elektro',
        'fuel_hybrid' => 'Hybrid',
        'fuel_plugin_hybrid' => 'Plug-in-Hybrid',
        'fuel_lpg' => 'Autogas (LPG)',
        'fuel_cng' => 'Erdgas (CNG)',
        'fuel_hydrogen' => 'Wasserstoff',

        // Transmission
        'transmission' => 'Getriebe',
        'transmission_manual' => 'Schaltgetriebe',
        'transmission_automatic' => 'Automatik',
        'transmission_semi' => 'Halbautomatik',

        // Body type
        'body_type' => 'Karosserieform',
        'body_sedan' => 'Limousine',
        'body_suv' => 'SUV/Geländewagen',
        'body_coupe' => 'Coupé',
        'body_cabrio' => 'Cabrio',
        'body_kombi' => 'Kombi',
        'body_van' => 'Van/Kleinbus',
        'body_hatchback' => 'Schrägheck',
        'body_pickup' => 'Pickup',
        'body_roadster' => 'Roadster',
        'body_limousine' => 'Stretch-Limousine',
        'body_other' => 'Sonstige',

        // Technical
        'power_hp' => 'Leistung (PS)',
        'power_kw' => 'Leistung (kW)',
        'displacement' => 'Hubraum',
        'doors' => 'Türen',
        'seats' => 'Sitze',
        'color' => 'Außenfarbe',
        'interior_color' => 'Innenfarbe',

        // Environment
        'consumption_combined' => 'Verbrauch kombiniert',
        'consumption_city' => 'Verbrauch innerorts',
        'consumption_highway' => 'Verbrauch außerorts',
        'co2' => 'CO₂-Ausstoß',
        'emission_class' => 'Schadstoffklasse',
        'emission_badge' => 'Umweltplakette',

        // Registration & History
        'vin' => 'Fahrgestellnummer (VIN)',
        'first_registration' => 'Erstzulassung',
        'previous_owners' => 'Vorbesitzer',
        'tuv_until' => 'TÜV bis',
        'warranty' => 'Garantie',
        'accident_free' => 'Unfallfrei',
        'non_smoker' => 'Nichtraucherfahrzeug',
        'garage_kept' => 'Garagenfahrzeug',

        // Description & Equipment
        'description' => 'Beschreibung',
        'equipment' => 'Ausstattungsmerkmale',
        'equipment_add' => 'Merkmal hinzufügen',
        'vehicle_images' => 'Fahrzeugbilder',
        'documents' => 'Dokumente',

        // Equipment suggestions
        'equip_ac' => 'Klimaanlage',
        'equip_auto_ac' => 'Klimaautomatik',
        'equip_nav' => 'Navigationssystem',
        'equip_parking' => 'Einparkhilfe',
        'equip_camera' => 'Rückfahrkamera',
        'equip_led' => 'LED-Scheinwerfer',
        'equip_heated_seats' => 'Sitzheizung',
        'equip_leather' => 'Ledersitze',
        'equip_panorama' => 'Panoramadach',
        'equip_cruise' => 'Tempomat',
        'equip_lane_assist' => 'Spurhalteassistent',
        'equip_blind_spot' => 'Totwinkelwarner',
        'equip_preheater' => 'Standheizung',
        'equip_awd' => 'Allradantrieb',
        'equip_sport' => 'Sportpaket',
        'equip_towbar' => 'Anhängerkupplung',
        'equip_metallic' => 'Metallic-Lackierung',

        // Filters
        'filter_body' => 'Karosserie',

        // Actions
        'action_mark_sold' => 'Als verkauft markieren',
        'action_feature' => 'Hervorheben',
    ],

    // Inquiry Resource
    'inquiry' => [
        'label' => 'Anfrage',
        'plural' => 'Anfragen',
        'nav' => 'Anfragen',

        'section_details' => 'Anfrage Details',
        'section_message' => 'Nachricht',
        'section_notes' => 'Notizen',

        'type' => 'Typ',
        'status' => 'Status',
        'phone' => 'Telefon',
        'reference' => 'Referenz',
        'vehicle' => 'Fahrzeug',
        'preferred_date' => 'Wunschtermin',
        'message' => 'Nachricht',
        'internal_notes' => 'Interne Notizen',
        'received' => 'Eingegangen',

        // Type options
        'type_general' => 'Allgemein',
        'type_test_drive' => 'Probefahrt',
        'type_price' => 'Preisanfrage',
        'type_financing' => 'Finanzierung',
        'type_trade_in' => 'Inzahlungnahme',

        // Status options
        'status_new' => 'Neu',
        'status_in_progress' => 'In Bearbeitung',
        'status_completed' => 'Abgeschlossen',
        'status_archived' => 'Archiviert',

        // Actions
        'action_in_progress' => 'In Bearbeitung',
        'action_complete' => 'Abschließen',
        'action_archive' => 'Archivieren',
    ],

    // Reservation Resource
    'reservation' => [
        'label' => 'Reservierung',
        'plural' => 'Reservierungen',
        'nav' => 'Reservierungen',

        'section_customer' => 'Kundendaten',
        'section_reservation' => 'Reservierung',
        'section_notes' => 'Notizen',

        'phone' => 'Telefon',
        'payment_reference' => 'Zahlungsreferenz',
        'vehicle' => 'Fahrzeug',
        'deposit' => 'Anzahlung',
        'deposit_eur' => 'Anzahlung (€)',
        'payment_status' => 'Zahlungsstatus',
        'expiry_date' => 'Ablaufdatum',
        'internal_notes' => 'Interne Notizen',
        'reference' => 'Referenz',
        'customer' => 'Kunde',
        'status' => 'Status',
        'expires' => 'Läuft ab',
        'created' => 'Erstellt',

        // Payment status options
        'payment_pending' => 'Ausstehend',
        'payment_confirmed' => 'Bestätigt',
        'payment_cancelled' => 'Storniert',
        'payment_expired' => 'Abgelaufen',
        'payment_refunded' => 'Erstattet',

        // Actions
        'action_confirm' => 'Zahlung bestätigen',
        'action_cancel' => 'Stornieren',
    ],

    // Newsletter Resource
    'newsletter' => [
        'label' => 'Abonnent',
        'plural' => 'Newsletter Abonnenten',
        'nav' => 'Newsletter',

        'section_subscriber' => 'Abonnent',

        'language' => 'Sprache',
        'confirmed_at' => 'Bestätigt am',
        'unsubscribed_at' => 'Abgemeldet am',
        'confirmed' => 'Bestätigt',
        'unsubscribed' => 'Abgemeldet',
        'subscribed_at' => 'Angemeldet am',

        // Filters
        'filter_status' => 'Status',
        'filter_all' => 'Alle',
        'filter_confirmed' => 'Bestätigt',
        'filter_unconfirmed' => 'Unbestätigt',
        'filter_unsubscribed' => 'Abmeldung',
        'filter_unsubscribed_yes' => 'Abgemeldet',
        'filter_active' => 'Aktiv',

        // Actions
        'action_confirm' => 'Bestätigen',
        'action_confirm_heading' => 'Abonnent bestätigen',
        'action_confirm_description' => 'Möchten Sie diesen Abonnenten manuell bestätigen?',
        'action_confirmed' => 'Abonnent bestätigt',
        'action_unsubscribe' => 'Abmelden',
        'action_unsubscribe_heading' => 'Abonnent abmelden',
        'action_unsubscribe_description' => 'Möchten Sie diesen Abonnenten abmelden?',
        'action_unsubscribed' => 'Abonnent abgemeldet',
    ],

    // Review Resource
    'review' => [
        'label' => 'Bewertung',
        'plural' => 'Bewertungen',
        'nav' => 'Bewertungen',

        'section_review' => 'Bewertung',

        'rating' => 'Bewertung',
        'vehicle' => 'Fahrzeug',
        'title' => 'Titel',
        'comment' => 'Kommentar',
        'approved' => 'Genehmigt',
        'featured' => 'Hervorgehoben',
        'date' => 'Datum',

        // Actions
        'action_approve' => 'Genehmigen',
        'action_reject' => 'Ablehnen',
        'action_approve_all' => 'Alle genehmigen',
    ],

    // Blog Post Resource
    'blog_post' => [
        'label' => 'Beitrag',
        'plural' => 'Beiträge',
        'nav' => 'Blog Beiträge',

        'section_post' => 'Beitrag',
        'section_image_publish' => 'Bild & Veröffentlichung',

        'title' => 'Titel',
        'category' => 'Kategorie',
        'excerpt' => 'Auszug',
        'content' => 'Inhalt',
        'featured_image' => 'Beitragsbild',
        'published' => 'Veröffentlicht',
        'publish_date' => 'Veröffentlichungsdatum',
        'author' => 'Autor',
        'image' => 'Bild',
        'date' => 'Datum',
        'views' => 'Aufrufe',
        'meta_title' => 'Meta-Titel',
        'meta_description' => 'Meta-Beschreibung',
        'new' => 'Neuer Beitrag',
    ],

    // Blog Category Resource
    'blog_category' => [
        'label' => 'Kategorie',
        'plural' => 'Kategorien',
        'nav' => 'Blog Kategorien',

        'section_category' => 'Kategorie',
        'slug_auto' => 'Wird automatisch generiert',
        'sort_order' => 'Sortierung',
        'posts_count' => 'Beiträge',
        'created' => 'Erstellt',
    ],

    // Company Settings
    'company' => [
        'label' => 'Firmeneinstellungen',
        'plural' => 'Firmeneinstellungen',
        'nav' => 'Firmeneinstellungen',
        'title' => 'Firmeneinstellungen',

        // Tabs
        'tab_company' => 'Firma',
        'tab_hours' => 'Öffnungszeiten',
        'tab_bank' => 'Bankdaten',
        'tab_legal' => 'Rechtliches',

        // Sections
        'section_contact' => 'Kontaktdaten',
        'section_address' => 'Adresse',
        'section_hours' => 'Öffnungszeiten',
        'section_social' => 'Social Media Links',
        'section_bank' => 'Bankverbindung',
        'section_tax' => 'Steuerdaten',
        'section_logo' => 'Logo & Favicon',
        'section_meta' => 'Meta-Daten',
        'section_imprint' => 'Impressum',
        'section_privacy' => 'Datenschutz',
        'section_terms' => 'AGB',

        // Fields
        'company_name' => 'Firmenname',
        'phone' => 'Telefon',
        'street' => 'Straße',
        'city' => 'Stadt',
        'zip' => 'PLZ',
        'country' => 'Land',
        'latitude' => 'Breitengrad',
        'longitude' => 'Längengrad',
        'hours' => 'Öffnungszeiten',
        'hours_day' => 'Tag',
        'hours_time' => 'Uhrzeit',
        'hours_add' => 'Tag hinzufügen',
        'whatsapp' => 'WhatsApp Nummer',
        'account_holder' => 'Kontoinhaber',
        'tax_number' => 'Steuernummer / USt-IdNr.',
        'trade_register' => 'Handelsregisternummer',
        'logo_light' => 'Logo (Hell)',
        'logo_dark' => 'Logo (Dunkel)',
        'meta_title' => 'Meta-Titel',
        'meta_description' => 'Meta-Beschreibung',
        'imprint' => 'Impressum',
        'privacy_policy' => 'Datenschutzerklärung',
        'terms' => 'Allgemeine Geschäftsbedingungen',

        // Days
        'monday' => 'Montag',
        'tuesday' => 'Dienstag',
        'wednesday' => 'Mittwoch',
        'thursday' => 'Donnerstag',
        'friday' => 'Freitag',
        'saturday' => 'Samstag',
        'sunday' => 'Sonntag',
        'closed' => 'Geschlossen',
    ],

    // Dashboard
    'dashboard' => [
        'vehicles_available' => 'Fahrzeuge verfügbar',
        'total_stock' => 'Gesamtbestand: ',
        'new_inquiries' => 'Neue Anfragen',
        'today' => 'Heute: ',
        'open_reservations' => 'Offene Reservierungen',
        'confirmed' => 'Bestätigt: ',
        'reviews' => 'Bewertungen',
        'average' => 'Durchschnitt',
    ],
];
