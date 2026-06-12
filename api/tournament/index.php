<?php
require_once __DIR__ . '/../init.php';

$method = $_SERVER['REQUEST_METHOD'];

function standardBracketSeeds(int $slots): array {
    $seeds = [1];
    while (count($seeds) < $slots) {
        $nextBatch = [];
        $half = count($seeds);
        foreach ($seeds as $s) {
            $nextBatch[] = $s;
            $nextBatch[] = 2 * $half + 1 - $s;
        }
        $seeds = $nextBatch;
    }
    return $seeds;
}

function createEmptyBracket(string $tournamentId, int $totalRounds): void {
    $totalSlots = pow(2, $totalRounds);
    for ($round = 1; $round <= $totalRounds; $round++) {
        $matchesInRound = pow(2, $totalRounds - $round);
        for ($i = 0; $i < $matchesInRound; $i++) {
            $id = generateUUID();
            $stmt = conn()->prepare(
                "INSERT INTO tournament_matches (id, tournament_id, round, match_index, status) VALUES (?, ?, ?, ?, 'pending')"
            );
            $stmt->bind_param('ssii', $id, $tournamentId, $round, $i);
            $stmt->execute();
        }
    }
}

if ($method === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'list') {
        $userId = $_GET['user_id'] ?? '';
        if (!$userId) response(['error' => 'Unauthorized'], 401);

        $result = conn()->query(
            "SELECT t.*, (SELECT COUNT(*) FROM tournament_participants WHERE tournament_id = t.id) as total_peserta
             FROM tournaments t WHERE t.user_id = '$userId' ORDER BY t.created_at DESC"
        );
        $tournaments = [];
        while ($row = $result->fetch_assoc()) {
            $tournaments[] = $row;
        }
        response(['tournaments' => $tournaments]);
    }

    if ($action === 'detail') {
        $id = $_GET['id'] ?? '';
        if (!$id) response(['error' => 'ID required'], 400);

        $result = conn()->query("SELECT * FROM tournaments WHERE id = '$id'");
        $tournament = $result->fetch_assoc();
        if (!$tournament) response(['error' => 'Tournament not found'], 404);

        $pResult = conn()->query(
            "SELECT * FROM tournament_participants WHERE tournament_id = '$id' ORDER BY seed ASC"
        );
        $participants = [];
        while ($row = $pResult->fetch_assoc()) {
            $participants[] = $row;
        }

        $mResult = conn()->query(
            "SELECT m.*, p1.nama_peserta as player1_nama, p2.nama_peserta as player2_nama,
                    w.nama_peserta as winner_nama
             FROM tournament_matches m
             LEFT JOIN tournament_participants p1 ON m.player1_id = p1.id
             LEFT JOIN tournament_participants p2 ON m.player2_id = p2.id
             LEFT JOIN tournament_participants w ON m.winner_id = w.id
             WHERE m.tournament_id = '$id'
             ORDER BY m.round ASC, m.match_index ASC"
        );
        $matches = [];
        while ($row = $mResult->fetch_assoc()) {
            $matches[] = $row;
        }

        $tournament['participants'] = $participants;
        $tournament['matches'] = $matches;
        response(['tournament' => $tournament]);
    }

    if ($action === 'match_state') {
        $matchId = $_GET['match_id'] ?? '';
        if (!$matchId) response(['error' => 'Match ID required'], 400);

        $result = conn()->query(
            "SELECT m.*, p1.nama_peserta as player1_nama, p2.nama_peserta as player2_nama
             FROM tournament_matches m
             LEFT JOIN tournament_participants p1 ON m.player1_id = p1.id
             LEFT JOIN tournament_participants p2 ON m.player2_id = p2.id
             WHERE m.id = '$matchId'"
        );
        $match = $result->fetch_assoc();
        if (!$match) response(['error' => 'Match not found'], 404);

        $gameSession = null;
        if ($match['session_id']) {
            $gsResult = conn()->query(
                "SELECT id, pin, status, question_index, current_question_id FROM game_sessions WHERE id = '{$match['session_id']}'"
            );
            $gameSession = $gsResult->fetch_assoc();
        }

        response(['match' => $match, 'game_session' => $gameSession]);
    }

    if ($action === 'standings') {
        $tournamentId = $_GET['tournament_id'] ?? '';
        if (!$tournamentId) response(['error' => 'Tournament ID required'], 400);

        $result = conn()->query(
            "SELECT * FROM tournament_participants WHERE tournament_id = '$tournamentId' ORDER BY 
             CASE WHEN status = 'winner' THEN 0 WHEN status = 'active' THEN 1 ELSE 2 END,
             skor_total DESC"
        );
        $participants = [];
        while ($row = $result->fetch_assoc()) {
            $participants[] = $row;
        }
        response(['standings' => $participants]);
    }

    response(['error' => 'Action tidak valid'], 400);
}

