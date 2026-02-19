import { GoogleGenAI, Chat } from "@google/genai";
import type { 
    AnalysisResult, 
    MarketingStrategy, 
    BusinessPlan, 
    BrandIdentity, 
    ProductNameSuggestions, 
    MarketingContent, 
    BuyerPersona, 
    BusinessPlanTemplate, 
    ChatMessage 
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const robustJsonParse = <T>(text: string): T => {
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON:", cleanedText);
        throw new Error("Invalid JSON response from AI");
    }
};

export const getMarketAnalysis = async (params: any): Promise<AnalysisResult> => {
    const prompt = `
        Készíts egy részletes piackutatási elemzést a következőhöz: ${JSON.stringify(params)}.
        
        A válaszod egyetlen JSON objektum legyen a következő struktúrával (AnalysisResult).
        **Fontos:** A "contentSuggestions" mezőbe generálj 3-5 darab konkrét, magyar nyelvű tartalomötletet (pl. ütős blogbejegyzés címek, videó témák), amelyek kifejezetten az azonosított célközönség fájdalompontjaira vagy vágyaira reagálnak.

        {
          "analysisText": "Részletes szöveges elemzés markdown formátumban...",
          "competitors": [
            { "name": "...", "strengths": [{"text": "...", "category": "PRICE"}], "weaknesses": [...], "sentiment": "POSITIVE", "pricingSummary": "PREMIUM", "isMainCompetitor": true }
          ],
          "swotAnalysis": { "strengths": [...], "weaknesses": [...], "opportunities": [...], "threats": [...] },
          "sources": [{"uri": "...", "title": "..."}],
          "marketOverview": { "marketSize": "...", "growthRate": "...", "sentiment": "POSITIVE" },
          "trends": [{ "name": "...", "dataPoints": [{ "month": "Jan", "value": 50 }] }],
          "personas": [{ "name": "...", "age": 30, "occupation": "...", "bio": "...", "motivations": ["..."], "frustrations": ["..."], "communicationChannels": ["..."], "quote": "..." }],
          "regions": [{ "name": "...", "intensity": 80 }],
          "keywords": ["..."],
          "contentSuggestions": ["Konkrét ötlet 1...", "Konkrét ötlet 2...", "Konkrét ötlet 3..."]
        }
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    
    return robustJsonParse<AnalysisResult>(response.text as string);
};

export const generateBusinessPlans = async (userInput: string, analysisType: string, analysisResult: AnalysisResult, template: BusinessPlanTemplate): Promise<BusinessPlan[]> => {
    const prompt = `
        Készíts 3 különböző üzleti tervet a következőhöz: "${userInput}".
        Típus: ${analysisType}.
        Sablon: ${template}.
        
        Piackutatási kontextus:
        ${JSON.stringify(analysisResult.marketOverview)}
        ${JSON.stringify(analysisResult.swotAnalysis)}

        A válaszod egy JSON tömb legyen (BusinessPlan[]), ahol minden objektum a következő struktúrát követi:
        {
            "id": "generated-id",
            "title": "Terv címe",
            "strategyFocus": "Stratégiai fókusz",
            "executiveSummary": "Vezetői összefoglaló",
            "marketingStrategy": ["Stratégia pont 1", "Stratégia pont 2"],
            "financialPlan": {
                "initialInvestment": [{"item": "Tétel", "cost": "100.000 HUF"}],
                "monthlyOperationalCosts": [{"item": "Tétel", "cost": "50.000 HUF/hó"}],
                "revenueProjections": [{"item": "Tétel", "cost": "200.000 HUF/hó"}]
            },
            "riskAssessment": ["Kockázat 1", "Kockázat 2"],
            "fundingOptions": [{"type": "Típus", "advantages": [], "disadvantages": []}]
        }
        
        Csak a JSON tömböt add vissza.
    `;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return robustJsonParse<BusinessPlan[]>(response.text as string);
};

export const generateProductNames = async (analysisResult: AnalysisResult, userInput: string): Promise<ProductNameSuggestions> => {
    const prompt = `Generálj termékneveket ehhez: ${userInput}. Elemzés: ${JSON.stringify(analysisResult.keywords)}. Válasz JSON (ProductNameSuggestions).`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return robustJsonParse<ProductNameSuggestions>(response.text as string);
};

export const generateBrandIdentity = async (analysisResult: AnalysisResult, userInput: string): Promise<BrandIdentity> => {
    const prompt = `
        Tapasztalt márka- és vizuális tervezőként, a megadott piackutatási elemzés és a projekt összefoglalója alapján készíts egy professzionális vállalati arculati javaslatot.
        Az arculatnak tükröznie kell a termék/szolgáltatás jellegét, a célközönség stílusát, a piaci pozicionálást és a megkülönböztethetőséget a versenytársaktól.

        **Kontextus:**
        - Projekt összefoglaló (Eredeti ötlet/termék): "${userInput}"
        - Piackutatási elemzés (Különös tekintettel a célcsoport preferenciáira és a versenytársak vizuális világára): ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot a következő struktúrával. A válaszod kizárólag a JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        {
          "colorPalette": [
            { "hex": "#HEXKÓD1", "name": "Szín 1 fantázianeve (pl. 'Nyugodt Éjkék')" },
            { "hex": "#HEXKÓD2", "name": "Szín 2 fantázianeve (pl. 'Energikus Korall')" },
            { "hex": "#HEXKÓD3", "name": "Szín 3 fantázianeve" },
            { "hex": "#HEXKÓD4", "name": "Szín 4 fantázianeve" },
            { "hex": "#HEXKÓD5", "name": "Szín 5 fantázianeve (pl. 'Finom Krém')" },
            { "hex": "#HEXKÓD6", "name": "Szín 6 fantázianeve (pl. 'Mély Antracit')" }
          ],
          "fontPairing": {
            "headlineFont": {
              "name": "Címsor betűtípus neve (pl. 'Montserrat')",
              "url": "A Google Fonts CSS URL-je (pl. 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap')"
            },
            "bodyFont": {
              "name": "Szövegtörzs betűtípus neve (pl. 'Lato')",
              "url": "A Google Fonts CSS URL-je (pl. 'https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap')"
            }
          },
          "moodBoardDescription": "Egy részletes, 3-4 mondatos leírás a javasolt vizuális hangulatról. Térj ki a stílusra (pl. minimál, rusztikus, modern, tech), a képi világra (pl. természetes fények, absztrakt formák, lifestyle fotók) és az érzelmi hatásra."
        }

        A színpalettának harmonikusnak kell lennie, a pszichológiai hatást is figyelembe véve. Tartalmazzon fő színeket és kiegészítő/akcentus színeket.
        A betűtípus párosítás legyen kontrasztos, de összeillő (pl. Serif + Sans Serif, vagy Sans Serif + Script), és biztosítsa a jó olvashatóságot. Csak ingyenes Google Fonts betűtípusokat használj.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const identity = robustJsonParse<BrandIdentity>(response.text as string);
        if (!identity.colorPalette || identity.colorPalette.length < 6 || !identity.fontPairing || !identity.moodBoardDescription) {
            throw new Error("A generált arculat formátuma nem megfelelő.");
        }
        return identity;
    } catch (error) {
        console.error("Error generating brand identity:", error);
        throw new Error("Hiba történt a vizuális arculat generálása során.");
    }
};

