<?php 
Class Ext{

	public function index()
	{
		return true;
	}

	//Очистка входных данных
	public function clear($data)
	{
		$data = strip_tags($data);
		$data = str_replace("'", "", $data);
		$data = htmlspecialchars($data);
		$data = trim($data);
		return $data;
	}

	//Коррекция времени по заданом сереверу
	function correct_time($host)
	{
		$f = fsockopen ($host, 13);
		$s = '';
		while (!feof($f)) {
			$s .= fgets($f);
		}
		$s = strtotime($s);
		return $s;
	}

	//Удалить ненужные скобки и тире с номера телефона
	public function unbrackets($data)
	{
		$data = str_replace("-","",$data);
		$data = str_replace("(","",$data);
		$data = str_replace(")","",$data);
		return $data;
	}


}
