import {createRouter, createWebHashHistory} from "vue-router";
import DashBoardPage from "@/components/dashboard/DashBoardPage.vue";
import CategoryPage from "@/components/category/CategoryPage.vue";
import ProductsPage from "@/components/product/ProductsPage.vue";
import OrderPage from "@/components/order/OrderPage.vue";
import CustomerPage from "@/components/customer/CustomerPage.vue";
import SettingPage from "@/components/setting/SettingPage.vue";
import FormControlPage from "@/components/category/FormControlPage.vue";


const routes = [
    {
        path:'/',
        redirect:'/home',
    },
    {
        path: '/home',
        name:'Dashboard',
        component:DashBoardPage,
    },
    {
        path:'/category',
        name:'Categories',
        component:CategoryPage,
        children: [
            {
                path: 'form-control/:id',
                name: 'FormControl',
                component: FormControlPage,
                props: true
            }
        ]
    },
    {
        path:'/product',
        name:'Products',
        component:ProductsPage,
    },
    {
        path:'/orders',
        name:'Order',
        component:OrderPage,
    },
    {
        path:'/customer',
        name:'Customers',
        component:CustomerPage,
    },
    {
        path:'/setting',
        name:'Setting',
        component:SettingPage,
    },
    {
        path: "/:pathMatch(.*)*",
        component:Error,
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

// router.beforeEach((to, from, next) => {
//
// })

export default router;