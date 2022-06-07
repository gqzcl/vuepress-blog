---
icon: page
title: Oauth2.0
category:
  - Golang后端
tag:
  - 事务
  - 后端
  - 分布式
---
# Oauth2.0

"OAuth 2.0"[^1]

[参考](https://driverzhang.github.io/post/golang%E5%AE%9E%E7%8E%B0oauth2%E8%AE%A4%E8%AF%81/)


[^1]: ## **OAuth 2.0**

    OAuth 2.0（RFC 6749）也是用 token 授权的一种协议，它的特点是你可以在**有限范围内**使用别家接口，也可以借此使用别家的登录系统登录自家应用，也就是第三方应用登录。（注意啦注意啦，OAuth 2.0 授权流程说不定面试会考哦！）

    既然是第三方登录，那除了应用本身，必定存在第三方登录服务器。在 OAuth 2.0 中涉及三个角色：用户、应用提供方、登录平台，相互调用关系如下：

    ```
         +--------+                               +---------------+
         |        |--(A)- Authorization Request ->|   Resource    |
         |        |                               |     Owner     |
         |        |<-(B)-- Authorization Grant ---|               |
         |        |                               +---------------+
         |        |
         |        |                               +---------------+
         |        |--(C)-- Authorization Grant -->| Authorization |
         | Client |                               |     Server    |
         |        |<-(D)----- Access Token -------|               |
         |        |                               +---------------+
         |        |
         |        |                               +---------------+
         |        |--(E)----- Access Token ------>|    Resource   |
         |        |                               |     Server    |
         |        |<-(F)--- Protected Resource ---|               |
         +--------+                               +---------------+

    ```

    很多大公司都提供 OAuth 2.0 第三方登录，这里就拿小聋哥的微信举例吧——

    ### **准备**

    一般来说，应用提供方需要先在登录平台申请好 AppID 和 AppSecret。（微信使用这个名称，其他平台也差不多，一个 ID 和一个 Secret）

    ### **获取 code**

    > 什么是授权临时票据（code）？答：第三方通过 code 进行获取 access_token 的时候需要用到，code 的超时时间为 10 分钟，一个 code 只能成功换取一次 access_token 即失效。code 的临时性和一次保障了微信授权登录的安全性。第三方可通过使用 https 和 state 参数，进一步加强自身授权登录的安全性。
    >

    在这一步中，**用户**先在**登录平台**进行身份校验。

    ```jsx
    https://open.weixin.qq.com/connect/qrconnect?
    appid=APPID&
    redirect_uri=REDIRECT_URI&
    response_type=code&
    scope=SCOPE&
    state=STATE
    #wechat_redirect

    ```

    |参数|是否必须|说明|
    | ----------------| ----------| ------------------------------------------------------------------------------------------------------|
    |appid|是|应用唯一标识|
    |redirect_uri<br />|是|请使用 urlEncode 对链接进行处理|
    |response_type|是|填 code|
    |scope|是|应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写 snsapi_login|
    |state|否|用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击）|

    注意一下 **scope** 是 OAuth2.0 权限控制的特点，定义了这个 code 换取的 token 可以用于什么接口。

    正确配置参数后，打开这个页面看到的是授权页面，在**用户**授权成功后，**登录平台**会带着 code 跳转到**应用提供方**指定的 `redirect_uri`：

    ```jsx
    redirect_uri?code=CODE&state=STATE
    ```

    授权失败时，跳转到

    ```jsx
    redirect_uri?state=STATE
    ```

    也就是失败时没 code。

    ### **获取 token**

    在跳转到重定向 URI 之后，应用提供方的**后台**需要使用微信给你的**code**获取 token，同时，你也可以用传回来的 state 进行来源校验。

    要获取 token，传入正确参数访问这个接口：

    ```jsx
    https://api.weixin.qq.com/sns/oauth2/access_token?
    appid=APPID&
    secret=SECRET&
    code=CODE&
    grant_type=authorization_code

    ```

    |参数|是否必须|说明|
    | ------------| ----------| -----------------------------------------------------------------|
    |appid|是|应用唯一标识，在微信开放平台提交应用审核通过后获得|
    |secret|是|应用密钥 AppSecret，在微信开放平台提交应用审核通过后获得|
    |code|是|填写第一步获取的 code 参数|
    |grant_type|是|填 authorization_code，是其中一种授权模式，微信现在只支持这一种|

    正确的返回：

    ```json
    {
      "access_token": "ACCESS_TOKEN",
      "expires_in": 7200,
      "refresh_token": "REFRESH_TOKEN",
      "openid": "OPENID",
      "scope": "SCOPE",
      "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
    }

    ```

    得到 token 之后你就可以根据之前申请 code 填写的 scope 调用接口了。

    ### **使用 token 调用微信接口**

    |授权作用域(scope)|接口|接口说明|
    | -------------------| ---------------------------| --------------------------------------------------------------------|
    |snsapi_base|/sns/oauth2/access_token|通过 code 换取 ==access_token==、==refresh_token== 和已授权 scope|
    |snsapi_base|/sns/oauth2/refresh_token|刷新或续期 ==access_token== 使用|
    |snsapi_base|/sns/auth<br />|检查 ==access_token== 有效性|
    |snsapi_userinfo|/sns/userinfo|获取用户个人信息|

    例如获取个人信息就是 `GET` https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN

    注意啦，在微信 OAuth 2.0，`access_token` 使用 query 传输，而不是上面提到的 Authorization。

    使用 Authorization 的例子，如 GitHub 的授权，前面的步骤基本一致，在获取 token 后，这样请求接口：

    ```bash
    curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com
    ```

    说回微信的 userinfo 接口，返回的数据格式如下：

    ```json
    {
      "openid": "OPENID",
      "nickname": "NICKNAME",
      "sex": 1,
      "province":"PROVINCE",
      "city":"CITY",
      "country":"COUNTRY",
      "headimgurl":"https://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
      "privilege":[ "PRIVILEGE1" "PRIVILEGE2" ],
      "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
    }
    ```

    ### **后续使用**

    在使用 token 获取用户个人信息后，你可以接着用 userinfo 接口返回的 openid，结合 session 技术实现在自己服务器登录。

    ```jsx
    // 登录
    req.session.id = openid
    if (req.session.id) {
    //   已登录
    } else {
    //   未登录
    }
    // 退出
    req.session.id = null
    // 清除 session

    ```

    总结一下 OAuth2.0 的流程和重点：

    - 为你的应用申请 ID 和 Secret
    - 准备好重定向接口
    - 正确传参获取 code **<- 重要**
    - code 传入你的重定向接口
    - 在重定向接口中使用 code 获取 token **<- 重要**
    - 传入 token 使用微信接口

    OAuth2.0 着重于第三方登录和权限限制。而且 OAuth2.0 不止微信使用的这一种授权方式，其他方式可以看阮老师的OAuth 2.0 的四种方式。
