
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const safetyCheckSchema = {
    type: Type.OBJECT,
    properties: {
        compliant: { type: Type.BOOLEAN, description: 'True nếu kiểm tra an toàn đạt, ngược lại là false.' },
        reason: { type: Type.STRING, description: 'Giải thích ngắn gọn về tình trạng tuân thủ.' },
    },
    required: ['compliant', 'reason']
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        whiteHelmet: { ...safetyCheckSchema, description: "Kiểm tra xem có đội mũ bảo hộ màu trắng trên đầu không." },
        helmetStrapFastened: { ...safetyCheckSchema, description: "Kiểm tra xem quai mũ bảo hộ có được cài chắc chắn không." },
        orangeSuit: { ...safetyCheckSchema, description: "Kiểm tra xem có mặc quần áo bảo hộ màu cam đúng quy cách không." },
        sleeveButtonsFastened: { ...safetyCheckSchema, description: "Kiểm tra xem nút tay áo có được cài không." },
        safetyShoes: { ...safetyCheckSchema, description: "Kiểm tra xem có mang giày bảo hộ phù hợp không." },
    },
    required: ['whiteHelmet', 'helmetStrapFastened', 'orangeSuit', 'sleeveButtonsFastened', 'safetyShoes']
};

export const analyzeImageForSafety = async (base64ImageData: string): Promise<AnalysisResult> => {
    const base64Data = base64ImageData.split(',')[1];

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
        },
    };

    const textPart = {
        text: `Phân tích hình ảnh người công nhân và xác định các mục sau:
1. Người đó có đội mũ bảo hộ màu trắng không?
2. Quai mũ bảo hộ có được cài chắc chắn dưới cằm không?
3. Người đó có mặc quần áo bảo hộ màu cam đúng quy cách không?
4. Nút ở cổ tay áo có được cài không?
5. Người đó có mang giày bảo hộ không?

Hãy đưa ra lý do cho mỗi nhận định. Nếu một mục không thể xác định rõ ràng từ hình ảnh (ví dụ: bị che khuất hoặc ngoài khung hình), hãy nêu rõ điều đó trong lý do.
Chỉ trả lời bằng một đối tượng JSON hợp lệ theo schema đã cung cấp.`,
    };
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("Không thể phân tích hình ảnh. Vui lòng thử lại.");
    }
};
