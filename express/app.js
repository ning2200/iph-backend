import express from 'express';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import userRouter from './routes/user.route.js';
import agentRouter from './routes/agent.route.js';
import corsMiddleware from './middleware/cors.middleware.js';
import dashboardRouter from './routes/dashboard.route.js';
import testsRouter from './tests/tests.route.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.EXPRESS_PORT || 4000;

app.use(corsMiddleware);
app.use(express.json());

app.use('/user', userRouter);
app.use('/agent', agentRouter);
app.use('/dashboard', dashboardRouter);
app.use('/test', testsRouter);

app.use(function (req, res, next) {
    next(createHttpError(404));
})

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;