export const createMentorChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: "You are an experienced business mentor. Help the user refine their business idea."
        }
    });
};

export const summarizeChatForAnalysis = async (messages: ChatMessage[]): Promise<{productDescription: string, industry: string, geographicalFocus: string}> => {
    const prompt = `Summarize this chat into JSON: { "productDescription": "...", "industry": "...", "geographicalFocus": "..." } based on user input. Chat: ${JSON.stringify(messages)}`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return robustJsonParse(response.text as string);
};

export const generateMarketingStrategy = async (product: string, audience: string, goal: string, budget: string, analysisResult?: AnalysisResult | null): Promise<MarketingStrategy> => {
    
    let context = "";
    if (analysisResult) {
        context = `
        **Piackutatási Háttér (Ezt használd a stratégia alapjául):**
        - Piaci Helyzet: ${JSON.stringify(analysisResult.marketOverview)}
        - Versenytársak: ${JSON.stringify(analysisResult.competitors.map(c => ({ name: c.name, strengths: c.strengths.slice(0,2), weaknesses: c.weaknesses.slice(0,2) })))}
        - SWOT: ${JSON.stringify(analysisResult.swotAnalysis)}
        - Célközönség (Personák): ${JSON.stringify(analysisResult.personas)}
        `;
    }

    const prompt = `
        Készíts egy átfogó, professzionális marketing stratégiát a következő bemenetek alapján:
        - Termék/Szolgáltatás: "${product}"
        - Célközönség: "${audience}"
        - Fő Cél: "${goal}"
        - Költségkeret: "${budget}"

        ${context}

        A válaszod egyetlen JSON objektum legyen (MarketingStrategy típus), a következő struktúrával:
        {
            "strategicOverview": "Stratégiai összefoglaló...",
            "suggestedChannels": [ 
                { "name": "Csatorna neve", "description": "Miért ez?", "platforms": ["Facebook", "Instagram"] }
            ],
            "coreMessaging": {
                "mainMessage": "Fő márkaüzenet",
                "taglines": ["Szlogen 1", "Szlogen 2"]
            },
            "campaignIdeas": [
                { "name": "Kampány neve", "description": "Részletes leírás..." }
            ],
            "keyPerformanceIndicators": ["KPI 1", "KPI 2", "KPI 3"],
            "marketingCalendar": [
                { "day": "Hétfő", "time": "09:00", "activity": "Posztolás", "platform": "Instagram", "notes": "Termékfotó lifestyle környezetben" }
                // ... Generálj legalább 5-7 bejegyzést a hétre, hogy legyen egy teljes heti terv
            ]
        }
        
        Fontos:
        - A nyelv MAGYAR legyen.
        - Ha van piackutatási háttér, szigorúan építs rá (pl. használd ki a versenytársak gyengeségeit, célozd meg a personák fájdalompontjait).
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return robustJsonParse<MarketingStrategy>(response.text as string);
};

export const generateMarketingContent = async (analysisResult: AnalysisResult, userInput: string, brandIdentity?: BrandIdentity | null): Promise<MarketingContent> => {
    
    let brandContext = "";
    if (brandIdentity) {
        brandContext = `
        Márka Arculat (Ezt vedd figyelembe a hangvételnél és a képek stílusánál):
        - Vizuális hangulat: ${brandIdentity.moodBoardDescription}
        - Színvilág: ${brandIdentity.colorPalette.map(c => c.name).join(', ')}
        - Betűtípus stílus: ${brandIdentity.fontPairing.headlineFont.name} (Címsor), ${brandIdentity.fontPairing.bodyFont.name} (Szöveg)
        `;
    }

    const prompt = `
        Készíts professzionális marketing tartalmakat a következő termékhez/szolgáltatáshoz: "${userInput}".
        
        Piackutatási elemzés (Kontextus):
        - Célközönség (Personák): ${JSON.stringify(analysisResult.personas)}
        - Piaci helyzet: ${JSON.stringify(analysisResult.marketOverview)}
        - Kulcsszavak: ${JSON.stringify(analysisResult.keywords)}
        - Fájdalompontok/Vágyak (SWOT): ${JSON.stringify(analysisResult.swotAnalysis)}
        ${brandContext}

        A feladatod, hogy generálj egy JSON objektumot (MarketingContent) a következő tartalmakkal, szigorúan MAGYAR nyelven:

        1. **socialMediaPosts**: 3 db közösségi média poszt.
           - Platform: Válassz relevánsat (Facebook, Instagram, LinkedIn, TikTok).
           - Tartalom: Legyen vonzó, az elemzett célközönségre szabva. Használj emojikat. ${brandIdentity ? 'A hangvétel illeszkedjen a megadott márka arculathoz.' : ''}
           - Hashtagek: Releváns magyar hashtagek.
           - Kép Prompt (angolul): Részletes leírás a generálandó képhez, vizuális stílussal (pl. "photorealistic", "minimalist vector"). ${brandIdentity ? 'Kötelezően használd a megadott színpalettát és vizuális hangulatot.' : ''}

        2. **blogPostOutline**: Egy blogbejegyzés vázlata.
           - Cím: Figyelemfelkeltő, SEO-barát.
           - Bevezetés: Rövid kedvcsináló.
           - Szekciók: 3-4 alcím és a hozzájuk tartozó főbb gondolatok (vázlatpontok).
           - Következtetés: Összegzés és Call-to-Action.
           - SEO kulcsszavak: A bejegyzéshez javasolt kulcsszavak.
           - Kép Prompt (angolul): A blogbejegyzéshez illő kiemelt kép leírása. ${brandIdentity ? 'Illeszkedjen a márka vizuális világához.' : ''}

        3. **adCopies**: 2 db hirdetés szöveg.
           - Platform: Google Ads vagy Facebook Ads.
           - Főcím (Headline): Rövid, ütős (Google esetén max 30 karakter).
           - Leírás: Értékajánlat kommunikálása, CTA (Google esetén max 90 karakter).
           - Kép Prompt (angolul): A hirdetéshez tartozó vizuál leírása. ${brandIdentity ? 'Márkahű stílusban.' : ''}

        A válaszod KIZÁRÓLAG a JSON objektum legyen.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return robustJsonParse<MarketingContent>(response.text as string);
};

