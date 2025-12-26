export async function POST(request: Request) {
    const headers = { "Content-Type": "application/json" };
    try {
        const { prompt } = await request.json();
        if (!prompt) {
            return new Response(JSON.stringify({ error: "Prompt is required!" }), { status: 400, headers });
        }
        // const url = process.env.EXPO_PUBLIC_IMG_API_URL;
        // const token = process.env.EXPO_PUBLIC_IMG_API_TOKEN;
        const url = "https://image-generator.animeshsrivastava246246.workers.dev";
        const token = "d9B/N<,XjKAWDGkS6rl=0hVe|U]y^";
        if (!url || !token) {
            return new Response(JSON.stringify({ error: "Image API URL or Token is not configured." }), { status: 500, headers });
        }

        const enhancedPrompt = `${prompt}. A high-resolution, highly detailed, professional image with vibrant colors and intricate details. Make the image 4:3 aspect ratio.`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ prompt: enhancedPrompt }),
        });
        if (!response.ok) {
            const text = await response.text().catch(() => "null");
            return new Response(JSON.stringify({ error: `Image API error: ${text}` || "Failed to generate image. :(" }), { status: response.status, headers });
        }

        const arrayBuffer = await response.arrayBuffer();
        const imgUrl = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        return new Response(JSON.stringify({ imgUrl }), { status: 200, headers });
    } catch (err) {
        return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers });
    }
}