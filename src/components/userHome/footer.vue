<template>
    <div class="footercom">
        <div class="footer_bd">
            <div class="footer_links">
                <a href="javascript:;">关于网站</a>
                <span class="graytext">&nbsp;|&nbsp;</span>
                <a href="javascript:;">服务条款</a>
                <span class="graytext">&nbsp;|&nbsp;</span>
                <a href="javascript:;">使用规范</a>
                <span class="graytext">&nbsp;|&nbsp;</span>
                <a href="javascript:;">客服中心</a>
                <span class="graytext">&nbsp;|&nbsp;</span>
                <a href="javascript:;">隐私保护指引</a>
            </div>
            <div class="footer_copyright">
                Copyright © 2023-2023 wuyifan All Rights Reserved.
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.footercom{
    position: absolute;
    text-align: center;
    color: hsla(0, 0%, 100%, .7);
    background-color: rgb(247, 247, 247);
    padding: 40px 0 32px;
    width: 100%;
    /* bottom: 0; */
}
.footer_bd{
    line-height: 1;
}
.footer_links{
    display: inline-flex;
    font-size: 13px;
    margin-bottom: 8px;
    flex-wrap: wrap;
    padding: 0 24px;
    justify-content: center;
    line-height: 1.6;
}
.footer_copyright{
    color:#000;
    opacity: .5;
    font-size: 12px;
    margin-top: 2px;
    line-height: 17px;
}
.graytext{
    color:rgba(0, 0, 0, .7);
}
</style>