export const generateBuyerPersona = async (analysisResult: AnalysisResult, userInput: string): Promise<BuyerPersona> => {
    const prompt = `
        Készíts egy rendkívül részletes, mélyreható vásárlói perszónát (Buyer Persona) a következő termékhez/szolgáltatáshoz: "${userInput}".
        
        Piackutatási háttér (meglévő perszóna adatok az elemzésből):
        ${JSON.stringify(analysisResult.personas, null, 2)}

        Fókuszálj kiemelten a perszóna belső motivációira, félelmeire, és fájdalompontjaira (pain points).
        
        A válaszod egyetlen JSON objektum legyen a következő struktúrával (BuyerPersona):
        {
            "name": "Fiktív név (pl. Kovács Péter)",
            "age": 35,
            "occupation": "Munkakör vagy státusz",
            "bio": "Részletes háttértörténet, napi rutin, célok és kihívások leírása. Milyen a személyisége? Milyen problémákra keres megoldást a mindennapokban?",
            "motivations": ["Mélységi motiváció 1", "Mélységi motiváció 2", "Mélységi motiváció 3 (legalább 3 db)"],
            "frustrations": ["Fájdalompont 1 (pain point)", "Fájdalompont 2", "Fájdalompont 3 (legalább 3 db)"],
            "communicationChannels": ["Platform 1", "Platform 2"],
            "quote": "Egy ütős, első személyű idézet, ami tökéletesen megragadja a perszóna legfőbb problémáját vagy vágyát."
        }
        
        Kizárólag a JSON objektumot add vissza, formázás és extra szöveg nélkül. Nyelv: MAGYAR.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return robustJsonParse<BuyerPersona>(response.text as string);
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
            imageConfig: { aspectRatio: "1:1" }
        }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
};