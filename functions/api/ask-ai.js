export async function onRequestPost(context) {
    const { request, env } = context;

    // Check if API key is configured
    if (!env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: "API key not configured in Cloudflare environment" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { question, context: resumeContext } = await request.json();

        const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

        const prompt = `You are a helpful AI assistant on Shreya Khanna's professional portfolio website. 
        Your goal is to answer questions about her career, skills, and background based on the provided resume details.
        
        Keep your answers concise, professional, and highlight her strengths as a Product Manager.
        If the question is not about Shreya or her work, politely redirect them to ask about her professional experience.
        
        Resume Details:
        ${resumeContext}
        
        User Question: ${question}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await geminiResponse.json();

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
