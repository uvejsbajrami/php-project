<?php

include 'db.php';
include 'helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

$method = $_SERVER['REQUEST_METHOD'];   
$action = (isset($_GET['action']) && !empty($_GET['action'])) ? $_GET['action'] : '';
$payload = json_decode(file_get_contents('php://input'),true);



// Action: Register
// HTTP verb: POST
// URL: http://localhost/php-full-project/php-project/api/api.php
if(is_set($payload) && ($payload['action'] == 'register') && $method == 'POST') {
    $register_stm = $pdo->prepare("INSERT INTO `users` (`email`, `name`, `discordUsername`, `password`) VALUES (:email, :name, :discordUsername, :password)");
    
    $hash = password_hash($payload['password'], PASSWORD_BCRYPT);
    $token = str_shuffle($hash);
    $register_stm->bindParam(':email', $payload['email']);
    $register_stm->bindParam(':name', $payload['name']);
    $register_stm->bindParam(':discordUsername', $payload['discordUsername']);
    $register_stm->bindParam(':password', $hash);


    if($register_stm->execute()) {
        $response = ['status' => 1, 'message' => 'Perdoruesi u regjistrua me sukses.'];
    } else {
        $response = ['status' => 0, 'message' => 'Perdoruesi nuk u regjistrua - dicka shkoi keq!'];
    }

    echo json_encode($response);
}


// Action: Login
// HTTP verb: POST
// URL: http://localhost/php-full-project/php-project/api/api.php
if(is_set($payload) && ($payload['action'] == 'login') && $method == 'POST') {
    $user = [];

    // fetch user data
    $login_stm = $pdo->prepare("SELECT * FROM `users` WHERE `email` = :email");
    $login_stm->bindParam(':email', $payload['email']);
    $login_stm->execute();
    $user = $login_stm->fetch(PDO::FETCH_ASSOC);

    if($user == false) {
        echo json_encode(['status' => 0, 'message' => 'Nuk korospodon asnje perdorues per email adresen e dhene!']);
        die();
    }

    if(password_verify($payload['password'], $user['password'])) {
        echo json_encode(['status' => 1, 'id' => $user['id'], 'discordUsername' => $user['discordUsername'] , 'email' => $user['email']]);
    } else {
        echo json_encode(['status' => 0, 'message' => 'Keni shenuar te dhena te pasakta!']);
    }
}


// Action: create_server
// HTTP verb: POST
// URL: http://localhost/php-full-project/php-project/api/api.php
if(is_set($payload) && ($payload['action'] == 'server_create') && $method == 'POST') {
    $server_create_stm = $pdo->prepare("INSERT INTO `server_create` (`user_id`, `name`) VALUES (:user_id, :name)");
    $server_create_stm->bindParam(':user_id', $payload['user_id']);
    $server_create_stm->bindParam(':name', $payload['name']);
   

     if($server_create_stm->execute()) {
        // $server_id = $pdo->lastInsertId();

        // if(count($_POST['images'])) {
        //     for($i = 0; $i < count($_POST['images']); $i++) {
        //         $filename = time() ."_" .$_FILES['images'][$i]['name'];

        //         if(move_uploaded_file($_FILES['images'][$i]['tmp_name'], "../uploads/".$filename)) {
        //             // insert ne images table
        //             $add_image_stm = $pdo->prepare("INSERT INTO `images` (`server_id`, `name`) VALUES (:server_id, :name)");
        //             $add_image_stm->bindParam(':server_id', $server_id);
        //             $add_image_stm->bindParam(':name', $filename);
        //             $add_image_stm->execute();
        //         }
        //     }
        // }

        $response = ['status' => 1, 'message' => 'Serveri u krijua me sukses.'];
    } else {
        $response = ['status' => 0, 'message' => 'Serveri nuk u krijua - dicka shkoi keq!'];
    }

    echo json_encode($response);
}


// Action: Get user servers
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_user_servers&id=x
if($action == 'get_user_servers' && is_set($_GET['id']) && $method == 'GET') {
    $servers = [];
    $user_id = $_GET['id']; 

    $servers_stm = $pdo->prepare("SELECT `server_create`.* FROM `server_create` INNER JOIN `users` ON `users`.`id` = `server_create`.`user_id` WHERE `users`.`id` = :user_id");
    $servers_stm->bindParam(':user_id',$user_id);
    $servers_stm->execute();
    while($row = $servers_stm->fetch(PDO::FETCH_ASSOC)) {
            $servers[] = $row;
    }

    echo json_encode(['servers' => $servers]);
}


