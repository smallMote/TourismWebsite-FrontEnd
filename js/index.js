$(document).ready(function () {
    //窗口变化监听
    winResize();
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
    /**
     * 团队类
     * @type {{bean, action}}
     */
    const class_team_banner = (function () {
        let domNode = initTemBanner();
        return {
            bean : {
                domNode : domNode,
                proprty : domNode.proprty,
            },
            action : {
                nextImg : Right_action,
                prevImg : Left_action,
                layout : imgLayout,
            }
        }
    })();
    //窗口变化监听
    function winResize(){
        //设置热门景点的参数
        let hotAguments = {
            inputInitWidth : 300,
            inputInitLeft : 50
        };
        try {
            let menuList = class_nav.bean.domNode.menuList;
            window.addEventListener('resize',function () {//窗口变化控制菜单是否显示
                if (innerWidth < 768) {
                    class_team_banner.bean.proprty.initImageData
                        = class_team_banner.bean.proprty.initImageDataOfPhone;
                    //第三个轮播的尺寸缩小
                    imgLayout();
                    Right_action();
                    Left_action();
                   if (innerWidth > 600)  window.location.reload();//暂时热门新闻第二个轮播自适应处理办法
                    menuList.hide();
                    //隐藏X方向的滚动条
                    document.documentElement.style.overflowX = 'hidden';
                    // hotAguments.inputInitWidth = 100;
                    // hotAguments.inputInitLeft = 25;
                }else {
                    //第三个轮播的尺寸
                    class_team_banner.bean.proprty.initImageData
                        = class_team_banner.bean.proprty.initImageDataOfPc;
                    imgLayout();
                    Right_action();
                    Left_action();
                    if (innerWidth < 800) window.location.reload();//暂时热门新闻第二个轮播自适应处理办法
                    //导航
                    menuList.show();
                }
            });
        }catch (e) {

        }
    }
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
                autoPlay : startPlay,
                actionListHover : actionListHover,
                containerHover : containerHover
            }
        }
    })();
    /**
     * 热门景点类
     * @type {{bean, action}}
     */
    const class_hot_banner = (function () {
        let domNode = init();
        return {
            bean : {
                domNode : domNode,
                proprty : domNode.proprty,
            },
            action : {
                nextImg : next,
                prevImg : prev,
            }
        }
    })();
    //执行所有action，执行一次回收一次
    {
        //执行导航相关功能
        class_nav.action.winResize();
        class_nav.action.menuBtn();
        //执行header的轮播
        class_banner.action.autoPlay();
        class_banner.action.actionListHover();
        class_banner.action.containerHover();
        //执行热门景点banner
        /**执行轮播动画**/
        class_hot_banner.action.nextImg();
        class_hot_banner.action.prevImg();
        //执行团队介绍布局
        class_team_banner.action.layout();
        //执行团队介绍banner
        class_team_banner.action.nextImg();
        class_team_banner.action.prevImg();
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
    //初始化热门景点变量
    function init(){
        //为了保证class_banner为最上文，使用开放式的function+闭包
        return  (function () {
            let $imgContainer = $('#wlittleyang-banner .img-container');
            let $img = $imgContainer.find('*');
            let $banner = $('.banner');
            let $actionLeft = $('.action-left');
            let $actionRight = $('.action-right');
            let imgWidth = parseFloat($img.css('width'));//$img.width()
            let animateTime = $img.css('transition-duration');//动画时间
            let FirstImgLeft =  $($img[0]).css('left');//第一张图片的left
            //设置三张图片的位置
            $($img[0]).css({left : FirstImgLeft});//第一张图片的位置
            $($img[1]).css({left : imgWidth + 'px'});//中间张
            for (let i = 0; i < $img.length; i++) {//第二张后的图片位置
                $($img[i]).css({zIndex : -i});
                if (i === 1)
                    $($img[i]).css({zIndex : 1});
                if (i >= 2)
                    $($img[i]).css({left : (2 * imgWidth - parseFloat(FirstImgLeft)) + 'px'});
            }
            let LastImgLeft =  $($img[2]).css('left');//可见的最后一张图片的left

            animateTime = parseInt(animateTime) * 1000;//图片动画时间转换成ms
            $imgContainer.width(3 * imgWidth);//设置图片容器的容器宽度，有图片数量和本省的宽度决定
            return {
                $imgContainer : $imgContainer,
                $img : $img,
                $banner : $banner,
                $actionLeft : $actionLeft,
                $actionRight : $actionRight,
                proprty : {
                    imgWidth : imgWidth,
                    animateTime : animateTime,
                    FirstImgLeft : FirstImgLeft,//初始第一张的left
                    LastImgLeft : LastImgLeft
                }
            }
        })();
    }
    //初始化第一个banner相关的成员变量以及相关属性
    function init_banner(){
        //为了保证class_banner为最上文，使用开放式的function+闭包
        return  (function () {
            //第一个大轮播
            let $container = $('header .banner-header .container');
            let $imgList = $container.find('*');
            let $actionList = $('header .banner-header .action').find('*');
            //热门新闻轮播
            let $imgContainer = $('.hot .img-container');
            let $img = $imgContainer.find('*');
            $imgContainer.height($img.height());//设置最外层banner的高度
            let $banner = $('.hot .banner');
            let imgWidth = $img.width();
            let animateTime = $img.css('transition-duration');//动画时间
            animateTime = parseInt(animateTime) * 1000;//图片动画时间转换成ms
            return {
                $banner : $banner,
                $container : $container,
                $imgList : $imgList,
                $actionList : $actionList,
                proprty : {
                    imgWidth : imgWidth,
                    animateTime : animateTime,
                    count : 0,
                }
            }
        })();
    }
    //第一个轮播导航按钮控制  逐步淡入，统一淡出
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
    //第一个大轮播，自动播放
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
    //第一个轮播控制器控制轮播
    function actionListHover(){
        let actionList = class_banner.bean.domNode.$actionList;
        let imgList = class_banner.bean.domNode.$imgList;
        actionList.hover(function () {
            clearInterval(class_banner.bean.proprty.timer);
            let evRoot = $(this);
            let rootIndex = evRoot.index();
            imgList.not(imgList[rootIndex]).fadeOut(500);
            $(imgList[rootIndex]).fadeIn(500);
            class_banner.bean.proprty.count = rootIndex;
            //指示器背景
            actionList.css({background:'none'});
            $(actionList[rootIndex]).css({background : 'white'});
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
    //下一张 封装
    function next(){
        let $actionRight = class_hot_banner.bean.domNode.$actionRight;
        let actionTime = class_hot_banner.bean.proprty.animateTime;//保证动画与重新布局保持一致
        let FirstImgLeft = class_hot_banner.bean.proprty.FirstImgLeft;
        $actionRight.click(function () {
            let $img = class_hot_banner.bean.domNode.$imgContainer.find('*');//重新查找图片节点
            let imgWidth = class_hot_banner.bean.proprty.imgWidth;
            let $img_last = $img.last().clone(true);
            $img_last.removeClass('right-img').addClass('left-img');
            $img_last.insertBefore($img.first());
            $img_last.css({left : FirstImgLeft});//重新定位第一张图片的位置
            $.each($img,function (index , value) {
                value = $(value);
                //变换
                if (value.hasClass('center-img')){
                    value.removeClass('center-img').addClass('right-img');
                }else if(value.hasClass('left-img')){
                    value.removeClass('left-img').addClass('center-img');
                }
                //移动
                value.css({left : parseFloat(value.css('left')) + imgWidth - parseFloat(FirstImgLeft)});
            });
            for (let i = 0; i < $img.length; i++) {//第二张后的图片位置
                $($img[i]).css({zIndex : -i});
                if (i === 1)
                    $($img[i]).css({zIndex : -1});//要回溯到上一张的zIndex
                if (i >= 2)
                    $($img[i]).css({left : (2 * imgWidth - parseFloat(FirstImgLeft)) + 'px'});
            }
            //消灭最后一个元素
            $img.last().css({'transform' : 'scale(.5)',opacity : 0});
            setTimeout(function () {
                $img.last().remove();
            },actionTime);
        });
    }
    //上一张 封装
    function prev(){
        let $actionLeft = class_hot_banner.bean.domNode.$actionLeft;
        let actionTime = class_hot_banner.bean.proprty.animateTime;//保证动画与重新布局保持一致
        let FirstImgLeft = class_hot_banner.bean.proprty.FirstImgLeft;
        let LastImgLeft = class_hot_banner.bean.proprty.LastImgLeft;
        $actionLeft.click(function () {
            let $img = class_hot_banner.bean.domNode.$imgContainer.find('*');
            let imgWidth = class_hot_banner.bean.proprty.imgWidth;
            let $img_first = $img.first().clone(true);
            $img_first.removeClass('left-img').addClass('right-img');
            $img_first.insertAfter($img.last());
            $img_first.css({left : LastImgLeft});//重新定位第一张图片的位置
            $.each($img,function (index) {
                // value = $(value);
                // //变换
                // if (value.hasClass('center-img')){
                //     value.removeClass('center-img').addClass('left-img');
                // }else if(value.hasClass('right-img')){
                //     value.removeClass('right-img').addClass('center-img');
                // }
                // //移动
                // value.css({left : parseFloat(value.css('left')) - imgWidth + parseFloat(FirstImgLeft)});
                /******改进*****/
                {
                    $img.css({zIndex : -1});
                    $( $img[2]).css({zIndex : '1'});
                    $($img[index + 1]).css({zIndex : 1});
                    if (index + 1 < 3){
                        $($img[index + 1])
                            .css({
                                left : parseFloat($($img[index + 1]).css('left')) - imgWidth + parseFloat(FirstImgLeft),
                            });
                    }
                }
            });
            //消灭最后一个元素
            $img.first().css({transform : 'scale(.5)',opacity : 0});
            setTimeout(function () {
                $img.first().remove();
            },actionTime);
        });
    }

    /**
     * 文本溢出省略号显示
     * 得到装载文本的DOM
     */
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

    //第三个轮播（五张图）
    function initTemBanner() {
        //默认尺寸(pc端尺寸)
        //[160 , 180 , 200 , 180 , 160];
        let initImageDataOfPc = [
            {
                size : 160,
                zIndex : 1,
                left : 0,
                top : 70
            },
            {
                size : 180,
                zIndex : 2,
                left : 160 / 2,
                top : 60
            },
            {
                size : 200,
                zIndex : 3,
                left :  180 / 2 + 160 / 2,
                top : 50
            },
            {
                size : 180,
                zIndex : 2,
                left : 200 + 180 / 2,
                top : 60
            },
            {
                size : 160,
                zIndex : 1,
                left : 200 + 180,
                top : 70
            }
        ];
        //手机端数据
        let initImageDataOfPhone = [
            {
                size : 80,
                zIndex : 1,
                left : 0,
                top : 70
            },
            {
                size : 100,
                zIndex : 2,
                left : 80 / 2,
                top : 60
            },
            {
                size : 120,
                zIndex : 3,
                left :  100 / 2 + 80 / 2,
                top : 50
            },
            {
                size : 100,
                zIndex : 2,
                left : 120 + 100 / 2,
                top : 60
            },
            {
                size : 80,
                zIndex : 1,
                left : 120 + 100,
                top : 70
            }
        ];
        let initImageData = initImageDataOfPc;
        let $imgContainer = $('#wlittleyang-banner-five .container');
        let $img = $('#wlittleyang-banner-five .item');
        return {
            $imgContainer : $imgContainer,
            $img : $img,
            proprty : {
                initImageData : initImageData,
                initImageDataOfPhone : initImageDataOfPhone,
                initImageDataOfPc : initImageDataOfPc
            }
        }
    }
    function imgLayout() {
        let $img = class_team_banner.bean.domNode.$img;
        for (let i = 0; i < $img.length; i++) {
            let imgData = class_team_banner.bean.proprty.initImageData[i];
            //上下居中
            $($img[i]).css({
                left : imgData.left + 'px',
                height : imgData.size + 'px',
                width : imgData.size + 'px',
                zIndex : imgData.zIndex,
                top : imgData.top + 'px',
            });
        }
    }
    //布局结束
    //Action-开始
    //Right
    function Right_action() {
        let $img = class_team_banner.bean.domNode.$img;
        let right_action =  $('#wlittleyang-banner-five .action-right');
        let initImageData = class_team_banner.bean.proprty.initImageData;
        right_action.click(function () {
            $img.css({transition: 'all 1s'});
            {
                let temp = initImageData[0];
                for (let i = 0; i < $img.length - 1; i++) {
                    //移位元数据
                    initImageData[i] = initImageData[i+1];
                }
                initImageData[$img.length - 1] = temp;
            }
            //重新布局
            imgLayout();
        });
    }
    //Left
    function Left_action() {
        let left_action =  $('#wlittleyang-banner-five .action-left');
        let $img = class_team_banner.bean.domNode.$img;
        let initImageData = class_team_banner.bean.proprty.initImageData;
        left_action.click(function () {
            $img.css({transition: 'all 1s'});
            {
                let temp = initImageData[initImageData.length - 1];
                for (let i = initImageData.length - 1; i > 0; i--) {
                    initImageData[i] = initImageData[i - 1];
                }
                initImageData[0] = temp;
            }
            //重新布局
            imgLayout();
        });
    }
    //Action-结束
});