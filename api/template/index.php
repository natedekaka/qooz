<?php
require_once __DIR__ . '/../init.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'list') {
    $userId = $_GET['user_id'] ?? '';
    $includePublic = $_GET['include_public'] ?? 'false';
    
    if (!$userId) {
        response(['error' => 'Unauthorized'], 401);
    }
    
    $sql = "SELECT * FROM quiz_templates WHERE user_id = '$userId'";
    if ($includePublic === 'true') {
        $sql .= " OR is_public = TRUE";
    }
    $sql .= " ORDER BY created_at DESC";
    
    $result = conn()->query($sql);
    $templates = [];
    
    while ($row = $result->fetch_assoc()) {
        $templates[] = $row;
    }
    
    response(['templates' => $templates]);
}

if ($method === 'GET' && $action === 'detail') {
    $templateId = $_GET['id'] ?? '';
    
    if (!$templateId) {
        response(['error' => 'Template tidak ditemukan'], 404);
    }
    
    $result = conn()->query("SELECT * FROM quiz_templates WHERE id = '$templateId'");
    $template = $result->fetch_assoc();
    
    if (!$template) {
        response(['error' => 'Template tidak ditemukan'], 404);
    }
    
    $questionsResult = conn()->query("SELECT * FROM template_questions WHERE template_id = '$templateId' ORDER BY nomor_soal");
    $questions = [];
    
    while ($row = $questionsResult->fetch_assoc()) {
        $questions[] = $row;
    }
    
    $template['questions'] = $questions;
    
    response(['template' => $template]);
}

if ($method === 'POST') {
    $userId = $_POST['user_id'] ?? '';
    $action = $_POST['action'] ?? '';
    
    if (!$userId) {
        response(['error' => 'Unauthorized'], 401);
    }
    
    if ($action === 'create') {
        $judul = $_POST['judul'] ?? '';
        $deskripsi = $_POST['deskripsi'] ?? '';
        $kategori = $_POST['kategori'] ?? '';
        $isPublic = $_POST['is_public'] ?? 'false';
        
        if (!$judul) {
            response(['error' => 'Judul wajib diisi'], 400);
        }
        
        $id = generateUUID();
        $isPublicBool = $isPublic === 'true' ? TRUE : FALSE;
        
        $stmt = conn()->prepare("INSERT INTO quiz_templates (id, user_id, judul, deskripsi, kategori, is_public) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('sssssb', $id, $userId, $judul, $deskripsi, $kategori, $isPublicBool);
        
        if ($stmt->execute()) {
            response(['success' => true, 'template' => ['id' => $id, 'judul' => $judul]]);
        } else {
            response(['error' => 'Gagal membuat template'], 500);
        }
    }
    
    if ($action === 'duplicate') {
        $templateId = $_POST['template_id'] ?? '';
        
        if (!$templateId) {
            response(['error' => 'Template tidak ditemukan'], 404);
        }
        
        $result = conn()->query("SELECT * FROM quiz_templates WHERE id = '$templateId'");
        $template = $result->fetch_assoc();
        
        if (!$template) {
            response(['error' => 'Template tidak ditemukan'], 404);
        }
        
        $newId = generateUUID();
        $stmt = conn()->prepare("INSERT INTO quiz_templates (id, user_id, judul, deskripsi, kategori, is_public, jumlah_soal) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $newJudul = $template['judul'] . ' (Salinan)';
        $stmt->bind_param('sssssbi', $newId, $userId, $newJudul, $template['deskripsi'], $template['kategori'], $template['is_public'], $template['jumlah_soal']);
        
        if ($stmt->execute()) {
            conn()->query("INSERT INTO template_questions (id, template_id, nomor_soal, teks_soal, opsi_1, opsi_2, opsi_3, opsi_4, jawaban_benar, waktu_detik) 
                          SELECT CONCAT(UUID(), '-', ROW_NUMBER() OVER()), '$newId', nomor_soal, teks_soal, opsi_1, opsi_2, opsi_3, opsi_4, jawaban_benar, waktu_detik 
                          FROM template_questions WHERE template_id = '$templateId'");
            
            response(['success' => true, 'template' => ['id' => $newId, 'judul' => $newJudul]]);
        } else {
            response(['error' => 'Gagal menduplikasi template'], 500);
        }
    }
    
    if ($action === 'delete') {
        $templateId = $_POST['template_id'] ?? '';
        
        conn()->query("DELETE FROM quiz_templates WHERE id = '$templateId' AND user_id = '$userId'");
        
        response(['success' => true]);
    }
    
    if ($action === 'use_template') {
        $templateId = $_POST['template_id'] ?? '';
        $quizJudul = $_POST['judul'] ?? '';
        
        if (!$templateId || !$quizJudul) {
            response(['error' => 'Data tidak lengkap'], 400);
        }
        
        $result = conn()->query("SELECT * FROM quiz_templates WHERE id = '$templateId'");
        $template = $result->fetch_assoc();
        
        if (!$template) {
            response(['error' => 'Template tidak ditemukan'], 404);
        }
        
        $quizId = generateUUID();
        $stmt = conn()->prepare("INSERT INTO quizzes (id, user_id, judul, deskripsi, jumlah_soal) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssssi', $quizId, $userId, $quizJudul, $template['deskripsi'], $template['jumlah_soal']);
        $stmt->execute();
        
        $questionsResult = conn()->query("SELECT * FROM template_questions WHERE template_id = '$templateId' ORDER BY nomor_soal");
        while ($question = $questionsResult->fetch_assoc()) {
            $questionId = generateUUID();
            $stmt = conn()->prepare("INSERT INTO questions (id, quiz_id, nomor_soal, teks_soal, opsi_1, opsi_2, opsi_3, opsi_4, jawaban_benar, waktu_detik) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param('ssisssssii', $questionId, $quizId, $question['nomor_soal'], $question['teks_soal'], $question['opsi_1'], $question['opsi_2'], $question['opsi_3'], $question['opsi_4'], $question['jawaban_benar'], $question['waktu_detik']);
            $stmt->execute();
        }
        
        response(['success' => true, 'quiz' => ['id' => $quizId, 'judul' => $quizJudul]]);
    }
}

response(['error' => 'Method tidak valid'], 405);
