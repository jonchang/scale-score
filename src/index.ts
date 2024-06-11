import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/api/*', cors());

app.get('/api/next', async c => {
    const { results } = await c.env.DB.prepare(`
    SELECT images.basename FROM images LEFT JOIN ratings USING (basename) WHERE rating IS NULL ORDER BY RANDOM() LIMIT 1
    `).all()
    return c.json(results)
})

app.get('/api/all', async c => {
    const { results } = await c.env.DB.prepare(`
    SELECT * FROM ratings;
    `).all()
    return c.json(results)
})

app.get('/api/best', async c => {
    const { results } = await c.env.DB.prepare(`
    SELECT basename FROM ratings GROUP BY basename HAVING AVG(rating) = 1;
    `).all()
    return c.json(results)
})

app.get('/api/review', async c => {
    const { results } = await c.env.DB.prepare(`
    SELECT DISTINCT rater, basename, rating FROM ratings ORDER BY rater, basename, rating
    `).all()
    const grouped = Object.groupBy(results, (row) => row.rater)
    return c.json(grouped)
})

app.post('/api/rate/:basename', async c => {
    const { basename } = c.req.param()
    const { rater, rating } = await c.req.json()

    if (!(rating === 1 || rating === 0)) return c.text("Missing rating value")
    if (!rater) return c.text("Missing rater value")

    const { success } = await c.env.DB.prepare(`
    insert into ratings (basename, rater, rating) values (?, ?, ?)
  `).bind(basename, rater, rating).run()

    if (success) {
        c.status(201)
        return c.text("Created")
    } else {
        c.status(500)
        return c.text("Something went wrong")
    }
})

app.onError((err, c) => {
    console.error(`${err}`);
    return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));

export default app
