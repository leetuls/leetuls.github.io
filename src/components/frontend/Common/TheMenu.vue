
import { RouterLink } from 'vue-router';
<template>
    <div class="header-bottom"><!--header-bottom-->
        <div class="container">
            <div class="row">
                <div class="col-sm-9">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                    </div>
                    <div class="mainmenu pull-left">
                        <ul class="nav navbar-nav collapse navbar-collapse" id="ul-menu">
                            <li><a href="/" class="active">Home</a></li>
                            <li class="dropdown"><a href="#" id="shopTag">Shop<i class="fa fa-angle-down"></i></a>
                                <ul role="menu" class="sub-menu">
                                    <li><a href="/shop">Products</a></li>
                                    <li><a href="/product-details">Product Details</a></li>
                                    <li><router-link to="/checkout" @click="changeColor">Checkout</router-link></li>
                                    <li><router-link to="/cart" @click="changeColor">Cart</router-link></li>
                                    <li><router-link to="/login" @click="changeColor">Login</router-link></li>
                                </ul>
                            </li>
                            <li class="dropdown"><a href="#" id="blogListTag">Blog<i class="fa fa-angle-down"></i></a>
                                <ul role="menu" class="sub-menu">
                                    <li><a href="/blog-list">Blog List</a></li>
                                    <li><a href="/blog-single">Blog Single</a></li>
                                </ul>
                            </li>
                            <li><a href="404.html">404</a></li>
                            <li><router-link to="/contact-us" id="contact-us">Contact</router-link></li>
                        </ul>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="search_box pull-right">
                        <input type="text" placeholder="Search" />
                    </div>
                </div>
            </div>
        </div>
    </div><!--/header-bottom-->
</template>

<script setup>
import { Common } from '@/utils/common';
const changeColor = () => {
    Common.removeColorAllMenu();
}
</script>