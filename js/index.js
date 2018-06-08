$(document).ready(function () {

    /**
     * 导航类
     * @type {{bean, action}}
     * bean : 存放成员变量以及基本属性
     */
    const class_nav = (function () {
        let domNode = init_nav();
        return {
            bean:{
                domNode:domNode,
                proprty : domNode.proprty
            },
            action : {
                winResize : winResize,
                menuBtn : navBtn
            }
        }
    })();
    // console.log(class_nav.action.winResize);
    /**
     * banner类
     * @type {{bean, action}}
     * bean : 存放成员变量以及基本属性
     */
    const class_banner = (function () {
        let domNode = init_banner();
        return {
            bean : {
                domNode : domNode,
                proprty : domNode.proprty,
            },
            action : {
                nextImg : next,
                prevImg : prev,
                autoPlay : startPlay,
                actionListHover : actionListHover,
                containerHover : containerHover
            }
        }
    })();
    //执行所有action，执行一次回收一次
    {
        /**执行轮播动画**/
        class_banner.action.nextImg();
        class_banner.action.prevImg();
        //执行导航相关功能
        class_nav.action.winResize();
        class_nav.action.menuBtn();
        //执行header的轮播
        class_banner.action.autoPlay();
        class_banner.action.actionListHover();
        class_banner.action.containerHover();
    }

    //初始导航栏相关的化成员变量以及属性设置
    function init_nav() {
        return (function () {
            const menuBtn = $('header nav section .menu-btn a'),
                  menuList = $('.index-nav ul li');
            innerWidth <= 768 ? menuList.hide() : menuList.show();//初始化菜单是否显示
            return {
                menuBtn : menuBtn,
                menuList : menuList,
                proprty : {
                    clickFlag : true,//默认单击,
                }
            }
        })();
    }
    //窗口变化监听
    function winResize(){
        let menuList = class_nav.bean.domNode.menuList;
        window.addEventListener('resize',function () {//窗口变化控制菜单是否显示
            if (innerWidth <= 768) {
                menuList.hide();
                //隐藏X方向的滚动条
                document.documentElement.style.overflowX = 'hidden';
            }else {
                menuList.show();
            }
        });
    }
    //导航按钮控制  逐步淡入，统一淡出
    function navBtn() {
        let navBtn = class_nav.bean.domNode.menuBtn;
        let menuList = class_nav.bean.domNode.menuList;
        let clickFlag = class_nav.bean.proprty.clickFlag;//标记
        navBtn.click(function () {
            clickFlag === true ?
                $(this).css("padding" , ".02rem 0") : $(this).css("padding" , ".02rem .02rem");
            for (let i = 0; i < menuList.length; i++) {
                let menuItem = menuList.get(i);
                if (clickFlag){
                    if (i === menuList.length - 1) clickFlag = false;
                    $(menuItem).fadeIn(i * 200);
                }else {
                    if (i === menuList.length - 1) clickFlag = true;
                    $(menuItem).fadeOut(500);
                }
            }
            class_nav.bean.proprty.clickFlag = clickFlag;//回溯
        });
    }
    //初始化变量banner相关的成员变量以及相关属性
    function init_banner(){
        //为了保证class_banner为最上文，使用开放式的function+闭包
        return  (function () {
            //第一个大轮播
            let timer;
            let $container = $('header .banner-header .container');
            let $imgList = $container.find('*');
            let $actionList = $('header .banner-header .action').find('*');
            //热门新闻轮播
            let $imgContainer = $('.hot .img-container');
            let $img = $imgContainer.find('*');
                $imgContainer.height($img.height());//设置最外层banner的高度
            let $banner = $('.hot .banner');
            let $actionLeft = $('.hot .action-left');
            let $actionRight = $('.hot .action-right');
            let imgWidth = $img.width();
            let animateTime = $img.css('transition-duration');//动画时间
                animateTime = parseInt(animateTime) * 1000;//图片动画时间转换成ms
                $imgContainer.width($img.length * imgWidth);//设置图片容器的容器宽度，有图片数量和本省的宽度决定
                $banner.width($img.width() * 3);//设置显示图片容器的宽度
            return {
                $imgContainer : $imgContainer,
                $img : $img,
                $banner : $banner,
                $actionLeft : $actionLeft,
                $actionRight : $actionRight,
                $container : $container,
                $imgList : $imgList,
                $actionList : $actionList,
                proprty : {
                    imgWidth : imgWidth,
                    animateTime : animateTime,
                    count : 0,
                    timer :timer,//外部设置
                }
            }
        })();
    }
    //下一张 封装
    function next(){
        let $actionRight = class_banner.bean.domNode.$actionRight;
        let actionTime = class_banner.bean.proprty.animateTime;//保证动画与重新布局保持一致
        $actionRight.click(function () {
            let $img = class_banner.bean.domNode.$imgContainer.find('*');//重新查找图片节点
            let imgWidth = class_banner.bean.proprty.imgWidth;
            let $img_last = $img.last().clone(true);
            $img_last.removeClass('right-img').addClass('left-img');
            $img_last.insertBefore($img.first());
            $img_last.css({left : 40});//重新定位第一张图片的位置
            $.each($img,function (index , value) {
                value = $(value);
                //变换
                if (value.hasClass('center-img')){
                    value.removeClass('center-img').addClass('right-img');
                }else if(value.hasClass('left-img')){
                    value.removeClass('left-img').addClass('center-img');
                }
                //移动
                value.css({left : parseFloat(value.css('left')) + imgWidth - 40});
            });
            //消灭最后一个元素
            $img.last().css({'transform' : 'scale(.5)',opacity : 0});
            setTimeout(function () {
                $img.last().remove();
            },actionTime);
        });
    }
    //上一张 封装
    function prev(){
        let $actionLeft = class_banner.bean.domNode.$actionLeft;
        let actionTime = class_banner.bean.proprty.animateTime;//保证动画与重新布局保持一致
        $actionLeft.click(function () {
            let $img = class_banner.bean.domNode.$imgContainer.find('*');
            let imgWidth = class_banner.bean.proprty.imgWidth;
            let $img_first = $img.first().clone(true);
            $img_first.removeClass('left-img').addClass('right-img');
            $img_first.insertAfter($img.last());
            $img_first.css({left : 360});//重新定位第一张图片的位置
            $.each($img,function (index , value) {
                value = $(value);
                //变换
                if (value.hasClass('center-img')){
                    value.removeClass('center-img').addClass('left-img');
                }else if(value.hasClass('right-img')){
                    value.removeClass('right-img').addClass('center-img');
                }
                //移动
                value.css({left : parseFloat(value.css('left')) - imgWidth + 40});
            });
            //消灭最后一个元素
            $img.first().css({transform : 'scale(.5)',opacity : 0});
            setTimeout(function () {
                $img.first().remove();
            },actionTime);
        });
    }
    //文本溢出省略号显示
    //得到装载文本的DOM
    (function textOverFlow() {
        let news = $('.news_content_message');
        for (let i = 0; i < news.length; i++){
            let el = news[i],
                str = el.textContent,
                el_ofHei = el.offsetHeight;
            for(let i=0; i<str.length; i++) {
                el.innerHTML = str.substr(0, i);
                if(el_ofHei < el.scrollHeight) {
                    el.style.overflow = 'hidden';
                    el.innerHTML = str.substr(0, i-3) + '...';
                    break;
                }
            }
        }
    })();
    //第一个大轮播
    //自动播放
    function startPlay(){
        let imgList = class_banner.bean.domNode.$imgList;
        let actionList = class_banner.bean.domNode.$actionList;
        let count = class_banner.bean.proprty.count;
        class_banner.bean.proprty.timer = setInterval(function () {
            imgList.not(imgList[count]).fadeOut(500);
            $(imgList[count]).fadeIn(500);
            actionList.css({background : 'none',opacity : '.8'});
            $(actionList[count]).css({backgroundColor : 'white' , opacity : 1});
            count++;
            if (count === imgList.length){
                count = 0;
            }
            class_banner.bean.proprty.count = count;
        },2000);
    }
    //控制器控制轮播
    function actionListHover(){
        let actionList = class_banner.bean.domNode.$actionList;
        let imgList = class_banner.bean.domNode.$imgList;
        actionList.hover(function () {
            clearInterval(class_banner.bean.proprty.timer);
            let evRoot = $(this);
            let rootIndex = evRoot.index();
            imgList.not(imgList[rootIndex]).fadeOut(500);
            $(imgList[rootIndex]).fadeIn(500);
            count = rootIndex;
        },function () {
            startPlay();
        });
    }
    //整体面板控制是否自动轮播
    function containerHover(){
        let container = class_banner.bean.domNode.$container;
        container.hover(function () {
            clearInterval(class_banner.bean.proprty.timer);
            container.css({'cursor': 'pointer'});
        },function () {
            startPlay();
        });
    }
});