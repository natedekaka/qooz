<?php
require_once __DIR__ . '/../init.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'list') {
    $scheduleId = $_GET['schedule_id'] ?? '';
    $sessionId = $_GET['session_id'] ?? '';
    
    if ($scheduleId) {
        $result = conn()->query("SELECT * FROM attendance WHERE scheduled_quiz_id = '$scheduleId' ORDER BY ranked_position ASC");
    } elseif ($sessionId) {
        $result = conn()->query("SELECT a.*, p.nama_siswa, p.skor_total FROM attendance a 
                                LEFT JOIN players p ON a.player_id = p.id 
                                WHERE a.session_id = '$sessionId' ORDER BY a.ranked_position ASC");
    } else {
        response(['error' => 'Parameter tidak valid'], 400);
    }
    
    $attendance = [];
    while ($row = $result->fetch_assoc()) {
        $attendance[] = $row;
    }
    
    response(['attendance' => $attendance]);
}

if ($method === 'GET' && $action === 'summary') {
    $scheduleId = $_GET['schedule_id'] ?? '';
    $userId = $_GET['user_id'] ?? '';
    
    if ($scheduleId) {
        $result = conn()->query("SELECT 
            COUNT(*) as total_player,
            SUM(CASE WHEN hadir = TRUE THEN 1 ELSE 0 END) as total_hadir,
            SUM(CASE WHEN ranked_position = 1 THEN 1 ELSE 0 END) as totalJuara,
            AVG(skor) as rata_skor
            FROM attendance WHERE scheduled_quiz_id = '$scheduleId'");
    } elseif ($userId) {
        $result = conn()->query("SELECT 
            COUNT(*) as total_sesi,
            SUM(CASE WHEN hadir = TRUE THEN 1 ELSE 0 END) as total_hadir,
            SUM(skor) as total_skor_all
            FROM attendance a
            JOIN scheduled_quizzes sq ON a.scheduled_quiz_id = sq.id
            WHERE sq.user_id = '$userId'");
    } else {
        response(['error' => 'Parameter tidak valid'], 400);
    }
    
    $summary = $result->fetch_assoc();
    
    response(['summary' => $summary]);
}

if ($method === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'record') {
        $sessionId = $_POST['session_id'] ?? '';
        $scheduledQuizId = $_POST['scheduled_quiz_id'] ?? '';
        $playerId = $_POST['player_id'] ?? '';
        $namaSiswa = $_POST['nama_siswa'] ?? '';
        $hadir = $_POST['hadir'] ?? 'true';
        $skor = $_POST['skor'] ?? 0;
        $rankedPosition = $_POST['ranked_position'] ?? null;
        
        if (!$sessionId || !$playerId) {
            response(['error' => 'Data tidak lengkap'], 400);
        }
        
        $id = generateUUID();
        $hadirBool = $hadir === 'true' ? TRUE : FALSE;
        
        $stmt = conn()->prepare("INSERT INTO attendance (id, session_id, scheduled_quiz_id, player_id, nama_siswa, hadir, skor, ranked_position) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('sssssbii', $id, $sessionId, $scheduledQuizId, $playerId, $namaSiswa, $hadirBool, $skor, $rankedPosition);
        
        if ($stmt->execute()) {
            response(['success' => true]);
        } else {
            response(['error' => 'Gagal mencatat kehadiran'], 500);
        }
    }
    
    if ($action === 'update') {
        $attendanceId = $_POST['attendance_id'] ?? '';
        $hadir = $_POST['hadir'] ?? 'true';
        $skor = $_POST['skor'] ?? 0;
        $rankedPosition = $_POST['ranked_position'] ?? null;
        
        $hadirBool = $hadir === 'true' ? TRUE : FALSE;
        
        conn()->query("UPDATE attendance SET hadir = $hadirBool, skor = $skor, ranked_position = $rankedPosition WHERE id = '$attendanceId'");
        
        response(['success' => true]);
    }
}

response(['error' => 'Method tidak valid'], 405);
