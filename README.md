### 実行方法 <br>
・xamppのhtdocsにプロジェクトを作成 <br>
・xamppでApache, MySQLを起動 <br>
・ターミナルを3つ立ち上げて以下のコマンドを実行 <br>
フロントエンド <br>
cdコマンドでcopla-vueディレクトリに移動し下記を実行 <br>
[npm run dev] <br>
<br>
サーバー1 <br>
cdコマンドでbackendディレクトリに移動し下記を実行 <br>
[node server.js] <br>
<br>
ソケットサーバー <br>
cdコマンドでbackendディレクトリに移動し、下記を実行 <br>
[node socket.js] <br>
<br>
その他トラブル <br>
モジュールがインストールされていない場合 <br>
以下を実行してください <br>
[npm install] <br>
<br>
<br>
### 技術<br>
フロントエンド<br>
・Vue.js<br>
・Vuetify<br>
・Vue Router<br>
・Vite<br>
(SPA開発のためVueを選択)<br>
<br>
バックエンド<br>
・Node.js<br>
・Express<br>
(一度使ったことがあるのと、<br>
非同期通信などが得意らしいのでPHPから変更しました。)<br>
・Socket.io<br>
<br>
データベース<br>
・MySQL<br>
(無料で使えるので利用)<br>
<br>
ローカル開発環境<br>
・XAMPP(MySQLを利用)<br>
<br>

### DB
### users
id	名前	タイプ	照合順序	Null	デフォルト値 <br>
1	userID 主	varchar(7)	utf8mb4_general_ci		いいえ	なし<br>
2	password	varchar(255)	utf8mb4_general_ci		いいえ	なし	<br>		
3	userName	varchar(20)	utf8mb4_general_ci		いいえ	なし		<br>
4	icon	varchar(30)	utf8mb4_general_ci		いいえ	#f0e68c		<br>
5	idName	varchar(30)	utf8mb4_general_ci		いいえ	なし			<br>
6	birthday	date			いいえ	なし		<br>
7	ini	int(11)			いいえ	0<br>
<br>
### posts
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他<br>
1	postID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	userID インデックス	varchar(7)	utf8mb4_general_ci		いいえ	なし		<br>
3	genre	int(11)			いいえ	なし			<br>
4	body	varchar(300)	utf8mb4_general_ci		いいえ	なし			<br>
5	pic	varchar(50)	utf8mb4_general_ci		いいえ	なし		<br>
6	location	varchar(50)	utf8mb4_general_ci		いいえ	なし	<br>		
7	datetime	datetime			いいえ	なし			<br>
8	fav	int(11)			いいえ	0			<br>
9	title	text	utf8mb4_general_ci		いいえ	なし			<br>
10	tags	varchar(60)	utf8mb4_general_ci		いいえ	なし<br>
<br>
### post_likes
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	likeID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	postID インデックス	int(11)			いいえ	なし		<br>
3	userID インデックス	varchar(7)	utf8mb4_general_ci		いいえ	なし<br>
<br>
### replies
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	repID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	postID	int(11)			いいえ	なし			<br>
3	userID	varchar(7)	utf8mb4_general_ci		いいえ	なし	<br>
4	body	varchar(300)	utf8mb4_general_ci		いいえ	なし		<br>
5	pic	varchar(30)	utf8mb4_general_ci		いいえ	なし		<br>
6	location	varchar(50)	utf8mb4_general_ci		いいえ	なし	<br>
7	datetime	datetime			いいえ	なし		<br>
8	fav	int(11)			いいえ	0<br>
<br>
### reply_likes
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	likeID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	repID インデックス	int(11)			いいえ	なし			<br>
3	userID インデックス	varchar(7)	utf8mb4_general_ci		いいえ	なし <br>
<br>
### bookmarks
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	bookmarkID 主	int(11)			いいえ	なし		AUTO_INCREMENT <br>
2	postID	int(11)			いいえ	なし			<br>
3	userID	varchar(7)	utf8mb4_general_ci		いいえ	なし <br>
<br>
### bustime
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	departID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	station	int(11)			いいえ	なし		<br>
3	dest	int(1)			いいえ	なし	<br>
4	depTime	time			いいえ	00:00:00	<br>	
5	endTime	time			いいえ	00:00:00		<br>
6	schedule	int(11)			いいえ	なし<br>
<br>
### menus
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	menuID 主	int(11)			いいえ	なし		AUTO_INCREMENT<br>
2	genre	int(11)			いいえ	なし		<br>
3	menuName	varchar(10)	utf8mb4_general_ci		いいえ	なし			<br>
4	comment	varchar(10)	utf8mb4_general_ci		いいえ	なし			<br>
5	detail	varchar(30)	utf8mb4_general_ci		いいえ	なし			<br>
6	image	varchar(30)	utf8mb4_general_ci		いいえ	なし			<br>
7	price	int(5)			いいえ	なし		<br>
8	fav	int(11)			いいえ	なし<br>
<br>
### menu_sales
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	salesID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	menuID	int(11)			いいえ	なし			<br>
3	saleDate	date			いいえ	current_timestamp()			<br>
4	fav	int(11)			いいえ	なし<br>
<br>
### votes
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	voteID 主	int(11)			いいえ	なし		AUTO_INCREMENT	<br>
2	userID	varchar(7)	utf8mb4_general_ci		いいえ	なし		<br>
3	menuID	int(11)			いいえ	なし		<br>
4	voteDate	date			いいえ	current_timestamp()	<br>
<br>
### timetable
id	名前	タイプ	照合順序	属性	Null	デフォルト値	その他 <br>
1	timetableID 主	int(11)			いいえ	なし		AUTO_INCREMENT<br>	
2	userID	varchar(7)	utf8mb4_general_ci		いいえ	なし			<br>
3	className	varchar(30)	utf8mb4_general_ci		いいえ	なし			<br>
4	room	varchar(11)	utf8mb4_general_ci		いいえ	なし			<br>
5	detail	varchar(30)	utf8mb4_general_ci		いいえ	なし			<br>
6	dayID	int(1)			いいえ	なし			<br>
7	periodID	int(1)			いいえ	なし<br>
