<?php
    
    include "../php/mysql.db.php";
    $db = new koneksi();

    include "../php/initial.php";
    $conn = $db->connect();

    $sql= "SELECT photo FROM tabel_photo WHERE id=" . $_GET['id'];
    $db->query($sql, $rec_num, $rs);
    $db->close($conn);

    //MENAMPILKAN GAMBAR:
    header("Content-type: image/jpeg");
    print($rs[0]["photo"]);
			
?>