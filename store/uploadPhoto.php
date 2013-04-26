<?php
    $photo = NULL;
    if (!empty($_FILES["filename"]))
        if ($_FILES["filename"]['error'] > 0)
            die("{success:false, message: \"Kelsalahan file photo.\"}");

    $file=$_FILES["filename"];
    $upload_directory=realpath(dirname(__FILE__)) . "/";
    $ext_str = "jpg,png,gif,bmp";
    $allowed_extensions=explode(',',$ext_str);
    $max_file_size = 102400; //1024bytes =1kbytes
    $overwrite_file = true;

    /* check allowed extensions here */
    $ext = substr($file['name'], strrpos($file['name'], '.') + 1); //get file extension from last sub string from last . character
    if (!in_array(strtolower($ext), $allowed_extensions))
        die("{success:false, message: \"Hanya file yang berekstensi '$ext_str' yang bisa di upload.\"}"); // exit the script by warning

    /* check file size of the file if it exceeds the specified size warn user */
    if($file['size']>=$max_file_size)
        die("{success:false, message: \"Ukuran file tidak boleh melebisi  " . ($max_file_size/1024) . "kb.\"}"); // exit the script by warning

    if(!move_uploaded_file($file['tmp_name'],$upload_directory.$file['name']))
        die("{success:false, message: \"Proses upload photo gagal.\"}"); //file can't moved with unknown reasons likr cleaning of server temperory files cleaning

    $instr = fopen($upload_directory.$file['name'],"rb");
    $photo = addslashes(fread($instr,filesize($upload_directory.$file['name'])));
    fclose($instr);
    unlink($upload_directory.$file['name']);

    include "../php/mysql.db.php";
    $db = new koneksi();

    include "../php/initial.php";
    $conn = $db->connect();

    $sql = "INSERT INTO tabel_photo(nama,photo) VALUES('" . $file['name'] . "', '$photo')";
    //die("{success:false, message: \"" . $sql . "\"}");
    $db->execute($conn, $sql);
    $db->close($conn);

    die("{success:true, message: \"Proses upload photo berhasil.\"}");

?>