# TaaMoo小游戏平台对接文档

## 1.获取渠道链接（请咨询TaaMoo技术支持，微信：engliuo）
渠道链接样式：http://taamoo.com/?utm_source=Baidu&channel=7830449449

> 说明：渠道链接包含两个参数 （接入过程请勿去掉这两个参数，避免数据统计出错）
>> utm_source用来描述合作的渠道

>> channel用来描述合作渠道的渠道号

## 2.Android集成
>/**
 * 定义此WebView 用于去展现网络上的网页
 */
WebView webView = new WebView(this);
/**
 * 通过此WebView 获取到 WebSettings ，通过WebSettings设置WebView
 */
WebSettings webSettings = webView.getSettings();'
