<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuditLogger
{
    public static function log(string $action, string $entity, mixed $entityId = null, array $data = []): void
    {
        $user = Auth::user();

        $context = [
            'user_id'   => $user?->id ?? 'anonimo',
            'user_nome' => $user?->nome ?? 'anonimo',
            'action'    => $action,
            'entity'    => $entity,
            'entity_id' => $entityId,
            'ip'        => request()->ip(),
            'data'      => $data,
        ];

        Log::channel('audit')->info("[AUDIT] {$action} {$entity}", $context);
    }
}
