# SakuraBaseStorage for nodejs

sakuraBaseStorageへのアクセス用スクリプトのテスト版です

## メソッド一覧

### インスタンス作成
#### constructor

```
bs = new BaseStorage("config.json")
```

```config.json
{
	"accessKeyId":"アクセストークン名",
	"secretAccessKey":"トークン文字列",
	"region":"ap-northeast1",
	"endpoint": "b.storage.sakura.ad.jp"
}
```

### バケット関連
#### create_bucket