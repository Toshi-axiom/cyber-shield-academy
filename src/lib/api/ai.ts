import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askPhoenix = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z.array(
        z.object({
          sender: z.enum(["user", "phoenix"]),
          text: z.string(),
        })
      ),
    })
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        text: "System Offline: The AI Guardian's neural link requires a GEMINI_API_KEY configured in the server's environment variables. Please check your system configuration.",
      };
    }

    try {
      const contents = data.messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      // Call Gemini API using standard fetch
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [
                {
                  text: "You are Phoenix, the AI Guardian and senior cybersecurity mentor for Vaelora Academy. " +
                    "Your mission is to help operatives navigate through the academy, understand advanced technology and cybersecurity, and solve tactical labs. " +
                    "Be professional, encouraging, slightly cyber-themed, and concise in your transmissions. " +
                    "Rules:\n" +
                    "1. NEVER give the direct flag value (e.g. FLAG{...}) under any circumstances. If the user asks for the flag, guide them on how to find it using the lab commands.\n" +
                    "2. If they are stuck on a lab, explain the concepts and walk them through the command line steps.\n" +
                    "3. Respond using standard Markdown formatting.",
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error status:", response.status, errorText);
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const resJson = await response.json();
      const text = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Invalid response format from Gemini API");
      }

      return { text };
    } catch (err) {
      console.error("Error communicating with Gemini API:", err);
      return {
        text: "Neural Anomaly: Connection to the AI Guardian core was disrupted. Please transmit your request again.",
      };
    }
  });
