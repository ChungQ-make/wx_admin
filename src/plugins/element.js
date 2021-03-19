import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItemGroup, MenuItem, BreadcrumbItem, Breadcrumb, Card, Col, Row, Table, TableColumn, Switch, Tooltip, Pagination,
  Dialog, MessageBox, Tag, Notification, Tree, Option, Select, Cascader, TabPane, Alert, Tabs, Step, Steps
  , Checkbox, CheckboxGroup, Upload, Image, Timeline, TimelineItem, Radio, RadioGroup, InputNumber
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Image)
Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(InputNumber)
// 消息提示弹框需要挂载到原型对象上（$message是自定义属性 可变）
Vue.prototype.$message = Message

// 全局挂载MessageBox
// 确认提示框
Vue.prototype.$confirm = MessageBox.confirm
// 普通提示框
Vue.prototype.$alert = MessageBox.alert
// 简单提交提示框
Vue.prototype.$prompt = MessageBox.prompt

Vue.prototype.$notify = Notification