// Action: add_friends (toggle)
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=add_friends&follower=X&followed=X
if($action == 'add_friends' && is_set($_GET['follower']) && is_set($_GET['followed']) && $method == 'GET') { 
    $fe_stm =  $pdo->prepare("SELECT * FROM `add_friends` WHERE `follower_id` = :follower AND `followed_id` = :followed");
    $fe_stm->bindParam(':follower', $_GET['follower']);
    $fe_stm->bindParam(':followed', $_GET['followed']);
    $fe_stm->execute();
    $fer = $fe_stm->fetch(PDO::FETCH_ASSOC);

    if($fer != false && count($fer) > 0) {
        $rf_stm = $pdo->prepare("DELETE FROM `add_friends` WHERE `follower_id` = :follower AND `followed_id` = :followed");
        
        $rf_stm->bindParam(':follower', $_GET['follower']);
        $rf_stm->bindParam(':followed', $_GET['followed']);
    
        if($rf_stm->execute()) {
            $response = ['status' => 1];
        } else {
            $response = ['status' => 0];
        }
    
        echo json_encode($response);
    } else {
        // follow
        $f_stm = $pdo->prepare("INSERT INTO `add_friends` (`follower_id`, `followed_id`) VALUES (:follower, :followed)");
        
        $f_stm->bindParam(':follower', $_GET['follower']);
        $f_stm->bindParam(':followed', $_GET['followed']);
    
        if($f_stm->execute()) {
            $response = ['status' => 1];
        } else {
            $response = ['status' => 0];
        }
    
        echo json_encode($response);
    }
}


// Action: get_user_followers
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_user_followers&id=x
if($action == 'get_user_followers' && is_set($_GET['id']) && $method == 'GET') {
    $followers = [];

    
    $followers_stm = $pdo->prepare("SELECT `id`,`email`,`name`,`discordUsername` FROM `users` INNER JOIN `add_friends` ON `users`.`id` = `add_friends`.`followed_id` WHERE `add_friends`.`follower_id` = :id");
    $followers_stm->bindParam(':id', $_GET['id']);
    $followers_stm->execute();
    while($row = $followers_stm->fetch(PDO::FETCH_ASSOC)) {
            $followers[] = $row;
    }

    echo json_encode(['followers' => $followers]);
}

// Action: search_follower_users
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=search_follower_users&discordUsername=x
if($action == 'search_follower_users' && is_set($_GET['discordUsername']) && $method == 'GET') {
    $search_users = [];

    
    $search_users_stm = $pdo->prepare("SELECT `id`,`email`,`name`,`discordUsername` FROM `users` WHERE `discordUsername` = :discordUsername");
    $search_users_stm->bindParam(':discordUsername', $_GET['discordUsername']);
    $search_users_stm->execute();
    while($row = $search_users_stm->fetch(PDO::FETCH_ASSOC)) {
            $search_users[] = $row;
    }

    echo json_encode(['search_users' => $search_users]);
}



// Action: Get_server
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_server&id=X
if($action == 'get_server' && is_set($_GET['id']) && $method == 'GET') {
    $server = [];

    // fetch user data
    $server_stm = $pdo->prepare("SELECT * FROM `server_create` WHERE `id` = :id");
    $server_stm->bindParam(':id', $_GET['id']);
    $server_stm->execute();
    $server = $server_stm->fetch(PDO::FETCH_ASSOC);
 
    echo json_encode(['server' => $server ]);
}

