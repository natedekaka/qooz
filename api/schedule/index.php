<?php
require_once __DIR__ . '/../init.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'list') {
    $userId = $_GET['user_id'] ?? '';
    
    if (!$userId) {
        response(['error' => 'Unauthorized'], 401);
    }
    
    $result = conn()->query("SELECT sq.*, q.judul as quiz_judul FROM scheduled_quizzes sq 
                           LEFT JOIN quizzes q ON sq.quiz_id = q.id 
                           WHERE sq.user_id = '$userId' 
                           ORDER BY sq.scheduled_at DESC");
    $schedules = [];
    
    while ($row = $result->fetch_assoc()) {
        $schedules[] = $row;
    }
    
    response(['schedules' => $schedules]);
}

if ($method === 'GET' && $action === 'upcoming') {
    $result = conn()->query("SELECT sq.*, q.judul as quiz_judul FROM scheduled_quizzes sq 
                           LEFT JOIN quizzes q ON sq.quiz_id = q.id 
                           WHERE sq.status = 'pending' AND sq.scheduled_at > NOW()
                           ORDER BY sq.scheduled_at ASC LIMIT 10");
    $schedules = [];
    
    while ($row = $result->fetch_assoc()) {
        $schedules[] = $row;
    }
    
    response(['schedules' => $schedules]);
}

if ($method === 'POST') {
    $userId = $_POST['user_id'] ?? '';
    $action = $_POST['action'] ?? '';
    
    if (!$userId) {
        response(['error' => 'Unauthorized'], 401);
    }
    
    if ($action === 'create') {
        $quizId = $_POST['quiz_id'] ?? '';
        $scheduledAt = $_POST['scheduled_at'] ?? '';
        $maxPlayers = $_POST['max_players'] ?? 50;
        
        if (!$quizId || !$scheduledAt) {
            response(['error' => 'Data tidak lengkap'], 400);
        }
        
        $id = generateUUID();
        
        $stmt = conn()->prepare("INSERT INTO scheduled_quizzes (id, quiz_id, user_id, scheduled_at, max_players) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssssi', $id, $quizId, $userId, $scheduledAt, $maxPlayers);
        
        if ($stmt->execute()) {
            response(['success' => true, 'schedule' => ['id' => $id]]);
        } else {
            response(['error' => 'Gagal menjadwalkan kuis'], 500);
        }
    }
    
    if ($action === 'cancel') {
        $scheduleId = $_POST['schedule_id'] ?? '';
        
        conn()->query("UPDATE scheduled_quizzes SET status = 'cancelled' WHERE id = '$scheduleId' AND user_id = '$userId'");
        
        response(['success' => true]);
    }
    
    if ($action === 'start') {
        $scheduleId = $_POST['schedule_id'] ?? '';
        
        $result = conn()->query("SELECT * FROM scheduled_quizzes WHERE id = '$scheduleId' AND user_id = '$userId'");
        $schedule = $result->fetch_assoc();
        
        if (!$schedule) {
            response(['error' => 'Jadwal tidak ditemukan'], 404);
        }
        
        conn()->query("UPDATE scheduled_quizzes SET status = 'started', started_at = NOW() WHERE id = '$scheduleId'");
        
        $gameId = generateUUID();
        $pin = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $stmt = conn()->prepare("INSERT INTO game_sessions (id, pin, quiz_id, user_id, status) VALUES (?, ?, ?, ?, 'lobby')");
        $stmt->bind_param('ssss', $gameId, $pin, $schedule['quiz_id'], $userId);
        $stmt->execute();
        
        response(['success' => true, 'game' => ['id' => $gameId, 'pin' => $pin]]);
    }
    
    if ($action === 'delete') {
        $scheduleId = $_POST['schedule_id'] ?? '';
        
        conn()->query("DELETE FROM scheduled_quizzes WHERE id = '$scheduleId' AND user_id = '$userId'");
        
        response(['success' => true]);
    }
}

response(['error' => 'Method tidak valid'], 405);
