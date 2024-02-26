<template>
    <!-- sidebar -->
    <aside class="sidebar navbar-default" role="navigation">
        <div class="sidebar-nav navbar-collapse">
            <ul class="nav" id="side-menu">
                <li class="sidebar-search">
                    <div class="input-group custom-search-form">
                        <input type="text" class="form-control" placeholder="Search...">
                        <span class="input-group-btn">
                            <button class="btn btn-primary" type="button">
                                <i class="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                    <!-- /input-group -->
                </li>
                <li>
                    <RouterLink to="/admin" class="active"><i class="fa fa-dashboard fa-fw"></i> Dashboard</RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/category-list"><i class="fa fa-table fa-fw"></i> Danh mục sản phẩm</RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/menu-list"><i class="fa fa-align-justify fa-fw"></i> Menus</RouterLink>
                </li>
            </ul>
        </div>
    </aside>
    <!-- /.sidebar -->
</template>