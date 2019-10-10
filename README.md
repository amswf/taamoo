# TaaMoo小游戏平台对接文档

## 1.获取渠道链接（请咨询TaaMoo技术支持，微信：engliuo）
渠道链接样式：http://taamoo.com/?utm_source=Baidu&channel=7830449449

> 说明：渠道链接包含两个参数 （接入过程请勿去掉这两个参数，避免数据统计出错）
>> utm_source用来描述合作的渠道

>> channel用来描述合作渠道的渠道号

## Android集成
>> 
```
String taamooUrl = "http://taamoo.com/?utm_source=Baidu&channel=7830449449";

//定义WebView 用于加载显示小游戏中心
WebView webView = new WebView(this);

//设置自身浏览器，注意：可用把WebView理解为浏览器，设置new WebViewClient()后，手机就不会跳转其他的浏览器
webView.setWebViewClient(new WebViewClient());

//加载TaaMoo游戏中心
webView.loadUrl(taamooUrl);

//以下配置用于webview缓存，以及允许JS代码执行，请务必设置，保证游戏正常运行。
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true);
settings.setJavaScriptEnabled(true);
settings.setBuiltInZoomControls(true);
settings.setUseWideViewPort(true);
settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);
settings.setLoadWithOverviewMode(true);
settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
settings.setAppCacheEnabled(true);
String appCachePath = this.getApplicationContext().getCacheDir().getPath() + File.separator + "games";
settings.setAppCachePath(appCachePath);
settings.setDatabaseEnabled(true);
settings.setDatabasePath(appCachePath);
settings.setDomStorageEnabled(true);
settings.setAllowFileAccess(true);
settings.setAppCacheMaxSize(1024 * 1024 * 8);
settings.setJavaScriptCanOpenWindowsAutomatically(true);
settings.setDefaultTextEncodingName("UTF-8");
settings.setTextSize(WebSettings.TextSize.NORMAL);
```
