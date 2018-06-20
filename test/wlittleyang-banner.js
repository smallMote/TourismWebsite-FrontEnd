$(function () {

    (function () {
        let inputInitWidth = 200;
        let inputInitLeft = 50;
        $('#wlittleyang-banner .img-container')
            .find("*").css('width' , inputInitWidth)
            .first().css('left' , inputInitLeft);
        //设置容器
        $('#wlittleyang-banner').width(inputInitWidth * 3);
        $('.hot .action').width(inputInitWidth * 3);
    })();
    /**
     * banner类
     * @type {{bean, action}}
     * bean : 存放成员变量以及基本属性
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
    /**执行轮播动画**/
    class_hot_banner.action.nextImg();
    class_hot_banner.action.prevImg();

    //初始化变量
    function init(){
        //为了保证class_banner为最上文，使用开放式的function+闭包
        return  (function () {
            let $imgContainer = $('#wlittleyang-banner .img-container');
            let $img = $imgContainer.find('*');
            let $banner = $('.banner');
            let $actionCon = $('.hot .action');
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
            $.each($img,function (index , value) {
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
});