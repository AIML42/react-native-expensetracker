// src/services/visionApi.ts
import Constants from 'expo-constants';
import { VisionApiResponse } from '../types'; // Adjust import path if src isn't used

const GOOGLE_CLOUD_VISION_API_KEY = "YOUR_KEY";
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

export const processImageWithApi = async (imageBase64: string): Promise<VisionApiResponse> => {
  if (!GOOGLE_CLOUD_VISION_API_KEY) {
      throw new Error("Google Cloud Vision API Key is not configured.");
  }

  console.log('Starting API call for OCR...');
  const requestPayload = { requests: [ { image: { content: imageBase64 }, features: [ { type: 'DOCUMENT_TEXT_DETECTION' } ] } ] };

  try {
    const response = await fetch(GOOGLE_VISION_API_URL, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(requestPayload) });
    const responseJson: { responses: VisionApiResponse[] } = await response.json();

    if (!response.ok) { throw new Error(responseJson.responses?.[0]?.error?.message || `HTTP status ${response.status}`); }
    if (responseJson.responses[0]?.error) { throw new Error(responseJson.responses[0].error.message || 'Unknown API error'); }
    if (!responseJson.responses || responseJson.responses.length === 0) { throw new Error('API returned empty response.'); }

    console.log('Google Vision API Raw Response:', JSON.stringify(responseJson.responses[0], null, 2));
    return responseJson.responses[0]; // Return the response data

  } catch (error: any) {
    console.error('API Call Error in service:', error);
    // Re-throw or return a specific error structure
    throw new Error(`API Request Failed: ${error.message || 'Unknown error'}`);
  }
};