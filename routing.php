<?
//Вывод главной страницы
$app->get('/', function() use ($app){
	$app->render('main.html');
});

//Вывод страницы ошибки
$app->notFound(function () use ($app) {
	$app->render('404.html');
});

//Количество контактов в базе
$app->get('/api/count_contacts', function() use ($app){
		$app->response->headers->set('Content-Type', 'application/json');
		$db = new SafeMySQL();
		$count = $db->query('SELECT COUNT(*) FROM people WHERE visibility = 1');
		$count = mysqli_fetch_array($count);
		$count = array('count' => $count[0]);
		echo json_encode($count);
    }
);

/////////////////////////////////////////////////////////////////////////////////////
//API -> main page
$app->get('/api/', function() use ($app){
		$app->response->headers->set('Content-Type', 'application/json');
		try {
			$context = [
				'text' => 'API',
				'version' => '0.1'
			];
			echo json_encode($context);
		}
		catch (Exception $e) {
           //
        }
		
    }
);

// Поиск по базе
$app->post('/api/search', function() use ($app){
			$app->response->headers->set('Content-Type', 'application/json');
			$db = new SafeMySQL();

			$ext = new Ext();
			$data = $ext->clear($data);

			$q = $app->request()->post('q');
			$gender = $app->request()->post('gender');
			try {
				if ($gender == 0) {
					$data = $db->getAll('SELECT vk_id, name, sname, gender, number_phone FROM people WHERE name LIKE  "%"?s"%" OR sname LIKE  "%"?s"%" OR number_phone LIKE  "%"?s"%"LIMIT 0, 9', $q, $q, $q);
				}elseif ($gender == 1) {
					$data = $db->getAll('SELECT vk_id, name, sname, gender, number_phone FROM people WHERE gender = 1 AND name LIKE  "%"?s"%" OR sname LIKE  "%"?s"%" OR number_phone LIKE  "%"?s"%"LIMIT 0, 9', $q, $q, $q);
				}elseif ($gender == 2) {
					$data = $db->getAll('SELECT vk_id, name, sname, gender, number_phone FROM people WHERE gender = 2 AND name LIKE  "%"?s"%" OR sname LIKE  "%"?s"%" OR number_phone LIKE  "%"?s"%"LIMIT 0, 9', $q, $q, $q);
				}else{
					$data = false;
				}

				if ($data == false) {
					$result = ['count' => 0];
					echo json_encode($result);
				}else{
					$result = ['response' => $data];
					echo json_encode($result);
					}
				}	
			catch (Exception $e) {
	            $response = array('error' => 'Internal error');
				echo json_encode($response);
	        }
});

// Загрузка всей информации
$app->get('/api/get/:id', function($id) use ($app){
		$app->response->headers->set('Content-Type', 'application/json');
		try {
			$db = new SafeMySQL();
			$data = $db->getRow('SELECT vk_id, name, sname, gender, bdate, number_phone FROM people WHERE vk_id = ?s', $id);
			if ($data == false) {
				$data = array('get' => 0);
				echo json_encode($data);
			}else {
				echo json_encode($data);
			}
		}
		catch (Exception $e) {
            $response = array('error' => 0);
			echo json_encode($response);
        }
		
    }
);

// Добавление нового контакта
$app->post('/api/add', function() use ($app){
		$app->response->headers->set('Content-Type', 'application/json');
		$ext = new Ext();
		$query = $app->request();

		$number = $ext->clear($query->post('phone'));
		$number = $ext->unbrackets($number);

		$url = $query->post('url');
		$url = explode("/", $url);
		$url = $ext->clear($url[3]);
		try {
			//Перед записью даных в базу, проверяем на наличие дубликатов
			$db = new SafeMySQL();
			$duplicate = $db->query('SELECT COUNT(*) FROM people WHERE number_phone = ?s', $number);
			$duplicate = mysqli_fetch_array($duplicate);
				if ($duplicate[0] > 0) { //Если номер найден в базе
					$data = $db->getRow('SELECT * FROM people WHERE number_phone = ?s', $number);
					$response = ['status' => 1];
					echo json_encode($response);
				exit();
			}
			elseif ($duplicate[0] == 0) { //Если номер не найден в базе
				$vk = new VK\VK(5107104, 'QpCJUof1hG9WUjPwcSdt');
				$user = $vk->api('users.get', array(
					'user_ids' 	=> 	$url,
					'fields' 	=>	'photo_100,photo_200,sex,bdate',
					'v'			=>	'5.8',
					'lang'		=> 0));
				$id = $user['response'][0]['id'];
				$name = $user['response'][0]['first_name'];
				$sname = $user['response'][0]['last_name'];
				$gender = $user['response'][0]['sex'];
				$bdate = $user['response'][0]['bdate'];
				$photo_100 = $user['response'][0]['photo_100'];
				$photo_200 = $user['response'][0]['photo_200'];
					try {
						function add_contact($id, $name, $sname, $number, $gender, $bdate) {
							$db = new SafeMySQL();
							$data = $db->query('INSERT INTO people (name, sname, vk_id, number_phone, gender, date_add, date_update, time_update, url_img_100, url_img_200, bdate) VALUES (?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s)', $name, $sname, $id, $number, $gender, date('Y-m-d') , date('Y-m-d'), date('G:i:s'),'data/photos_users/100/'.$id.'.jpg','data/photos_users/200/'.$id.'.jpg', $bdate);
						}
						add_contact($id, $name, $sname, $number, $gender, $bdate);
						function update_photo_by_id($id) {
							$vk = new VK\VK(5107104, 'QpCJUof1hG9WUjPwcSdt');
								$photo = $vk->api('users.get', array(
									'user_ids' 	=> 	$id,
									'fields' 	=>	'photo_100,photo_200',
									'v'			=>	'5.8'));
							//Загружаемо URL картинок
							$photo_100 = $photo['response'][0]['photo_100'];
							$photo_200 = $photo['response'][0]['photo_200'];
							//Копируем с заменой
							copy($photo_100, 'data/photos_users/100/'.$id.'.jpg');
							copy($photo_200, 'data/photos_users/200/'.$id.'.jpg');
						}
					}
					catch (Exception $e) {
					//Если ошибка - выводим хуйня
						$response = ['status' => 0];
						echo json_encode($response);
				        exit();
				    }
				    //Если всё заебись - выводим ок
				    $response = ['status' => 2];
						echo json_encode($response);
			} 
		}
		catch (Exception $e) {
            //catch
        }
    }
);

//Вывод всех контактов обьектом
$app->get('/api/getAllContacts.json', function() use ($app){
      	$app->response->headers->set('Content-Type', 'application/json');
		try {
			$db = new SafeMySQL();
			$data = $db->getAll('SELECT vk_id, name, sname, gender, bdate, number_phone FROM people');
			if ($data == false) {
				$data =['error' => 'Internal Error'];
				echo json_encode($data);
			}elseif ($data) {
				$response = ['response' => $data];
				echo json_encode($data);
			}
		}
		catch (Exception $e) {
            $response = ['error' => 'Internal Error'];
			echo json_encode($response);
        }
    }
);