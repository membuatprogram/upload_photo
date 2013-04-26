<?php

    include "../php/mysql.db.php";
    $db = new koneksi();

    include "../php/initial.php";
    $conn = $db->connect();

    $start   = strlen($_POST["start"])==0?"":$_POST["start"];
    $end     = strlen($_POST["limit"])==0?"":$_POST["limit"];
    $sort    = !isset($_POST["sort"])?"":$_POST["sort"];
    $dir     = !isset($_POST["dir"])?"":$_POST["dir"];

    $search   = !isset($_POST["query"])?"":$_POST["query"];

    $sql = "SELECT COUNT(id) AS TOTAL FROM tabel_photo WHERE 1" .
            (strlen($search)>0?(" AND nama LIKE '%$search%'"):"");
    $db->query($sql, $rec_num, $rs);
    $nbrows = $rs[0]["TOTAL"];

    $data = array();
    if($nbrows>0) {
        $sql = "SELECT id,nama FROM tabel_photo WHERE 1 " .
               (strlen($search)>0?("AND nama LIKE '%$search%' "):"")  .
               (strlen($sort)>0?("ORDER BY `$sort` $dir "):"")  .
               "LIMIT $start, $end";
        $db->query($sql, $rec_num, $rs);
        for($i=0;$i<$rec_num; $i++)
            $data[$i] = array("no" => ($start+$i+1), "id" => $rs[$i]["id"], "nama" => $rs[$i]["nama"]);

    }
    $db->close($conn);

    include "../php/Json.php";
    $json = new Json();

    $result = array(
        "totalCount" => $nbrows,
        "topics" => $data
    );
    die($json->encode($result));

?>