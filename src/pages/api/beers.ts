import { createClient } from "redis"

const redis =  await createClient({ url: import.meta.env.REDIS_URL }).connect();

export async function GET() {
    const beers = await redis.get("beers");
    return Response.json({ beers });
}

export async function POST() {
    const data = [
        {
            name: "Almond Nights",
            style: "Dark Ale",
            fields: [
                { key: "info", value: "+ Roasted Almonds" },
                { key: "metrics", value: "5% ABV | 27 IBU | 12°P" },
            ]
        },
        {
            name: "Earl of Paradise",
            style: "Saison",
            fields: [
                { key: "info", value: "+ Earl Grey & Paradise Seeds"},
                { key: "metrics", value: "6.7% ABV | 31 IBU | 1.061OG"},
            ]
        },
        {
            name: "Sour Sweet Symphony",
            style: "French Saison",
            fields: [
                { key: "info", value: "+ Cherry & Black Currant"},
                { key: "metrics", value: "4% ABV | 20 IBU | 10°P"},
            ]
        },
        {
            name: "Red Out",
            style: "Table Sour",
            fields: [
                { key: "info", value: "+ Cherry & Black Currant"},
                { key: "metrics", value: "2.8% ABV | 0 IBU | 1.035 OG"},
            ]
        },
    ];
    await redis.set("beers", JSON.stringify(data))
    return Response.json({ message: 'Data added' })
}

export async function PUT({request}) {
    const data = await request.json()
    await redis.set("beers", JSON.stringify(data))
    return Response.json({ message: 'Data updated' })
}

export const prerender = false;
