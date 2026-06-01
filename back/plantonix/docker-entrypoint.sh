#!/bin/bash
set -e

echo "Rodando migrations..."
php artisan migrate --force

echo "Rodando seeders..."
php artisan db:seed --force

echo "Cacheando configurações..."
php artisan config:cache
php artisan route:cache

echo "Iniciando Apache..."
exec apache2-foreground
