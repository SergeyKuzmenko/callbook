<?php
$app->group('/admin', function () use ($app) {

    $app->get('/', function () use ($app) {
        $app->response->headers->set('Content-Type', 'text/html');
        $access_token = $_COOKIE['access_token'];
        if ($access_token == hash('sha256', ADMIN_PASSWORD)) {
            $app->render('admin/main.html');
        } else {
            $app->render('admin/login.html');
        }
    }
    );

    $app->post('/check_password/', function () use ($app) {
        $app->response->headers->set('Content-Type', 'application/json');
        $ext = new Ext();
        $password = $app->request()->post('p');
        $password = $ext->clear($password);
        if (hash('sha256', $password) == hash('sha256', ADMIN_PASSWORD)) {
            $response = ['code' => 1, 'access_token' => hash('sha256', ADMIN_PASSWORD)];
            echo json_encode($response);
        } else {
            $response = ['code' => 0, 'access_token' => hash('sha256', $password)];
            echo json_encode($response);

        }
    }
    );

    $app->get('/logout', function () use ($app) {
        $app->setCookie('access_token', 0);
        $app->redirect('/admin');

    });

    $app->get('/check/:access_token', function ($access_token) use ($app) {
        $app->response->headers->set('Content-Type', 'application/json');
        $isAdmin = new Ext();
        $isAdmin = $isAdmin->isAdmin($access_token);
        if ($isAdmin) {
        	$response = ['access_token' => $access_token, 'admin' => $isAdmin];
        		echo json_encode($response);
        }else{
        	$response = array('access_token' => 0, 'error' => 'Invalid token');
            echo json_encode($response);
        }
    }
    );

    $app->get('/last_added/:access_token', function ($access_token) use ($app) {
        $app->response->headers->set('Content-Type', 'application/json');
        $roles = new Ext();
        if ($roles->isAdmin($access_token)) {
            try {
                $db = new SafeMySQL(array('host' => DB_HOST, 'user' => DB_USER, 'pass' => DB_PASSWORD, 'db' => DB_TABLE));
                $data = $db->getAll('SELECT vk_id, name, sname, number_phone FROM people ORDER BY `date_add` DESC LIMIT 0, 4');
                if ($data == false) {
                    $data = array('get' => 0);
                    echo json_encode($data);
                } else {
                    $response = ['response' => $data];
                    echo json_encode($response);
                }
            } catch (Exception $e) {
                $response = array('access_token' => 0, 'error' => $e->getMessage());
                echo json_encode($response);
            }
        }
    });

    $app->get('/getRows/:access_token', function ($access_token) use ($app) {
        $app->response->headers->set('Content-Type', 'application/json');
        $roles = new Ext();
        if ($roles->isAdmin($access_token)) {
            try {
                $db = new SafeMySQL(array('host' => DB_HOST, 'user' => DB_USER, 'pass' => DB_PASSWORD, 'db' => DB_TABLE));
                $data = $db->getAll('SELECT * FROM people');
                if ($data == false) {
                    $data = ['error' => 'Internal Error'];
                    echo json_encode($data);
                } elseif ($data) {
                    $response = ['response' => $data];
                    echo json_encode($data);
                }
            } catch (Exception $e) {
                $response = array('error' => 0);
                echo json_encode($response);
            }
        }
    }
    );

    $app->get('/getColumns/:access_token', function ($access_token) use ($app) {
        $app->response->headers->set('Content-Type', 'application/json');
        $roles = new Ext();
        if ($roles->isAdmin($access_token)) {
            try {
                $columns = array(
                    [
                        'name' => 'vk_id',
                        'title' => 'VK ID',
                        'type' => 'number'
                    ],
                    [
                        'name' => 'name',
                        'title' => 'Имя'
                    ],
                    [
                        'name' => 'sname',
                        'title' => 'Фамилия'
                    ],
                    [
                        'name' => 'number_phone',
                        'title' => 'Телефон'
                    ],
                    [
                        'name' => 'gender',
                        'title' => 'Пол'
                    ],
                    [
                        'name' => 'bdate',
                        'title' => 'День рожд.'
                    ],
                    [
                        'name' => 'date_add',
                        'title' => 'Добавлен',
                        'type' => 'date',
                        'formatString' => 'DD MMM YYYY'
                    ],
                    [
                        'name' => 'date_update',
                        'title' => 'Обновлен (Дата)',
                        'type' => 'date',
                        'formatString' => 'DD MMM YYYY'
                    ],
                    [
                        'name' => 'time_update',
                        'title' => 'Обновлен (Время)',
                        'type' => 'date'
                    ],
                    [
                        'name' => 'visibility',
                        'title' => 'Видимость',
                        'type' => 'numler'
                    ]
                );
                
                if ($columns == false) {
                    $columns = ['error' => 'Internal Error'];
                    echo json_encode($columns);
                } elseif ($columns) {
                    echo json_encode($columns);
                }
            } catch (Exception $e) {
                $response = array('error' => 0);
                echo json_encode($response);
            }
        }
    }
    );

});