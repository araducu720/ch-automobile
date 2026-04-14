<?php

namespace App\Enums;

enum PurchaseStep: string
{
    case Invoice = 'invoice';
    case Signature = 'signature';
    case Payment = 'payment';
    case Completed = 'completed';
}