// Action: get_user_in_server
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_user_in_server&id=X
if($action == 'get_user_in_server' && is_set($_GET['id']) && $method == 'GET') {
    $users = [];
   
    // fetch user data
    $user_stm = $pdo->prepare("SELECT * 
    FROM `users` 
    INNER JOIN `users_server` ON `users_server`.`users_id` = `users`.`id` WHERE	`users_server`.`server_id` = :id
    ");
    $user_stm->bindParam(':id', $_GET['id']);
    $user_stm->execute();
    

    while($row = $user_stm->fetch(PDO::FETCH_ASSOC)){
        $users[] = $row;
    }

    echo json_encode(['users' => $users]);
}


// Action: leave_server
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=leave_server&id=X&server_id=X
if($action == 'leave_server' && is_set($_GET['id']) && is_set($_GET['server_id']) && $method == 'GET') {
    $user_id = $_GET['id'];
    $server_id = $_GET['server_id'];

    $leave_server_stm = $pdo->prepare("DELETE FROM `users_server` WHERE `users_id`= :id AND `users_server`.`server_id` = :server_id");
    $leave_server_stm->bindParam(':id',$user_id);
    $leave_server_stm->bindParam(':server_id',$server_id);

    if($leave_server_stm->execute()){
        echo json_encode(['leave' => "useri u fshi nga serveri "]);
    }
   
}

// Action: get_servers_id_im_in
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_servers_im_in&id=X
if($action == 'get_servers_id_im_in' && is_set($_GET['id']) && $method == 'GET') {
    $servers = [];
   
    // fetch user data
    $servers_im_in_stm = $pdo->prepare("SELECT `users_server`.* FROM `users_server` INNER JOIN `users` ON `users`.`id` = `users_server`.`users_id` WHERE `users`.`id` = :id");
    $servers_im_in_stm->bindParam(':id', $_GET['id']);
    $servers_im_in_stm->execute();
    

    while($row = $servers_im_in_stm->fetch(PDO::FETCH_ASSOC)){
        $servers[] = $row;
    }

    echo json_encode(['servers' => $servers]);
}


// Action: get_servers_im_in
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_servers_im_in&id=X
if($action == 'get_servers_im_in' && is_set($_GET['id']) && $method == 'GET') {
    $servers = [];
   
    // fetch user data
    $servers_im_in_stm = $pdo->prepare("SELECT * FROM `server_create` WHERE `server_create`.`id` = :id");
    $servers_im_in_stm->bindParam(':id', $_GET['id']);
    $servers_im_in_stm->execute();
    

    while($row = $servers_im_in_stm->fetch(PDO::FETCH_ASSOC)){
        $servers[] = $row;
    }

    echo json_encode(['servers' => $servers]);
}


// Action: get_servers_owner
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_servers_owner&server_id=X
if($action == 'get_servers_owner'  && is_set($_GET['server_id']) && $method == 'GET') {
    $users = [];
   
    // fetch user data
    $get_servers_owner = $pdo->prepare("SELECT * FROM `users` INNER JOIN `server_create` ON `server_create`.`user_id` = `users`.`id` WHERE  `server_create`.`id` = :server_id");
    $get_servers_owner->bindParam(':server_id', $_GET['server_id']);
    $get_servers_owner->execute();
    

    while($row = $get_servers_owner->fetch(PDO::FETCH_ASSOC)){
        $users[] = $row;
    }

    echo json_encode(['users' => $users]);
}


// Action: Get_server_channels
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=get_server_channels&id=X
if($action == 'get_server_channels' && is_set($_GET['id']) && $method == 'GET') {
    $channels = [];

   
    $server_channels_stm = $pdo->prepare("SELECT `channels`.*
        FROM `channels`
        INNER JOIN `server_create` ON `server_create`.`id` = `channels`.`server_id`
        WHERE `server_create`.`id` = :id
        ORDER BY SUBSTRING(`channels`.`name`, 0) ASC, `channels`.`name` ASC");
    $server_channels_stm->bindParam(':id', $_GET['id']);
    $server_channels_stm->execute();
   while($row = $server_channels_stm->fetch(PDO::FETCH_ASSOC)){
    $channels[]= $row;
   }
 
    echo json_encode(['channels' => $channels ]);
}



// Action: channel_create
// HTTP verb: POST
// URL: http://localhost/php-full-project/php-project/api/api.php
if(is_set($payload) && ($payload['action'] == 'channel_create') && $method == 'POST') {

    $server_create_stm = $pdo->prepare("INSERT INTO `channels` (`server_id`, `name`) VALUES (:server_id, :name)");
    $server_create_stm->bindParam(':server_id', $payload['server_id']);
    $server_create_stm->bindParam(':name', $payload['name']);
    if($server_create_stm->execute()){
        $response = ['status' => 1, 'message' => 'Channeli u krijua me sukses.'];
    }else {
        $response = ['status' => 0, 'message' => 'Channeli nuk u krijua.'];
    }
  echo json_encode($response);  
}


// Action: leave_owner_server
// HTTP verb: GET
// URL: http://localhost/php-full-project/php-project/api/api.php?action=leave_owner_server&server_id=X&user_id=X
if($action == 'leave_owner_server' && is_set($_GET['server_id']) && is_set($_GET['user_id']) && $method == 'GET') {

   
    $server_owner_delete = $pdo->prepare("DELETE FROM `server_create` WHERE `server_create`.`id` = :server_id AND `server_create`.`user_id` =:user_id");
    $server_owner_delete->bindParam(':server_id', $_GET['server_id']);
    $server_owner_delete->bindParam(':user_id', $_GET['user_id']);

  if($server_owner_delete->execute()){
        echo json_encode(['leave' => "Owneri u fshi nga serveri "]);
    }  
}
    