if ($method === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $userId = $_POST['user_id'] ?? '';
        $judul = $_POST['judul'] ?? '';
        $deskripsi = $_POST['deskripsi'] ?? '';
        $maxPeserta = intval($_POST['max_peserta'] ?? 16);

        if (!$userId || !$judul) {
            response(['error' => 'Data tidak lengkap'], 400);
        }

        $id = generateUUID();
        $code = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));

        $stmt = conn()->prepare(
            "INSERT INTO tournaments (id, user_id, judul, deskripsi, max_participants, code) VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param('ssssis', $id, $userId, $judul, $deskripsi, $maxPeserta, $code);

        if ($stmt->execute()) {
            response(['success' => true, 'tournament' => [
                'id' => $id,
                'judul' => $judul,
                'code' => $code
            ]]);
        } else {
            response(['error' => 'Gagal membuat turnamen'], 500);
        }
    }

    if ($action === 'delete') {
        $userId = $_POST['user_id'] ?? '';
        $tournamentId = $_POST['tournament_id'] ?? '';

        conn()->query("DELETE FROM tournaments WHERE id = '$tournamentId' AND user_id = '$userId'");
        response(['success' => true]);
    }

    if ($action === 'add_participant') {
        $tournamentId = $_POST['tournament_id'] ?? '';
        $nama = $_POST['nama'] ?? '';

        if (!$tournamentId || !$nama) {
            response(['error' => 'Data tidak lengkap'], 400);
        }

        $check = conn()->query("SELECT status, max_participants FROM tournaments WHERE id = '$tournamentId'");
        $tournament = $check->fetch_assoc();
        if (!$tournament) response(['error' => 'Turnamen tidak ditemukan'], 404);
        if ($tournament['status'] !== 'setup') response(['error' => 'Turnamen sudah dimulai'], 400);

        $countResult = conn()->query(
            "SELECT COUNT(*) as total FROM tournament_participants WHERE tournament_id = '$tournamentId'"
        );
        $count = $countResult->fetch_assoc()['total'];
        if ($count >= $tournament['max_participants']) {
            response(['error' => 'Peserta sudah penuh'], 400);
        }

        $nameCheck = conn()->query(
            "SELECT id FROM tournament_participants WHERE tournament_id = '$tournamentId' AND LOWER(nama_peserta) = '" . strtolower(trim($nama)) . "'"
        );
        if ($nameCheck->num_rows > 0) {
            response(['error' => 'Nama sudah terdaftar'], 400);
        }

        $id = generateUUID();
        $seed = $count + 1;

        $stmt = conn()->prepare(
            "INSERT INTO tournament_participants (id, tournament_id, nama_peserta, seed) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param('sssi', $id, $tournamentId, $nama, $seed);

        if ($stmt->execute()) {
            response(['success' => true, 'participant' => [
                'id' => $id,
                'nama_peserta' => $nama,
                'seed' => $seed
            ]]);
        } else {
            response(['error' => 'Gagal menambah peserta'], 500);
        }
    }

    if ($action === 'remove_participant') {
        $tournamentId = $_POST['tournament_id'] ?? '';
        $participantId = $_POST['participant_id'] ?? '';

        $check = conn()->query("SELECT status FROM tournaments WHERE id = '$tournamentId'");
        $tournament = $check->fetch_assoc();
        if (!$tournament || $tournament['status'] !== 'setup') {
            response(['error' => 'Hanya bisa diubah saat status setup'], 400);
        }

        conn()->query("DELETE FROM tournament_participants WHERE id = '$participantId' AND tournament_id = '$tournamentId'");
        response(['success' => true]);
    }

    if ($action === 'start') {
        $tournamentId = $_POST['tournament_id'] ?? '';
        $userId = $_POST['user_id'] ?? '';

        $result = conn()->query("SELECT * FROM tournaments WHERE id = '$tournamentId' AND user_id = '$userId'");
        $tournament = $result->fetch_assoc();
        if (!$tournament) response(['error' => 'Turnamen tidak ditemukan'], 404);

        $pResult = conn()->query(
            "SELECT COUNT(*) as total FROM tournament_participants WHERE tournament_id = '$tournamentId' AND status = 'active'"
        );
        $participantCount = intval($pResult->fetch_assoc()['total']);

        if ($participantCount < 2) {
            response(['error' => 'Minimal 2 peserta'], 400);
        }

        $totalRounds = intval(ceil(log($participantCount, 2)));
        $totalSlots = intval(pow(2, $totalRounds));

        conn()->begin_transaction();

        try {
            createEmptyBracket($tournamentId, $totalRounds);

            $seeds = standardBracketSeeds($totalSlots);
            $seeds = array_values(array_filter($seeds, fn($s) => $s <= $participantCount));
            $byes = $totalSlots - $participantCount;

            $participants = [];
            $pRes = conn()->query(
                "SELECT id FROM tournament_participants WHERE tournament_id = '$tournamentId' AND status = 'active' ORDER BY seed ASC"
            );
            while ($row = $pRes->fetch_assoc()) {
                $participants[] = $row['id'];
            }

            $mResult = conn()->query(
                "SELECT id, match_index FROM tournament_matches WHERE tournament_id = '$tournamentId' AND round = 1 ORDER BY match_index ASC"
            );
            $round1Matches = [];
            while ($row = $mResult->fetch_assoc()) {
                $round1Matches[] = $row;
            }

            $round2Matches = [];
            $r2Result = conn()->query(
                "SELECT id, match_index FROM tournament_matches WHERE tournament_id = '$tournamentId' AND round = 2 ORDER BY match_index ASC"
            );
            while ($row = $r2Result->fetch_assoc()) {
                $round2Matches[] = $row;
            }

            $r1Assigned = 0;
            $r2Assigned = 0;
            foreach ($seeds as $seedPos) {
                if ($seedPos > $participantCount) continue;

                $pid = $participants[$seedPos - 1];

                if ($seedPos <= $byes) {
                    $r2Idx = intdiv($r2Assigned, 2);
                    $r2Col = ($r2Assigned % 2 == 0) ? 'player1_id' : 'player2_id';
                    $r2Assigned++;
                    if (isset($round2Matches[$r2Idx])) {
                        conn()->query(
                            "UPDATE tournament_matches SET $r2Col = '$pid' WHERE id = '{$round2Matches[$r2Idx]['id']}'"
                        );
                    }
                } else {
                    $r1Idx = intdiv($r1Assigned, 2);
                    $r1Col = ($r1Assigned % 2 == 0) ? 'player1_id' : 'player2_id';
                    $r1Assigned++;
                    if (isset($round1Matches[$r1Idx])) {
                        conn()->query(
                            "UPDATE tournament_matches SET $r1Col = '$pid' WHERE id = '{$round1Matches[$r1Idx]['id']}'"
                        );
                    }
                }
            }

            conn()->query(
                "UPDATE tournaments SET status = 'active', current_round = 1, total_rounds = $totalRounds WHERE id = '$tournamentId'"
            );

            conn()->commit();
            response(['success' => true]);
        } catch (Exception $e) {
            conn()->rollback();
            response(['error' => 'Gagal generate bracket: ' . $e->getMessage()], 500);
        }
    }

    if ($action === 'finish_match') {
        $matchId = $_POST['match_id'] ?? '';
        $winnerId = $_POST['winner_id'] ?? '';
        $player1Score = intval($_POST['player1_score'] ?? 0);
        $player2Score = intval($_POST['player2_score'] ?? 0);

        if (!$matchId || !$winnerId) {
            response(['error' => 'Data tidak lengkap'], 400);
        }

        $result = conn()->query("SELECT * FROM tournament_matches WHERE id = '$matchId'");
        $match = $result->fetch_assoc();
        if (!$match) response(['error' => 'Match tidak ditemukan'], 404);

        conn()->query(
            "UPDATE tournament_matches SET status = 'finished', winner_id = '$winnerId',
             player1_score = $player1Score, player2_score = $player2Score
             WHERE id = '$matchId'"
        );

        $loserId = ($winnerId === $match['player1_id']) ? $match['player2_id'] : $match['player1_id'];
        if ($loserId) {
            conn()->query(
                "UPDATE tournament_participants SET status = 'eliminated' WHERE id = '$loserId'"
            );
        }

        $winnerScore = ($winnerId === $match['player1_id']) ? $player1Score : $player2Score;
        if ($winnerScore > 0) {
            conn()->query(
                "UPDATE tournament_participants SET skor_total = skor_total + $winnerScore WHERE id = '$winnerId'"
            );
        }

        $tournamentResult = conn()->query(
            "SELECT * FROM tournaments WHERE id = '{$match['tournament_id']}'"
        );
        $tournament = $tournamentResult->fetch_assoc();
        $isFinalRound = ($match['round'] == $tournament['total_rounds']);

        if ($isFinalRound) {
            conn()->query(
                "UPDATE tournament_participants SET status = 'winner' WHERE id = '$winnerId'"
            );
            conn()->query(
                "UPDATE tournaments SET status = 'finished' WHERE id = '{$match['tournament_id']}'"
            );
        }

        response(['success' => true, 'is_final' => $isFinalRound]);
    }

    if ($action === 'advance_round') {
        $tournamentId = $_POST['tournament_id'] ?? '';
        $userId = $_POST['user_id'] ?? '';

        $result = conn()->query("SELECT * FROM tournaments WHERE id = '$tournamentId' AND user_id = '$userId'");
        $tournament = $result->fetch_assoc();
        if (!$tournament) response(['error' => 'Turnamen tidak ditemukan'], 404);

        $currentRound = $tournament['current_round'];
        $nextRound = $currentRound + 1;

        $checkResult = conn()->query(
            "SELECT COUNT(*) as total FROM tournament_matches
             WHERE tournament_id = '$tournamentId' AND round = $currentRound AND status != 'finished'"
        );
        $pendingMatches = intval($checkResult->fetch_assoc()['total']);
        if ($pendingMatches > 0) {
            response(['error' => 'Semua match di round ini harus selesai dulu'], 400);
        }

        if ($nextRound > $tournament['total_rounds']) {
            response(['error' => 'Turnamen sudah selesai'], 400);
        }

        $winners = [];
        $wResult = conn()->query(
            "SELECT winner_id FROM tournament_matches
             WHERE tournament_id = '$tournamentId' AND round = $currentRound AND winner_id IS NOT NULL
             ORDER BY match_index ASC"
        );
        while ($row = $wResult->fetch_assoc()) {
            $winners[] = $row['winner_id'];
        }

        $nResult = conn()->query(
            "SELECT id, match_index FROM tournament_matches
             WHERE tournament_id = '$tournamentId' AND round = $nextRound ORDER BY match_index ASC"
        );
        $nextMatches = [];
        while ($row = $nResult->fetch_assoc()) {
            $nextMatches[] = $row;
        }

        foreach ($winners as $i => $winnerId) {
            if (isset($nextMatches[intdiv($i, 2)])) {
                $m = $nextMatches[intdiv($i, 2)];
                $col = ($i % 2 == 0) ? 'player1_id' : 'player2_id';
                conn()->query(
                    "UPDATE tournament_matches SET $col = '$winnerId' WHERE id = '{$m['id']}'"
                );
            }
        }

        conn()->query(
            "UPDATE tournaments SET current_round = $nextRound WHERE id = '$tournamentId'"
        );

        response(['success' => true, 'next_round' => $nextRound]);
    }

    response(['error' => 'Action tidak valid'], 400);
}

response(['error' => 'Method tidak valid'], 405);
