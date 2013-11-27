<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-type: application/json');

date_default_timezone_set('America/Fortaleza');
require_once('twitteroauth/twitteroauth.php');

$consumer_key = 'gn7njBe1ELwnm4MiRXHRog';
$consumer_secret = 'ZKcNUdhYeVwYnealbq9AT4UXlKe1Od3ptIUAw64nKLE';
$user_token = '313612976-CSnFlODjbAVxZtvbptKfSPMo5cf0LljwbH0xi16o'; 
$user_token_secret = '8Hws3ly1epSCO81DFSn8YACFW7DLMCMMQbBDsOQZbk';

$twitterObj = new TwitterOAuth($consumer_key, $consumer_secret, $user_token, $user_token_secret);
$search_terms = '#' . $_GET['hashtag'];
//$msgs = $twitterObj->get('/search/tweets', array('q' => $search_terms, 'since' => date('Y-m-d'), 'locale' => 'pt', 'lang' => 'pt'));	
$msgs = $twitterObj->get('/search/tweets', array('q' => $search_terms, 'since' => '2013-01-01'));

$tweets = array();

foreach ($msgs->statuses as $msg) { 
	//$data = date("d/m",strtotime($msg->created_at));
	//$hora = date("H:i",strtotime($msg->created_at));
	
	$tweets[] = array('created_at' => $msg->created_at, 'user_image' => $msg->user->profile_image_url, 'user_name' => $msg->user->name, 'user_screenname' => $msg->user->screen_name, 'text' => $msg->text);
}

print json_encode($tweets);
?>