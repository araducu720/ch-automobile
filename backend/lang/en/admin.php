<?php

return [
    // Navigation groups
    'nav' => [
        'vehicles' => 'Vehicles',
        'customer_service' => 'Customer Service',
        'content' => 'Content',
        'settings' => 'Settings',
    ],

    // Vehicle Resource
    'vehicle' => [
        'label' => 'Vehicle',
        'plural' => 'Vehicles',
        'nav' => 'Vehicles',
        'new' => 'New Vehicle',

        // Tabs
        'tab_basic' => 'Basic Data',
        'tab_technical' => 'Technical Data',
        'tab_details' => 'Details',
        'tab_images' => 'Images',
        'tab_external' => 'External',

        // Sections
        'section_data' => 'Vehicle Data',
        'section_engine' => 'Engine & Drivetrain',
        'section_environment' => 'Environment & Consumption',
        'section_registration' => 'Registration & History',
        'section_description' => 'Description',
        'section_equipment' => 'Equipment',
        'section_external' => 'External Platforms',

        // Fields
        'brand' => 'Brand',
        'model' => 'Model',
        'variant' => 'Variant',
        'year' => 'Year',
        'price' => 'Price',
        'price_eur' => 'Price (€)',
        'price_on_request' => 'Price on Request',
        'mileage' => 'Mileage',
        'km' => 'km',
        'condition' => 'Condition',
        'status' => 'Status',
        'featured' => 'Featured',
        'featured_help' => 'Show on homepage',
        'image' => 'Image',
        'created' => 'Created',

        // Condition options
        'condition_new' => 'New',
        'condition_used' => 'Used',
        'condition_classic' => 'Classic',
        'condition_demo' => 'Demo Vehicle',

        // Status options
        'status_available' => 'Available',
        'status_reserved' => 'Reserved',
        'status_sold' => 'Sold',
        'status_draft' => 'Draft',

        // Fuel
        'fuel_type' => 'Fuel Type',
        'fuel_petrol' => 'Petrol',
        'fuel_diesel' => 'Diesel',
        'fuel_electric' => 'Electric',
        'fuel_hybrid' => 'Hybrid',
        'fuel_plugin_hybrid' => 'Plug-in Hybrid',
        'fuel_lpg' => 'LPG',
        'fuel_cng' => 'CNG',
        'fuel_hydrogen' => 'Hydrogen',

        // Transmission
        'transmission' => 'Transmission',
        'transmission_manual' => 'Manual',
        'transmission_automatic' => 'Automatic',
        'transmission_semi' => 'Semi-Automatic',

        // Body type
        'body_type' => 'Body Type',
        'body_sedan' => 'Sedan',
        'body_suv' => 'SUV',
        'body_coupe' => 'Coupé',
        'body_cabrio' => 'Convertible',
        'body_kombi' => 'Estate',
        'body_van' => 'Van',
        'body_hatchback' => 'Hatchback',
        'body_pickup' => 'Pickup',
        'body_roadster' => 'Roadster',
        'body_limousine' => 'Stretch Limousine',
        'body_other' => 'Other',

        // Technical
        'power_hp' => 'Power (HP)',
        'power_kw' => 'Power (kW)',
        'displacement' => 'Displacement',
        'doors' => 'Doors',
        'seats' => 'Seats',
        'color' => 'Exterior Color',
        'interior_color' => 'Interior Color',

        // Environment
        'consumption_combined' => 'Combined Consumption',
        'consumption_city' => 'Urban Consumption',
        'consumption_highway' => 'Extra-Urban Consumption',
        'co2' => 'CO₂ Emissions',
        'emission_class' => 'Emission Class',
        'emission_badge' => 'Emission Badge',

        // Registration & History
        'vin' => 'VIN',
        'first_registration' => 'First Registration',
        'previous_owners' => 'Previous Owners',
        'tuv_until' => 'MOT Until',
        'warranty' => 'Warranty',
        'accident_free' => 'Accident Free',
        'non_smoker' => 'Non-Smoker Vehicle',
        'garage_kept' => 'Garage Kept',

        // Description & Equipment
        'description' => 'Description',
        'equipment' => 'Equipment Features',
        'equipment_add' => 'Add feature',
        'vehicle_images' => 'Vehicle Images',
        'documents' => 'Documents',

        // Equipment suggestions
        'equip_ac' => 'Air Conditioning',
        'equip_auto_ac' => 'Climate Control',
        'equip_nav' => 'Navigation System',
        'equip_parking' => 'Parking Sensors',
        'equip_camera' => 'Rear Camera',
        'equip_led' => 'LED Headlights',
        'equip_heated_seats' => 'Heated Seats',
        'equip_leather' => 'Leather Seats',
        'equip_panorama' => 'Panoramic Roof',
        'equip_cruise' => 'Cruise Control',
        'equip_lane_assist' => 'Lane Assist',
        'equip_blind_spot' => 'Blind Spot Warning',
        'equip_preheater' => 'Parking Heater',
        'equip_awd' => 'All-Wheel Drive',
        'equip_sport' => 'Sport Package',
        'equip_towbar' => 'Tow Bar',
        'equip_metallic' => 'Metallic Paint',

        // Filters
        'filter_body' => 'Body Type',

        // Actions
        'action_mark_sold' => 'Mark as Sold',
        'action_feature' => 'Feature',
    ],

    // Inquiry Resource
    'inquiry' => [
        'label' => 'Inquiry',
        'plural' => 'Inquiries',
        'nav' => 'Inquiries',

        'section_details' => 'Inquiry Details',
        'section_message' => 'Message',
        'section_notes' => 'Notes',

        'type' => 'Type',
        'status' => 'Status',
        'phone' => 'Phone',
        'reference' => 'Reference',
        'vehicle' => 'Vehicle',
        'preferred_date' => 'Preferred Date',
        'message' => 'Message',
        'internal_notes' => 'Internal Notes',
        'received' => 'Received',

        // Type options
        'type_general' => 'General',
        'type_test_drive' => 'Test Drive',
        'type_price' => 'Price Inquiry',
        'type_financing' => 'Financing',
        'type_trade_in' => 'Trade-In',

        // Status options
        'status_new' => 'New',
        'status_in_progress' => 'In Progress',
        'status_completed' => 'Completed',
        'status_archived' => 'Archived',

        // Actions
        'action_in_progress' => 'In Progress',
        'action_complete' => 'Complete',
        'action_archive' => 'Archive',
    ],

    // Reservation Resource
    'reservation' => [
        'label' => 'Reservation',
        'plural' => 'Reservations',
        'nav' => 'Reservations',

        'section_customer' => 'Customer Data',
        'section_reservation' => 'Reservation',
        'section_notes' => 'Notes',

        'phone' => 'Phone',
        'payment_reference' => 'Payment Reference',
        'vehicle' => 'Vehicle',
        'deposit' => 'Deposit',
        'deposit_eur' => 'Deposit (€)',
        'payment_status' => 'Payment Status',
        'expiry_date' => 'Expiry Date',
        'internal_notes' => 'Internal Notes',
        'reference' => 'Reference',
        'customer' => 'Customer',
        'status' => 'Status',
        'expires' => 'Expires',
        'created' => 'Created',

        // Payment status options
        'payment_pending' => 'Pending',
        'payment_confirmed' => 'Confirmed',
        'payment_cancelled' => 'Cancelled',
        'payment_expired' => 'Expired',
        'payment_refunded' => 'Refunded',

        // Actions
        'action_confirm' => 'Confirm Payment',
        'action_cancel' => 'Cancel',
    ],

    // Newsletter Resource
    'newsletter' => [
        'label' => 'Subscriber',
        'plural' => 'Newsletter Subscribers',
        'nav' => 'Newsletter',

        'section_subscriber' => 'Subscriber',

        'language' => 'Language',
        'confirmed_at' => 'Confirmed At',
        'unsubscribed_at' => 'Unsubscribed At',
        'confirmed' => 'Confirmed',
        'unsubscribed' => 'Unsubscribed',
        'subscribed_at' => 'Subscribed At',

        // Filters
        'filter_status' => 'Status',
        'filter_all' => 'All',
        'filter_confirmed' => 'Confirmed',
        'filter_unconfirmed' => 'Unconfirmed',
        'filter_unsubscribed' => 'Unsubscription',
        'filter_unsubscribed_yes' => 'Unsubscribed',
        'filter_active' => 'Active',

        // Actions
        'action_confirm' => 'Confirm',
        'action_confirm_heading' => 'Confirm Subscriber',
        'action_confirm_description' => 'Do you want to manually confirm this subscriber?',
        'action_confirmed' => 'Subscriber confirmed',
        'action_unsubscribe' => 'Unsubscribe',
        'action_unsubscribe_heading' => 'Unsubscribe',
        'action_unsubscribe_description' => 'Do you want to unsubscribe this subscriber?',
        'action_unsubscribed' => 'Subscriber unsubscribed',
    ],

    // Review Resource
    'review' => [
        'label' => 'Review',
        'plural' => 'Reviews',
        'nav' => 'Reviews',

        'section_review' => 'Review',

        'rating' => 'Rating',
        'vehicle' => 'Vehicle',
        'title' => 'Title',
        'comment' => 'Comment',
        'approved' => 'Approved',
        'featured' => 'Featured',
        'date' => 'Date',

        // Actions
        'action_approve' => 'Approve',
        'action_reject' => 'Reject',
        'action_approve_all' => 'Approve All',
    ],

    // Blog Post Resource
    'blog_post' => [
        'label' => 'Post',
        'plural' => 'Posts',
        'nav' => 'Blog Posts',

        'section_post' => 'Post',
        'section_image_publish' => 'Image & Publication',

        'title' => 'Title',
        'category' => 'Category',
        'excerpt' => 'Excerpt',
        'content' => 'Content',
        'featured_image' => 'Featured Image',
        'published' => 'Published',
        'publish_date' => 'Publish Date',
        'author' => 'Author',
        'image' => 'Image',
        'date' => 'Date',
        'views' => 'Views',
        'meta_title' => 'Meta Title',
        'meta_description' => 'Meta Description',
        'new' => 'New Post',
    ],

    // Blog Category Resource
    'blog_category' => [
        'label' => 'Category',
        'plural' => 'Categories',
        'nav' => 'Blog Categories',

        'section_category' => 'Category',
        'slug_auto' => 'Auto-generated',
        'sort_order' => 'Sort Order',
        'posts_count' => 'Posts',
        'created' => 'Created',
    ],

    // Company Settings
    'company' => [
        'label' => 'Company Settings',
        'plural' => 'Company Settings',
        'nav' => 'Company Settings',
        'title' => 'Company Settings',

        // Tabs
        'tab_company' => 'Company',
        'tab_hours' => 'Opening Hours',
        'tab_bank' => 'Bank Details',
        'tab_legal' => 'Legal',

        // Sections
        'section_contact' => 'Contact Details',
        'section_address' => 'Address',
        'section_hours' => 'Opening Hours',
        'section_social' => 'Social Media Links',
        'section_bank' => 'Bank Account',
        'section_tax' => 'Tax Details',
        'section_logo' => 'Logo & Favicon',
        'section_meta' => 'Meta Data',
        'section_imprint' => 'Imprint',
        'section_privacy' => 'Privacy Policy',
        'section_terms' => 'Terms & Conditions',

        // Fields
        'company_name' => 'Company Name',
        'phone' => 'Phone',
        'street' => 'Street',
        'city' => 'City',
        'zip' => 'ZIP Code',
        'country' => 'Country',
        'latitude' => 'Latitude',
        'longitude' => 'Longitude',
        'hours' => 'Opening Hours',
        'hours_day' => 'Day',
        'hours_time' => 'Time',
        'hours_add' => 'Add day',
        'whatsapp' => 'WhatsApp Number',
        'account_holder' => 'Account Holder',
        'tax_number' => 'Tax Number / VAT ID',
        'trade_register' => 'Trade Register Number',
        'logo_light' => 'Logo (Light)',
        'logo_dark' => 'Logo (Dark)',
        'meta_title' => 'Meta Title',
        'meta_description' => 'Meta Description',
        'imprint' => 'Imprint',
        'privacy_policy' => 'Privacy Policy',
        'terms' => 'Terms & Conditions',

        // Days
        'monday' => 'Monday',
        'tuesday' => 'Tuesday',
        'wednesday' => 'Wednesday',
        'thursday' => 'Thursday',
        'friday' => 'Friday',
        'saturday' => 'Saturday',
        'sunday' => 'Sunday',
        'closed' => 'Closed',
    ],

    // Dashboard
    'dashboard' => [
        'vehicles_available' => 'Vehicles Available',
        'total_stock' => 'Total stock: ',
        'new_inquiries' => 'New Inquiries',
        'today' => 'Today: ',
        'open_reservations' => 'Open Reservations',
        'confirmed' => 'Confirmed: ',
        'reviews' => 'Reviews',
        'average' => 'Average',
    ],
];
