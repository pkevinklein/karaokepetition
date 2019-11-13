SELECT singers.name AS singer_name, songs.name AS song_name
FROM singers
JOIN songs
ON singers.id = songs.singer_id;

singer_name |  song_name
-------------+-------------
Nicki Minaj | Anaconda
Lady Gaga   | Bad Romance
Lady Gaga   | Paparazzi
Tom Jones   | Sex Bomb
