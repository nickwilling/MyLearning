const mongoose = require('mongoose');

// 连接 MongoDB 数据库 
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// 创建一个模型，就是在设计数据库
// MongoDB 是动态的，非常灵活，只需要在代码中设计你的数据库就可以了。
// mongoose 这个包就可以让你的设计编写过程变得非常简单
const Cat = mongoose.model('Cat', { name: String }); //第一个参数是表名，也就是集合名称，会自动生成一个小写的cats集合，第二个参数就是数据结构

// 实例化一个 Cat
const kitty = new Cat({ name: 'Zildjian' });

// 持久化保存 kitty实例
kitty.save().then(() => console.log('meow'));