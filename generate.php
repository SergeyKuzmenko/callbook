<?
require_once 'functions.php';
require_once 'DB.php';
//error_reporting(none);

if (isset($_POST['ids'])) {
    $ids      = clear_data($_POST['ids']);
    $file     = md5($ids . time()); // Генерируем название файла
    $dir      = 'download/';
    $end      = '.vcf';
    $filename = $dir . $file . $end; //Создаем путь файла
    
    $ids = explode(',', $ids);
    $fp  = fopen($filename, "a+");
    flock($fp, LOCK_EX);
    
    $data = array();
    foreach ($ids as $id) {
        update_all_informations($id);
        $db   = new SafeMySQL();
        $data = $db->getAll('SELECT name, sname, number_phone, vk_id FROM people WHERE vk_id = ?s', $id);
        foreach ($data as $value) {
            $write_data = gen_vcard('' . $value['name'] . '', '' . $value['sname'] . '', '' . $value['number_phone'] . '', '' . $value['vk_id'] . '', 1);
            fwrite($fp, $write_data);
        }
    }
    fclose($fp);
    unset($data);
    $response = 'http://' . $_SERVER['SERVER_NAME'] . '/' . $filename;
    print_r($response);
    exit();
} else {
    //NONE
}
?>