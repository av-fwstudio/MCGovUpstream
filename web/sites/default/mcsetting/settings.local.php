<?php
$databases['default']['default'] = [
    'database' => 'mc_manesar', // MAIN DB
    'username' => 'root',
    'password' => 'root',
    'prefix' => '',
    'host' => 'localhost',
    'port' => '3306',
    'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
    'driver' => 'mysql',
    'unix_socket' => '/Applications/MAMP/tmp/mysql/mysql.sock',
];

$settings['hash_salt'] = '-1g30EDsCmZ6o3ZnQx9aJ84j4IcKahowW44b-9QC8kgaOnFrGtaWXtmbFZjOhGtOhNqnhnaWhA';;

// $settings['config_sync_directory'] = 'sites/default/config';
$settings['config_sync_directory'] = DRUPAL_ROOT . '/../config';

// Proxy for files
//$settings['file_public_base_url'] = 'https://xyz.com/sites/default/files/';

$settings['container_yamls'][] = __DIR__ . '/development.services.yml';
// $settings['cache']['bins']['render'] = 'cache.backend.null';

// Css & JS
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

ini_set('memory_limit', '2048');

ini_set('max_execution_time', 360); // Set the maximum execution time to 60 seconds

$config['system.logging']['error_level'] = 'verbose';
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
error_reporting(E_ALL);

$settings['trusted_host_patterns'] = ['^.*$',];

$settings['update_free_access'] = TRUE;
