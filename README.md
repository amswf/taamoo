# TaaMoo小游戏平台对接文档

## 1.获取渠道链接（请咨询TaaMoo技术支持，微信：engliuo）
渠道链接样式：http://taamoo.com/?utm_source=Baidu&channel=7830449449


## 2.注意事项
> 注意1：渠道链接包含utm_source和channel两个参数 （接入过程请勿去掉这两个参数，避免数据统计出错）  
> 注意2：当用户点击游戏或者广告时候，进入新的页面，App要处理好返回逻辑，避免用户进入页面后不知道如何关闭。  
> 注意3：谷歌广告请不要轻易点击，避免因为恶意误点，导致广告账户被封。上线前请及时通知TaaMoo的工作人员，做好上线前的测试工作。


## 3.集成测试
### Android集成
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

### IOS集成
##### 方法一，适用于8.0以下系统
```
UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];

//创建一个远程URL
NSURL *nsURL = [NSURL URLWithString:@"http://taamoo.com/?utm_source=Baidu&channel=7830449449"];  

//创建Request
NSURLRequest *request =[NSURLRequest requestWithURL:nsURL];
//加载网页
[webView loadRequest:request];
```

##### 方法二，8.0以上系统建议使用该方法
```
WKWebView *webView = [[WKWebView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
//创建一个远程URL
NSURL *nsURL = [NSURL URLWithString:@"http://taamoo.com/?utm_source=Baidu&channel=7830449449"];
//创建请求
NSMutableURLRequest *request =[NSMutableURLRequest requestWithURL:nsURL];
//加载网页
[webView loadRequest:request];
```
> 注意：在使用WKWebView的时候，必须实现WkUIDelegate，否则可能导致游戏广告无法点击。实现方式如下：
```
-(WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures
{
    if (!navigationAction.targetFrame.isMainFrame) {
        [webView loadRequest:navigationAction.request];
    }
    return nil;
}
```
