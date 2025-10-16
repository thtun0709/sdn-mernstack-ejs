const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");


dotenv.config();

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};
connectDB();

const app = express();

// const path = require("path"); //up imgae lên
// app.use(express.static(path.join(__dirname, "public")));

// Middleware cơ bản
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);



// Route cơ bản
// const expressLayouts = require('express-ejs-layouts');
// app.use(expressLayouts);

const { sessionData } = require("./middlewares/sessionMiddleware");
const { isLoggedIn } = require("./middlewares/authMiddleware");
app.use(sessionData);   
app.use(isLoggedIn);

const authRoutes = require("./router/authRouter");
app.use("/", authRoutes);

const perfumeRouter = require('./router/perfumeRouter');
app.use('/perfumes', perfumeRouter);


const Perfume = require('./models/perfumeModel');
app.get('/', async (req, res) => {
    try {
        const { search, brand, gender, sort } = req.query;
        const filter = {};
        let sortOption = { createdAt: -1 }; // mặc định mới nhất

        if (search) filter.name = { $regex: search, $options: 'i' };
        if (brand) filter.brand = brand;
        if (gender) filter.gender = gender;
        if (sort === 'asc') sortOption = { price: 1 };
        if (sort === 'desc') sortOption = { price: -1 };

        const perfumes = await Perfume.find(filter).sort(sortOption);
        const brands = await Perfume.distinct('brand');

        res.render('index', {
            title: 'Perfume House',
            member: req.session.member,
            perfumes,
            brands,
            search: search || '',
            brand: brand || '',
            gender: gender || '',
            sort: sort || '', // ✅ thêm dòng này
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tải trang chủ');
    }
});


//route cho user
const userRouter = require("./router/userRouter");
app.use("/users", userRouter);

// Comment routes 
const commentRouter = require("./router/commentRouter");
app.use("/comments", commentRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));




