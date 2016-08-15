这个游戏是在腾讯ISUX一篇帖子上看到的，没有提供源代码，我自己写了一个升级版的。

原帖：
https://isux.tencent.com/multi-screen-interactive-solution.html

Tips For Run This Project

        首先您需要全局安装node-gyp
        npm install -g node-gyp

        和几个本地lib
        OSX      brew install pkg-config cairo libpng jpeg giflib
        Ubuntu      sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
        Windows      https://github.com/Automattic/node-canvas/wiki/Installation---Windows

        然后安装node
        npm install && npm start

        打开浏览器访问 localhost:8001 拿出手机扫描二维码（需要您的手机连接与计算机处于同一局域网内的wifi）
        您也可以部署到自己的公网服务器上运行
