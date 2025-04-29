import OpenAI from "openai";

const client = new OpenAI();

export async function POST(req: Request) {
  const { prompt: input } = await req.json();

  const result = await client.responses.create({
    model: "gpt-4-turbo",
    input,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result) {
        if (chunk.type === "response.output_text.delta" && chunk.delta) {
          controller.enqueue(new TextEncoder().encode(chunk.delta));
        }
      }

      controller.close();
    },
  });


  return new Response(stream, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
