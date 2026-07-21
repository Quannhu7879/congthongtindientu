import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set or using placeholder.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Chatbot API Endpoint
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  try {
    const { messages, userRole, fullName, additionalContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Tham số 'messages' không hợp lệ." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return a simulated, helpful offline response if the API key is not configured
      const lastMessage = messages[messages.length - 1]?.content || "";
      res.json({
        text: `Chào bạn! Tôi là Trợ lý học thuật AI của trường THCS Hòa Phú. Hiện tại hệ thống chưa được kích hoạt Khóa bảo mật API (GEMINI_API_KEY). Hãy cấu hình nó trong phần Settings > Secrets.\n\nCâu hỏi của bạn là: "${lastMessage}". Tôi rất muốn trả lời nhưng cần có khóa API để kết nối trực tiếp với trí tuệ nhân tạo Gemini 3.5.`,
        offline: true
      });
      return;
    }

    // Format messages for @google/genai SDK
    // The SDK expects roles: 'user' or 'model'
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // Create system instructions for school assistant context
    const systemInstruction = `Bạn là "Trợ lý Học thuật AI" của trường THCS Hòa Phú (một trường THCS tại xã Hòa Xá, huyện Ứng Hòa, Hà Nội).
Hãy đóng vai một trợ lý ảo thông minh, thân thiện, lịch sự và am hiểu sâu sắc về thông tin giáo dục, nội quy nhà trường, kế hoạch học tập, các khóa học năng khiếu và học bạ của học sinh.

Thông tin người dùng đang trò chuyện với bạn:
- Họ tên: ${fullName || "Khách ghé thăm"}
- Vai trò: ${userRole || "Chưa xác định"}

Ngữ cảnh trường học hiện tại:
${additionalContext || "Trường THCS Hòa Phú tích cực thúc đẩy chuyển đổi số và cổng thông tin điện tử thông minh."}

Hướng dẫn trả lời:
1. Luôn chào hỏi thân thiện bằng tiếng Việt, xưng hô phù hợp với vai trò của người dùng (Ví dụ: "Chào thầy/cô" nếu là Giáo viên, "Chào phụ huynh" nếu là Phụ huynh, "Chào em" nếu là Học sinh).
2. Trả lời ngắn gọn, rõ ràng, trình bày đẹp mắt bằng Markdown (sử dụng bullet points, in đậm các ý chính).
3. Đưa ra lời khuyên học tập thiết thực, khích lệ tinh thần học tập của học sinh hoặc hỗ trợ phụ huynh quản lý con em mình tốt nhất.
4. Nếu người dùng hỏi về điểm số hoặc học bạ, khuyên họ vào mục "Học bạ tổng hợp" hoặc "Sổ liên lạc" để tra cứu chính xác nhất. Nếu hỏi về đăng ký lớp, khuyên họ vào "Khóa học của con".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "Xin lỗi, tôi chưa thể tìm ra câu trả lời thích hợp.",
      offline: false
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Đã xảy ra lỗi khi kết nối với máy chủ AI.",
      details: error.message 
    });
  }
});

// Serve frontend build or mount Vite dev server
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack] Server running on http://localhost:${PORT}`);
  });
}

start();
