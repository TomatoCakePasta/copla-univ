# 学内SNS Copla(コプラ)
学内生限定のSNS  
既存のXと比較して在学生同士の密なコミュニケーションを促進するために制作しました  

# DEMO
SNSの基本機能から、大学ならではの機能まで充実  
Coplaひとつで学生生活をより快適にします  

https://github.com/user-attachments/assets/5581bba0-8236-40c6-96cb-cd9780a4b003

# Features
* 授業をきっかけに制作したアプリのコンセプトを引き継ぎ、個人で継続開発  
技術を刷新し、初めてフルスタックで完成させたアプリ  

### 学び
* 実装の過程で綺麗なコードについて考え、バックエンドをController, Modelに分割
* UIUXは少ないクリック数で欲しい情報にたどり着ける設計で、同じレイアウトにすることで操作熟練度の壁を排除
* フロントエンドのページを全てComponentに入れてしまったことが反省点
* 投稿の検索アルゴリズムが課題, 現状は全文検索なので検索用のテーブルを準備するなどの対策が必要

# Installation
```bash
npm install
```

# Usage
初回  
* xamppのhtdocsにプロジェクトを作成  

アプリの実行  
* xamppでApache, MySQLを起動  
* ターミナルを3つ立ち上げて以下のコマンドを実行  

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

# Requirement
* node.js: v20.14.0
* bcrypt: 5.1.1
* cors: 2.8.5
* express: 4.19.2
* express-session: 1.18.0
* multer: 1.4.5-lts.1 画像アップロードのミドルウェア
* mysql: 2.18.1
* node-schedule: 2.2.2 定刻時間に処理を実行
* url: 0.11.4 画像の格納パスを取得
* path: 0.12.7
* soket.io: 4.7.5

### フロントエンド
* Vue.js  
(SPA開発のためVueを選択)  

### バックエンド
* Node.js / Express  
(一度使ったことがあるのと、非同期通信などが得意らしいのでPHPから変更)  
・Socket.io  

### データベース
* MySQL  
(無料で使えるので利用)  

### ローカル開発環境
* XAMPP(Apache, MySQLを利用)  
<br>

## DB
### users
個人のアカウント関連
| 名前       | タイプ          | 称号順序             | Null  | デフォルト値  |
| :--        | :--             | :--                  | :--   | :--          |
| userID 主    | varchar(7)      | utf8mb4_general_ci   | いいえ | なし         |
| password   | varchar(255)    | utf8mb4_general_ci   | いいえ | なし         |
| userName   | varchar(20)     | utf8mb4_general_ci   | いいえ | なし         |
| icon       | varchar(30)     | utf8mb4_general_ci   | いいえ | #f0e68c      |
| idName     | varchar(30)     | utf8mb4_general_ci   | いいえ | なし         |
| birthday   | date            |                      | いいえ | なし         |
| ini        | int(11)         |                      | いいえ | 0            |

* idNameは裏側でユーザの学籍番号を控える際に使用  
* iniは初回登録判断で使用

<br>

### posts
通常投稿
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

* locationは未使用, 投稿場所の記録や拡張用で用意 

<br>

### post_likes
いいね記録
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| likeID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| postID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |

<br>

### replies
返信
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
返信いいね記録
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| likeID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| repID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |


<br>

### bookmarks
ブックマーク記録
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| bookmarkID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| postID    | int(11)        |                      | いいえ  | なし          |                 |
| userID    | varchar(7)     | utf8mb4_general_ci   | いいえ  | なし          |                 |

<br>

### bustime
時刻表
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
学食メニュー
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
学食売り上げ
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| salesID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| menuID    | int(11)        |                      | いいえ  | なし          |                 |
| saleDate    | date           |                      | いいえ  | current_timestamp()     |                 |
| fav   | int(11)        |                      | いいえ  | なし          |                 |

<br>

### votes
学食毎日投票
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| voteID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| userID    | varchar(7)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| menuID    | int(11)           |                      | いいえ  | なし    |                 |
| voteDate   | date       |                      | いいえ  | current_timestamp()          |                 |

<br>

### timetable
時間割
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| timetableID  主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| userID    | varchar(7)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| className    | varchar(30)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| room    | varchar(11)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| detail    | varchar(30)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| dayID    | int(1)           |                      | いいえ  | なし    |                 |
| periodID    | int(1)           |                      | いいえ  | なし    |                 |

### notice
公式からのお知らせ
| 名前      | タイプ         | 称号順序             | Null  | デフォルト値 | その他           |
| :--       | :--            | :--                  | :--   | :--          | :--             |
| notice 主  | int(11)        |                      | いいえ  | なし          | AUTO_INCREMENT  |
| title    | varchar(30)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| body    | varchar(300)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| pic   | varchar(50)        | utf8mb4_general_ci      | いいえ  | なし          |                 |
| datetime   | datetime           |                      | いいえ  | current_timestamp()     |                 |
| genre    | int(11)           |                      | いいえ  | なし    |                 |

# Note
* メニュー画像は任意で以下のディレクトリに格納してください  
  /copla-vue/public/menus
