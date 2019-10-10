# TaaMoo小游戏平台对接文档

## 1.获取渠道链接（请咨询TaaMoo技术支持，微信：engliuo）
渠道链接样式：http://taamoo.com/?utm_source=Baidu&channel=7830449449

> 说明：渠道链接包含两个参数 （接入过程请勿去掉这两个参数，避免数据统计出错）
>> utm_source用来描述合作的渠道

>> channel用来描述合作渠道的渠道号

## 2.Android集成
'String taamooUrl = "http://taamoo.com/?utm_source=Baidu&channel=7830449449";
WebView webView = new WebView(this);
webView.setWebViewClient(new WebViewClient());
webView.loadUrl(taamooUrl);

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
settings.setTextSize(WebSettings.TextSize.NORMAL);'
