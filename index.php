<?php
// Include main files
require_once 'Slim/Slim.php';
require_once 'lib/DB.php';
require_once 'lib/VKApi.php';
require_once 'lib/Ext.php';

// Set time zone
ini_set('date.timezone', 'Europe/Kiev');

\Slim\Slim::registerAutoloader();

// Configurations app
$config = array(
	'mode' => 'development',
	'debug' => true,
    'templates.path' => './template'
);

// Register app
$app = new \Slim\Slim($config);

// Include routing file
require_once 'routing.php';

// Start app
$app->run();
