<?php

//Вывод главной страницы
$app->get('/', function () use ($app) {
    $app->render('main.html');
});

//Вывод страницы ошибки
$app->notFound(function () use ($app) {
    $app->render('404.html');
});
