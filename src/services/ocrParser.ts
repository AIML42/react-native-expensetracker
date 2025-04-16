// src/services/ocrParser.ts
import { ParsedOcrResult } from '../types'; // Adjust import path if needed
import { parse, format, isValid, parseISO } from 'date-fns'; // Import date-fns functions

export const parseOcrText = (text: string): ParsedOcrResult => {
    const result: ParsedOcrResult = { amount: null, description: 'Scanned Receipt', date: null };
    if (!text) return result;

    console.log("Parsing text from API:\n", text);
    let potentialAmount: number | null = null;
    let maxAmountFound = 0;
    const totalKeywords = ['total', 'balance', 'eur', 'sale', 'amount due', 'paid', 'payment', 'charge'];
    const lines = text.toLowerCase().split('\n');

    const strictAmountRegex = /(?:€|\$|£)\s*(\d{1,5}(?:[.,]\d{2}))\b/i;
    const looseAmountRegex = /\b(\d{1,5}(?:[.,]\d{2}))\b/i;
    // More specific date regex patterns to try
    const datePatterns = [
        'dd/MM/yy',   // 22/03/25
        'dd-MM-yy',   // 22-03-25
        'dd/MM/yyyy', // 14/03/2025
        'dd-MM-yyyy', // 14-03-2025
        'yyyy-MM-dd', // 2025-03-14
        'dd MMM yy',  // 14 Mar 25 (case insensitive handled by lowercasing text)
        'dd MMM yyyy', // 14 Mar 2025
    ];
    // Regex to find potential date strings first
    const dateFinderRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(\d{4}-\d{2}-\d{2})|(\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{2,4}\b)/i;


    // --- Store Name Extraction --- (Keep previous logic)
    for (let i = 0; i < Math.min(lines.length, 5); i++) { /* ... */
         const line = lines[i].trim();
         if (line.length > 3 && line.length < 50 && !/^\d/.test(line) && !/\d{2}[/-]\d{2}[/-]\d{2,4}/.test(line) && !strictAmountRegex.test(line) && !line.includes(':')) {
             result.description = line.split(/ {2,}/)[0]; console.log(`Potential store name: ${result.description}`); break;
         }
    }

    // --- Amount & Date Extraction ---
    for (const line of lines) {
         // -- Amount Logic -- (Keep previous logic)
         /* ... */
        const containsKeyword = totalKeywords.some(keyword => line.includes(keyword));
        let currentAmount : number | null = null; let matchedStrict = false;
        const strictMatch = line.match(strictAmountRegex);
        if (strictMatch && strictMatch[1]) { const amountStr = strictMatch[1].replace(',', '.'); const parsedAmount = parseFloat(amountStr); if (!isNaN(parsedAmount) && parsedAmount > 0) { currentAmount = parsedAmount; matchedStrict = true; } }
        if (matchedStrict && containsKeyword && currentAmount !== null) { if (potentialAmount === null || currentAmount > potentialAmount) { potentialAmount = currentAmount; } }
        const looseMatch = line.match(looseAmountRegex);
        if (looseMatch && looseMatch[1]) { const amountStr = looseMatch[1].replace(',', '.'); const parsedAmount = parseFloat(amountStr); const looksLikeYearDotSomething = /20\d{2}[.,]\d{2}/.test(looseMatch[0]); const looksLikeTime = /\b\d{1,2}:\d{2}(:\d{2})?\b/.test(line); if (!isNaN(parsedAmount) && parsedAmount > 0 && !looksLikeYearDotSomething && !looksLikeTime) { if (parsedAmount > maxAmountFound) { maxAmountFound = parsedAmount; } } }


         // -- Date Logic using date-fns --
         if (!result.date) {
             const dateMatch = line.match(dateFinderRegex);
             if (dateMatch) {
                 const extractedDateString = (dateMatch[0] || '').trim(); // Get the full matched string
                 console.log(`Potential date string found: ${extractedDateString}`);
                 // Try parsing the extracted string with known patterns
                 for (const pattern of datePatterns) {
                     try {
                         // Use a reference date slightly in the past to help with yy -> yyyy conversion
                         const referenceDate = new Date();
                         referenceDate.setFullYear(referenceDate.getFullYear() - 10); // Assume dates are within last ~20 years

                         const parsedDate = parse(extractedDateString, pattern, referenceDate);

                         if (isValid(parsedDate)) {
                             // Format consistently to YYYY-MM-DD
                             result.date = format(parsedDate, 'yyyy-MM-dd');
                             console.log(`Stored date as: ${result.date} using pattern: ${pattern}`);
                             break; // Stop trying patterns once a valid date is found
                         }
                     } catch (e) {
                         // Ignore parsing errors for specific patterns, try the next
                     }
                 }
                 if (!result.date) {
                    console.warn("Could not parse extracted date string with known patterns:", extractedDateString);
                 }
             }
         }
    } // End loop

    // --- Final Amount Decision --- (Keep previous logic)
    /* ... */
    if (potentialAmount === null && maxAmountFound > 0) { potentialAmount = maxAmountFound; }
    result.amount = potentialAmount;


    // If no date was parsed from OCR, default to today
    if (!result.date) {
        result.date = format(new Date(), 'yyyy-MM-dd'); // Use date-fns format
        console.log(`No date found in OCR, defaulting to today: ${result.date}`);
    }

    console.log("Parsed Result:", result);
    return result;
};