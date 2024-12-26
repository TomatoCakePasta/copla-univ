# 学内SNS Copla(コプラ)
学内生限定のSNS  
既存のXと比較して在学生同士の密なコミュニケーションを促進するために制作しました  

# DEMO
SNSの基本機能から、大学ならではの機能まで実装  
Coplaひとつで学生生活をより快適にします  

https://github.com/user-attachments/assets/5581bba0-8236-40c6-96cb-cd9780a4b003

# Features
・授業をきっかけに制作したアプリのコンセプトを引き継ぎ、個人で継続開発  
技術を刷新し、初めてフルスタックで完成させたアプリ  
<br>
実装の過程で綺麗なコードについて考え、バックエンドをController, Modelに分割しました  
UIUXは少ないクリック数で欲しい情報にたどり着ける設計で、同じレイアウトにすることで操作熟練度の壁をなくしました  
フロントエンドのページを全てComponentに入れてしまったことが反省点です  

# Installation
```bash
npm install
```

# Usage
初回  
・xamppのhtdocsにプロジェクトを作成  

アプリの実行  
・xamppでApache, MySQLを起動  
・ターミナルを3つ立ち上げて以下のコマンドを実行  

### フロントエンド  

```bash
# cdコマンドでcopla-vueディレクトリに移動師下記を実行
npm run dev
```

### サーバー1  

```bash
# cdコマンドでbackendディレクトリに移動し下記を実行
node server.js
```

### ソケットサーバー  

```bash
# cdコマンドでbackendディレクトリに移動し、下記を実行
node socket.js
```

<br>
<br>

## 技術
### フロントエンド
・Vue.js  
・Vuetify  
・Vue Router  
・Vite  
(SPA開発のためVueを選択)  
<br>
### バックエンド
・Node.js  
・Express  
(一度使ったことがあるのと、  
非同期通信などが得意らしいのでPHPから変更しました。)  
・Socket.io  
<br>
### データベース
・MySQL  
(無料で使えるので利用)  
<br>
### ローカル開発環境
・XAMPP(MySQLを利用)  
<br>

## DB
### users
| 名前       | タイプ          | 称号順序             | Null  | デフォルト値  |
| :--        | :--             | :--                  | :--   | :--          |
| userID 主    | varchar(7)      | utf8mb4_general_ci   | いいえ | なし         |
| password   | varchar(255)    | utf8mb4_general_ci   | いいえ | なし         |
| userName   | varchar(20)     | utf8mb4_general_ci   | いいえ | なし         |
| icon       | varchar(30)     | utf8mb4_general_ci   | いいえ | #f0e68c      |
| idName     | varchar(30)     | utf8mb4_general_ci   | いいえ | なし         |
| birthday   | date            |                      | いいえ | なし         |
| ini        | int(11)         |                      | いいえ | 0            |

<br>
idNameは裏側でユーザの学籍番号を控える際に使用   
iniは初回登録判断で使用

<br>

### posts

| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| postID  主  | int(11)        |                      | いいえ | なし         | AUTO_INCREMENT |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ | なし         |                 |
| genre     | int(11)        |                      | いいえ | なし         |                 |
| body      | varchar(300)   | utf8mb4_general_ci   | いいえ | なし         |                 |
| pic       | varchar(50)    | utf8mb4_general_ci   | いいえ | なし         |                 |
| location  | varchar(50)    | utf8mb4_general_ci   | いいえ | なし         |                 |
| datetime  | datetime       |                      | いいえ | なし         |                 |
| fav       | int(11)        |                      | いいえ | 0            |                 |
| title     | text           | utf8mb4_general_ci   | いいえ | なし         |                 |
| tags      | varchar(60)    | utf8mb4_general_ci   | いいえ | なし         |                 |

<br>

### post_likes

| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| likeID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| postID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |

<br>

### replies
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| repID   主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| postID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |
| body      | varchar(300)   | utf8mb4_general_ci   | いいえ  | なし          |                 |
| pic       | varchar(30)    | utf8mb4_general_ci   | いいえ  | なし          |                 |
| location  | varchar(50)    | utf8mb4_general_ci   | いいえ  | なし          |                 |
| datetime  | datetime       |                      | いいえ | なし         |                 |
| fav       | int(11)        |                      | いいえ | 0            |                 |


<br>

### reply_likes

| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| likeID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| repID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |


<br>

### bookmarks

| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| bookmarkID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| postID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |

<br>

### bustime

| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| departID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| station    | int(11)        |                      | いいえ  | なし          |                 |
| dest       | int(1)         |                      | いいえ  | なし          |                 |
| depTime    | time           |                      | いいえ  | 00:00:00     |                 |
| endTime    | time           |                      | いいえ  | 00:00:00     |                 |
| schedule   | int(11)        |                      | いいえ  | なし          |                 |

<br>

### menus

| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| menuID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| gebre     | int(11)        |                      | いいえ  | なし          |                 |
| menuName    | varchar(10)     | utf8mb4_general_ci   | いいえ  | なし          |                 |
| comment    | varchar(10)     | utf8mb4_general_ci   | いいえ  | なし          |                 |
| detail    | varchar(30)     | utf8mb4_general_ci   | いいえ  | なし          |                 |
| image    | varchar(30)     | utf8mb4_general_ci   | いいえ  | なし          |                 |
| price     | int(5)        |                      | いいえ  | なし          |                 |
| fav     | int(11)        |                      | いいえ  | なし          |                 |

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
