import { GoogleGenAI, Chat, Type } from "@google/genai";
import { AnalysisResult, BusinessPlan, MarketEntryProcess, Source, ChatMessage, UVP, AnalysisSummary, MarketingContent, BuyerPersona, MarketingStrategy, BusinessPlanTemplate, BrandIdentity, ProductNameSuggestions } from './types'; // Kijavítva

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getBasePromptStructure = () => `
    A válaszod egy JSON objektum legyen, amely a következő kulcsokat tartalmazza: 'analysisText', 'competitors', 'swotAnalysis', 'marketOverview', 'trends', 'personas', 'regions', 'keywords', 'contentSuggestions'. Ne adj hozzá semilyen más szöveget a JSON-on kívül, beleértve a Markdown formázást is.

    A 'competitors' rész egy tömb legyen, ami 2-3 fő versenytársat listáz. Azonosítsd a 2 legfontosabb versenytársat, és az ő objektumukban adj hozzá egy '"isMainCompetitor": true' kulcsot. Minden versenytárs objektumnak tartalmaznia kell a nevét ('name'), az erősségeit ('strengths'), a gyengeségeit ('weaknesses'), egy általános hangulatelemzést ('sentiment'), és egy árazási összefoglalót ('pricingSummary').
    A 'sentiment' értéke legyen "POSITIVE", "NEGATIVE", "NEUTRAL".
    A 'pricingSummary' értéke legyen "AFFORDABLE", "MID_RANGE", "PREMIUM", vagy "NOT_AVAILABLE".
    Az 'strengths' és 'weaknesses' egy-egy tömb legyen, ami objektumokat tartalmaz 'text' és 'category' kulccsal ('PRICE', 'QUALITY', 'MARKETING', 'CUSTOMER_SERVICE', 'INNOVATION', 'BRAND_REPUTATION', 'OTHER').

    FONTOS a 'swotAnalysis' résznél: Minden SWOT ponthoz adj hozzá egy opcionális 'relatedCompetitor' kulcsot, ha a pont közvetlenül egy azonosított versenytársra vonatkozik (különösen a Lehetőségek és Veszélyek esetében). Az értéke legyen a versenytárs PONTOS neve a 'competitors' listából. Például: { "text": "A Versytárs Kft. gyenge ügyfélszolgálatának kihasználása...", "impact": "HIGH", "relatedCompetitor": "Versytárs Kft." }. Az 'impact' értéke legyen 'HIGH', 'MEDIUM', vagy 'LOW'.

    A 'marketOverview' egy objektum legyen a következő struktúrával:
    {
        "marketSize": "Becsült piacméret (pl. '1.5 Mrd HUF')",
        "growthRate": "Éves növekedési ráta (pl. '8.2% CAGR')",
        "sentiment": "Általános piaci hangulat ('POSITIVE', 'NEGATIVE', 'NEUTRAL')"
    }

    A 'trends' egy tömb legyen, ami PONTOSAN 1 trend objektumot tartalmaz. Az objektum a fő piaci trendet mutassa be.
    {
        "name": "A fő trend neve (pl. 'Fenntartható termékek iránti kereslet')",
        "dataPoints": [
            // Generálj 6-8 adatpontot az elmúlt hónapokra. A 'value' egy 0-100 közötti érdeklődési index.
            { "month": "Jan", "value": 65 }, { "month": "Feb", "value": 70 }, { "month": "Már", "value": 68 }, { "month": "Ápr", "value": 75 }, { "month": "Máj", "value": 80 }, { "month": "Jún", "value": 82 }
        ]
    }

    A 'personas' egy tömb legyen, ami PONTOSAN 2 vásárlói perszónát tartalmaz. Legyenek részletesek és realisztikusak.
    [
        { "name": "Fenntartható Fanni", "age": 28, "occupation": "Marketing menedzser", "bio": "Fanni Budapesten él, fontos számára a környezetvédelem, és aktívan keresi a fenntartható alternatívákat a mindennapokban.", "motivations": ["Környezettudatosság", "Minőségi termékek", "Etikus márkák támogatása"], "frustrations": ["Greenwashing", "Nehezen elérhető megbízható információk"], "communicationChannels": ["Instagram", "Fenntartható divat blogok", "Facebook csoportok"], "quote": "Hiszem, hogy a kis lépések is számítanak a bolygónk megóvásában." },
        { "name": "Tudatos Tamás", "age": 35, "occupation": "IT projektmenedzser", "bio": "Tamás egy vidéki városban él családjával. Elfoglalt, de szeretne egészségesebb és tudatosabb életet élni. Az online vásárlást preferálja.", "motivations": ["Egészség", "Időmegtakarítás", "Praktikus megoldások"], "frustrations": ["Túlárazott termékek", "Időhiány a kutatásra"], "communicationChannels": ["Tech weboldalak", "YouTube tesztek", "Hírlevelek"], "quote": "A minőség és a kényelem a legfontosabb számomra, de nem mindegy, milyen áron." }
    ]

    A 'regions' egy tömb legyen, ami 3-5 régiót tartalmaz a megadott földrajzi fókusz alapján. Ha a fókusz 'Magyarország', akkor magyarországi régiókat vagy megyéket listázz. Az 'intensity' egy 0-100 közötti szám, ami a piaci érdeklődés intenzitását jelöli.
    [
        { "name": "Budapest", "intensity": 95 }, { "name": "Nyugat-Dunántúl", "intensity": 78 }, { "name": "Észak-Magyarország", "intensity": 65 }, { "name": "Dél-Alföld", "intensity": 72 }
    ]

    A 'keywords' egy tömb legyen, ami 5-7 releváns, magyar nyelvű kulcsszót tartalmaz.
    ["környezetbarát", "fenntarthatóság", "vegán termékek", "kézműves szappan", "öko háztartás"]

    A 'contentSuggestions' egy tömb legyen, ami 3-5 rövid, egy-két szavas, magyar nyelvű tartalomötletet tartalmaz.
    ["Újrahasznosítási tippek", "DIY öko tisztítószer", "Top 5 fenntartható márka", "Hogyan csökkentsd a lábnyomod"]
`;

const generateWebsitePrompt = (url: string, geographicalFocus: string): string => {
  let prompt = `Készíts részletes, magyar nyelvű piackutatási elemzést a következő weboldal alapján: "${url}".\n\n`;

  if (geographicalFocus) {
    prompt += `Az elemzés földrajzi fókusza a következő legyen: "${geographicalFocus}".\n`;
  }
  
  prompt += `
    Az elemzést a weboldal tartalma és az interneten elérhető, naprakész adatok alapján végezd el, a Google Search eszköz segítségével. A cél a weboldal és a mögötte álló vállalkozás piaci helyzetének felmérése.
    ${getBasePromptStructure()}

    Az 'analysisText' résznek a következőket kell tartalmaznia, Markdown-szerű formázással:
    ### Célközönség és Kommunikáció
    - A weboldal tartalma alapján kik a fő célcsoportok? Milyen a kommunikációs stílusa?
    ### SEO és Tartalmi Elemzés
    - Melyek a legfontosabb kulcsszavak? Milyen típusú tartalmak találhatók az oldalon?
    ### Piaci Pozíció és Értékajánlat
    - Mi a fő termék vagy szolgáltatás? Mi az egyedi értékajánlata (UVP)?
    ### Felhasználói Élmény és Fejlesztési Javaslatok
    - Milyen az általános felhasználói élmény (UX)? Javaslatok a fejlesztésére.

    A 'swotAnalysis' rész a WEBOLDALRA/VÁLLALKOZÁSRA vonatkozzon.
  `;
  return prompt;
};

const generateKeywordPrompt = (keywords: string, geographicalFocus: string): string => {
  let prompt = `Készíts részletes, magyar nyelvű piackutatási elemzést a következő kulcsszavak/témakör alapján: "${keywords}".\n\n`;

  if (geographicalFocus) {
    prompt += `Az elemzés földrajzi fókusza a következő legyen: "${geographicalFocus}".\n`;
  }
  
  prompt += `
    Az elemzést az interneten elérhető, naprakész adatok alapján végezd el, a Google Search eszköz segítségével. A cél egy átfogó piaci kép kialakítása a megadott téma köré.
    ${getBasePromptStructure()}

    Az 'analysisText' résznek a következőket kell tartalmaznia, Markdown-szerű formázással:
    ### Célpiac és Demográfia
    - Kik a fő fogyasztói szegmensek? Demográfiai adatok, online viselkedés.
    ### Piaci Trendek és Jövőkép
    - Jelenlegi kulcsfontosságú trendek, feltörekvő technológiák, várható jövőbeli fejlemények.
    ### Fő Szereplők és Versenytársak
    - Röviden foglald össze a piac főbb szereplőit.
    ### Piaci Lehetőségek
    - Milyen kiaknázatlan rések vagy igények vannak a piacon? Javaslatok belépési pontokra.

    A 'swotAnalysis' a TÉMÁRA/PIACRA vonatkozzon, ne egy konkrét termékre.
  `;
  return prompt;
};

const generatePrompt = (productDescription: string, industry: string, geographicalFocus: string): string => {
  let prompt = `Készíts részletes, magyar nyelvű piackutatási elemzést a következő termékre/szolgáltatásra: "${productDescription}".\n\n`;

  if (industry) {
    prompt += `Az elemzés fókuszában a következő iparág álljon: "${industry}".\n`;
  }
  if (geographicalFocus) {
    prompt += `Az elemzés földrajzi fókusza a következő legyen: "${geographicalFocus}".\n`;
  }
  
  prompt += `
    ${getBasePromptStructure()}

    Az 'analysisText' résznek a következőket kell tartalmaznia, Markdown-szerű formázással:
    ### Célpiac Elemzése
    - Demográfiai, pszichográfiai és földrajzi jellemzők, vásárlási szokások.
    ### Piaci Trendek és Jövőkép
    - Jelenlegi trendek, technológiai újítások és jövőbeli kilátások az iparágban.
    ### Rövid Versenytárs Összefoglaló
    - Röviden foglald össze a fő versenytársakat.
    ### Pozicionálási Javaslatok
    - Javasolt egyedi értékajánlat (UVP), kulcsüzenetek és marketingcsatornák.

    A 'swotAnalysis' a TE termékedre/szolgáltatásodra vonatkozzon.
  `;
  return prompt;
};

const robustJsonParse = <T,>(text: string, expectArray: boolean = false): T => {
    let jsonString = text.trim();

    // 1. Extract from markdown if present
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1].trim();
    } else {
        // 2. Fallback to extracting content between first and last bracket/brace
        const firstChar = expectArray ? '[' : '{';
        const lastChar = expectArray ? ']' : '}';
        const firstIndex = jsonString.indexOf(firstChar);
        const lastIndex = jsonString.lastIndexOf(lastChar);

        if (firstIndex !== -1 && lastIndex > firstIndex) {
            jsonString = jsonString.substring(firstIndex, lastIndex + 1);
        }
    }
    
    // 3. Sanitize common errors like trailing commas
    const sanitizedString = jsonString.replace(/,(?=\s*[}\]])/g, '');

    return JSON.parse(sanitizedString) as T;
}

export const getMarketAnalysis = async (
    params: { type: 'product', description: string, industry: string, geo: string } | { type: 'topic', keywords: string, geo: string } | { type: 'website', url: string, geo: string }
): Promise<AnalysisResult> => {
  try {
    let prompt;
    switch (params.type) {
        case 'product':
            prompt = generatePrompt(params.description, params.industry, params.geo);
            break;
        case 'topic':
            prompt = generateKeywordPrompt(params.keywords, params.geo);
            break;
        case 'website':
            prompt = generateWebsitePrompt(params.url, params.geo);
            break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedResponse = robustJsonParse<AnalysisResult>(response.text);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    const sources: Source[] = groundingChunks
      ? groundingChunks.map((chunk: any) => ({
          uri: chunk.web.uri,
          title: chunk.web.title,
        })).filter((source: Source) => source.uri && source.title)
      : [];
      
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());


    if (!parsedResponse.analysisText || !parsedResponse.swotAnalysis || !parsedResponse.marketOverview || !parsedResponse.personas) {
        throw new Error("Nem sikerült teljes körű elemzést generálni. Próbálja újra egy részletesebb leírással.");
    }

    return { ...parsedResponse, sources: uniqueSources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("JSON") || error instanceof SyntaxError) {
            throw new Error("Az AI válasza a piacelemzésre nem volt a megfelelő formátumban. Kérjük, próbálja újra!");
        }
        throw new Error(`Hiba történt az API hívás során: ${error.message}`);
    }
    throw new Error("Ismeretlen hiba történt a piackutatás során.");
  }
};


export const generateBusinessPlans = async (
    userInput: string,
    analysisType: 'product' | 'topic' | 'website',
    analysisResult: AnalysisResult,
    template: BusinessPlanTemplate
): Promise<BusinessPlan[]> => {

    const taskDescription = analysisType === 'product' ? 
        'készíts három különböző, részletes, magyar nyelvű üzleti terv javaslatot a következő termékhez/szolgáltatáshoz és a róla készült piackutatási elemzéshez.' :
        'készíts három különböző, részletes, magyar nyelvű üzleti ötletet és a hozzájuk tartozó vázlatos üzleti tervet a megadott téma/weboldal és piackutatási elemzés alapján. Az ötletek legyenek konkrét termékek vagy szolgáltatások, amelyek a témához kapcsolódnak.';
        
    const templateInstructions: Record<BusinessPlanTemplate, string> = {
        DEFAULT: 'Generálj egy JSON tömböt, amely pontosan 3 üzleti terv objektumot tartalmaz. A három terv legyen stratégiailag eltérő: egy "Lean Start-up" / költséghatékony, egy "Növekedés-orientált" / agresszív, és egy "Prémium / Minőség-fókuszú" / kiegyensúlyozott.',
        LEAN_STARTUP: 'Generálj egy JSON tömböt, amely pontosan 3, egymástól eltérő üzleti terv variációt tartalmaz, mindegyik a "Lean Startup" / költséghatékony megközelítésen alapulva. Fókuszáljanak a minimális életképes termékre (MVP), a gyors iterációra és a validált tanulásra.',
        GROWTH: 'Generálj egy JSON tömböt, amely pontosan 3, egymástól eltérő üzleti terv variációt tartalmaz, mindegyik az agresszív, "Növekedés-orientált" stratégiára épülve. Koncentráljanak a piacrészesedés gyors megszerzésére, a skálázhatóságra és a befektetők bevonására.',
        PREMIUM: 'Generálj egy JSON tömböt, amely pontosan 3, egymástól eltérő üzleti terv variációt tartalmaz, mindegyik a "Prémium / Minőség-fókuszú" stratégiára épülve. Az ötletek helyezzék a hangsúlyt a kiemelkedő minőségre, az exkluzivitásra és az erős márkaépítésre.'
    };

    const generationInstruction = templateInstructions[template] || templateInstructions.DEFAULT;


    const prompt = `
        Tapasztalt üzleti tanácsadóként ${taskDescription}

        **Alapinformációk (felhasználói input):**
        - "${userInput}"

        **Piackutatási Elemzés (Kontextus):**
        ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        ${generationInstruction} Minden tervnek a megadott piackutatási elemzésen kell alapulnia. Használd a SWOT-ot a kockázatokhoz, a perszónákat a marketinghez.
        Minden tervhez vázolj fel 1-2 releváns finanszírozási lehetőséget, figyelembe véve a terv stratégiáját (pl. egy lean start-up tervhez a bootstrap, egy növekedési tervhez a befektetők bevonása). Minden opciónak legyenek előnyei és hátrányai.


        **A JSON struktúra minden üzleti terv objektumra:**
        {
          "title": "A terv megnevezése (pl. 'Költséghatékony Indulás')",
          "strategyFocus": "A stratégia központi gondolata egy mondatban (pl. 'Gyors piacra lépés minimális kezdeti befektetéssel, a közösségi médiára és a korai felhasználók visszajelzéseire fókuszálva.')",
          "executiveSummary": "Rövid, 2-3 mondatos vezetői összefoglaló a tervről.",
          "marketingStrategy": [
            "Legalább 3 konkrét, a célpiacra és a stratégiára szabott marketing javaslat (stringek egy tömbben)."
          ],
          "financialPlan": {
            "initialInvestment": [
              { "item": "Kezdeti befektetés tétel (pl. 'Weboldal fejlesztés')", "cost": "Becsült költség (pl. '250.000 HUF')" }
            ],
            "monthlyOperationalCosts": [
              { "item": "Havi működési költség tétel (pl. 'Marketing hirdetések')", "cost": "Becsült havi költség (pl. '80.000 HUF/hó')" }
            ],
            "revenueProjections": [
              { "item": "Bevételi előrejelzés tétel (pl. 'Havi 15 eladás, 10.000 HUF profittal')", "cost": "Becsült havi bevétel (pl. '150.000 HUF/hó')" }
            ]
          },
          "riskAssessment": [
            "Legalább 2, az adott stratégiára jellemző kockázati tényező és enyhítési javaslat (stringek egy tömbben)."
          ],
          "fundingOptions": [
            {
              "type": "Finanszírozási forma (pl. 'Bootstrap (önfinanszírozás)')",
              "advantages": ["Az előny leírása (string)", "Másik előny (string)"],
              "disadvantages": ["A hátrány leírása (string)", "Másik hátrány (string)"]
            }
          ]
        }

        A válasz kizárólag a JSON tömb legyen, mindenféle extra szöveg vagy Markdown formázás nélkül. Ügyeljen a helyes JSON szintaxisra, ne használjon záró vesszőket a tömbökben vagy objektumokban.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsedPlans = robustJsonParse<Omit<BusinessPlan, 'id'>[]>(response.text, true);

        if (!Array.isArray(parsedPlans) || parsedPlans.length === 0) {
            throw new Error("A generált üzleti tervek formátuma nem megfelelő.");
        }
        
        return parsedPlans.map((plan, index) => ({
            ...plan,
            id: `plan-${Date.now()}-${index}`
        }));

    } catch (error) {
        console.error("Error generating business plans:", error);
        if (error instanceof Error && (error.message.includes("JSON") || error instanceof SyntaxError)) {
            throw new Error("Az AI válasza az üzleti tervekre nem volt a megfelelő formátumban. Próbálja újra!");
        }
        throw new Error("Hiba történt az üzleti tervek generálása során.");
    }
};

export const generateMarketEntryProcess = async (
    params: { type: 'product', productDescription: string, analysisResult: AnalysisResult, businessPlans: BusinessPlan[] | null } | { type: 'topic', keywords: string, analysisResult: AnalysisResult, businessPlans: BusinessPlan[] | null }
): Promise<MarketEntryProcess> => {
    const baseInfo = params.type === 'product' ? `
        **Alapinformációk:**
        - Termék/Szolgáltatás: "${params.productDescription}"
    ` : `
        **Alapinformációk:**
        - Téma/Kulcsszavak: "${params.keywords}"
    `;

    const businessPlansContext = params.businessPlans ? `
        **Generált Üzleti Terv Javaslatok (Kontextus):**
        ${JSON.stringify(params.businessPlans, null, 2)}
    ` : '';

    const taskDescription = params.type === 'product' ?
        'készíts egy részletes, magyar nyelvű, lépésről-lépésre haladó piacra lépési folyamatot a következő termékhez/szolgáltatáshoz és a róla készült piackutatási elemzéshez.' :
        'készíts egy általános, magyar nyelvű, lépésről-lépésre haladó piacra lépési folyamatot egy új vállalkozás számára a megadott témakörben, a piackutatási elemzés alapján.';

    const prompt = `
        Tapasztalt piacra lépési stratégaként ${taskDescription} A tervnek figyelembe kell vennie a megadott kontextust, beleértve a piackutatást és a vázolt üzleti terveket.

        ${baseInfo}

        **Piackutatási Elemzés (Kontextus):**
        ${JSON.stringify(params.analysisResult, null, 2)}

        ${businessPlansContext}

        **Feladat:**
        Generálj egy JSON objektumot, amely tartalmaz egy 'strategicOverview' kulcsot és egy 'phases' kulcsot. A terv legyen gyakorlatias, és a megadott elemzésen (és üzleti terveken, ha vannak) alapuljon.
        - 'strategicOverview': Egy rövid, 2-3 mondatos, magas szintű összefoglaló a javasolt piacra lépési stratégiáról. Utalj arra, hogy melyik üzleti terv irányvonalát követi legírább.
        - 'phases': Egy 4-5 fázisból álló tömb, amely a piacra lépési tervet tartalmazza. Minden fázis objektumnak tartalmaznia kell egy címet ('phaseTitle'), egy rövid leírást ('description'), a kulcsfontosságú, végrehajtható lépéseket ('keyActions'), és a fontos megfontolásokat ('considerations').

        **A JSON struktúra:**
        {
          "strategicOverview": "A stratégia összefoglalása...",
          "phases": [
            {
              "phaseTitle": "A fázis címe (pl. '1. Fázis: Tervezés és Előkészületek')",
              "description": "A fázis céljának rövid, 1-2 mondatos leírása.",
              "keyActions": [
                "Legalább 3-5 konkrét, végrehajtható lépés (stringek egy tömbben)."
              ],
              "considerations": [
                "1-3 fontos megfontolás vagy potenciális buktató ebben a fázisban (stringek egy tömbben)."
              ]
            }
          ]
        }

        A válasz kizárólag a JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül. Ügyelj a helyes JSON szintaxisra.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsedProcess = robustJsonParse<MarketEntryProcess>(response.text, false);

        if (!parsedProcess || !Array.isArray(parsedProcess.phases) || parsedProcess.phases.length === 0) {
            throw new Error("A generált piacra lépési folyamat formátuma nem megfelelő.");
        }
        
        return parsedProcess;

    } catch (error) {
        console.error("Error generating market entry process:", error);
        if (error instanceof Error && (error.message.includes("JSON") || error instanceof SyntaxError)) {
            throw new Error("Az AI válasza a piacra lépési folyamatra nem volt a megfelelő formátumban. Próbálja újra!");
        }
        throw new Error("Hiba történt a piacra lépési folyamat generálása során.");
    }
};

export const generateUVP = async (
    params: {
        analysisResult: AnalysisResult;
        productDescription: string;
        analysisType: 'product' | 'topic';
        keywords: string;
    }
): Promise<UVP> => {
    const { analysisResult, productDescription, analysisType, keywords } = params;

    const baseInfo = analysisType === 'product'
        ? `A termék/szolgáltatás: "${productDescription}"`
        : `A téma/kulcsszavak: "${keywords}"`;

    const prompt = `
        Kiváló marketing stratégaként, a megadott piackutatási elemzés alapján készíts egy egyedi értékajánlatot (Unique Value Proposition - UVP).
        Az UVP legyen tömör, meggyőző és a célközönség számára releváns.

        **Kontextus:**
        - ${baseInfo}
        - Piackutatási elemzés: ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot a következő struktúrával. Ne adj hozzá semilyen más szöveget a JSON-on kívül.
        {
          "headline": "Egy figyelemfelkeltő, 5-10 szavas főcím, amely a legfontosabb előnyt emeli ki.",
          "subheadline": "Egy 2-3 mondatos alcím, amely elmagyarázza, mit kínálsz, kinek szól, és miben különbözik a versenytársaktól.",
          "keywords": [
            "3-5 kulcsszó vagy rövid kifejezés, amely összefoglalja az értékajánlat lényegét (pl. 'Környezetbarát', 'Időt takarít meg')."
          ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsedUVP = robustJsonParse<UVP>(response.text, false);

        if (!parsedUVP || !parsedUVP.headline || !parsedUVP.subheadline || !Array.isArray(parsedUVP.keywords)) {
            throw new Error("A generált értékajánlat formátuma nem megfelelő.");
        }
        
        return parsedUVP;

    } catch (error) {
        console.error("Error generating UVP:", error);
        if (error instanceof Error && (error.message.includes("JSON") || error instanceof SyntaxError)) {
            throw new Error("Az AI válasza az értékajánlatra nem volt a megfelelő formátumban. Próbálja újra!");
        }
        throw new Error("Hiba történt az értékajánlat generálása során.");
    }
};

export const generateAnalysisSummary = async (
    params: {
        analysisResult: AnalysisResult;
        userInput: string;
    }
): Promise<AnalysisSummary> => {
    const { analysisResult, userInput } = params;

    const prompt = `
        Tapasztalt üzleti elemzőként, az alábbi piackutatási elemzés és az eredeti felhasználói kérés alapján készíts egy rendkívül tömör, vezetői szintű összefoglalót. A cél, hogy a felhasználó 15 másodperc alatt megértse a legfontosabb tanulságokat.

        **Eredeti felhasználói kérés (kontextus):**
        "${userInput}"

        **Részletes Piackutatási Elemzés (adatforrás):**
        ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot a következő struktúrával. A válaszod kizárólag a JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        {
          "mainTakeaway": "Egyetlen, erőteljes mondat, ami összefoglalja a piaci helyzetet vagy a legfontosabb tanulságot.",
          "topCompetitorToWatch": {
            "name": "A legfontosabb versenytárs neve. Ha nincs, írd, hogy 'Nincs kiemelt versenytárs'.",
            "reason": "Egy rövid, 10-15 szavas indoklás, hogy miért kell rá figyelni (pl. 'agresszív marketingje és innovatív termékei miatt')."
          },
          "biggestOpportunity": "A SWOT elemzésből vagy a piaci résekből azonosított legjelentőbb lehetőség, egy rövid mondatban megfogalmazva."
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const summary = robustJsonParse<AnalysisSummary>(response.text);

        if (!summary || !summary.mainTakeaway || !summary.topCompetitorToWatch || !summary.biggestOpportunity) {
            throw new Error("A generált összefoglaló formátuma nem megfelelő.");
        }
        
        return summary;

    } catch (error) {
        console.error("Error generating analysis summary:", error);
        if (error instanceof Error && (error.message.includes("JSON") || error instanceof SyntaxError)) {
            throw new Error("Az AI válasza az összefoglalóra nem volt a megfelelő formátumban. Próbálja újra!");
        }
        throw new Error("Hiba történt az elemzés összefoglalása során.");
    }
};

export const summarizeChatForAnalysis = async (
    messages: ChatMessage[]
): Promise<{ productDescription: string; industry: string; geographicalFocus: string; }> => {
    const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'Felhasználó' : 'Mentor'}: ${msg.text}`)
        .join('\n');

    const prompt = `
        A következő beszélgetés alapján foglald össze a felhasználó üzleti ötletét.
        A válaszod egy JSON objektum legyen, ami a következő kulcsokat tartalmazza: 'productDescription', 'industry', és 'geographicalFocus'.
        - 'productDescription': Az ötlet részletes, 2-3 mondatos leírása.
        - 'industry': A releváns iparág. Ha nincs explicit említve, következtess a leírásból.
        - 'geographicalFocus': A földrajzi fókusz (pl. 'Magyarország', 'Budapest'). Ha nincs említve, az értéke legyen 'Magyarország'.
        
        Ne adj hozzá semilyen más szöveget a JSON-on kívül, beleértve a Markdown formázást is.

        Beszélgetés:
        ---
        ${conversationHistory}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        productDescription: { type: Type.STRING },
                        industry: { type: Type.STRING },
                        geographicalFocus: { type: Type.STRING },
                    },
                    required: ["productDescription", "industry", "geographicalFocus"],
                }
            },
        });

        const summary = robustJsonParse<{ productDescription: string; industry: string; geographicalFocus: string; }>(response.text);
        
        if (!summary.productDescription) {
            throw new Error("Nem sikerült azonosítani a termékleírást a beszélgetésből.");
        }
        
        return summary;
    } catch (error) {
        console.error("Error summarizing chat for analysis:", error);
        throw new Error("Hiba történt a beszélgetés összegzése során.");
    }
};

export const createMentorChatSession = (): Chat => {
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `
                Ön egy támogató és bátorító üzleti mentor. A felhasználó egy ötlettel fog előállni. Az Ön feladata, hogy segítse őket az ötlet kidolgozásában és finomításában.
                - Ne adjon közvetlen tanácsot vagy véleményt (pl. "ez egy jó ötlet" vagy "ez nem fog működni").
                - Ehelyett tegyen fel nyílt végű, elgondolkodtató kérdéseket, amelyek segítik a felhasználót, hogy maga jöjjön rá a válaszokra.
                - Fókuszáljon a következő területekre: problémamegoldás, célközönség, egyedi értékajánlat (UVP), bevételi modell, versenytársak és a következő lépések.
                - Legyen barátságos, türelmes és biztató a hangneme. Használjon rövid, könnyen érthető mondatokat.
                - Kezdje a beszélgetést egy üdvözlő üzenettel, amelyben bemutatkozik, és megkérdezi a felhasználót, hogy miben segíthet. Például: "Szia! Én az Ötlet Mentor vagyok. Milyen ötleten gondolkodsz ma?"
                
                SPECIÁLIS UTASÍTÁS:
                Ha egy üzenetet kap, amely a következővel kezdődik: "[PIACKUTATÁS EREDMÉNYE]:", az egy JSON objektumot tartalmaz egy automatikus piackutatás eredményeivel.
                Az Ön feladata, hogy ezt az adatot értelmezze, és a legfontosabb tanulságokat összefoglalja a felhasználónak egy barátságos, közérthető és bátorító üzenetben.
                A válaszában térjen ki a következőkre:
                1.  **Összefoglalás:** Adjon egy rövid, 1-2 mondatos pozitív hangvételű összefoglalót az eredményekről.
                2.  **Célpiac:** Emelje ki a legfontosabb tudnivalókat a célpiacról.
                3.  **Versenytársak:** Nevezzen meg 1-2 fő versenytársat és a legfontosabb erősségüket vagy gyengeségüket, ami lehetőség lehet a felhasználó számára.
                4.  **Lehetőség:** A SWOT elemzés alapján emeljen ki egy kulcsfontosságú lehetőséget.
                5.  **Következő lépés:** Zárja a válaszát egy elgondolkodtató kérdéssel, amely arra ösztönzi a felhasználót, hogy az új információk fényében gondolja tovább az ötletét. Például: "Ezeket az információkat látva, hogyan tudnád még egyedibbé tenni az ajánlatodat?" vagy "A versenytársak gyengeségeit látva, miben lehetne a te ötleted jobb?"
            `,
        },
    });
    return chat;
};

export const generateMarketingContent = async (analysisResult: AnalysisResult, userInput: string): Promise<MarketingContent> => {
    const prompt = `
        Tapasztalt marketing szakértőként, a megadott piackutatási elemzés alapján készíts egy csomagot a következő magyar nyelvű marketing anyagokból.
        A stílus legyen profi, de közvetlen, és a célközönség számára releváns.

        **Kontextus:**
        - Eredeti ötlet/termék: "${userInput}"
        - Részletes elemzés: ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot a következő struktúrával. A válaszod kizárólag a JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        MINDEN tartalomhoz (social media poszt, blog vázlat, hirdetési szöveg) generálj egy rövid, leíró, ANGOL NYELVŰ "imagePrompt"-ot. Ez a prompt egy kép generáló AI számára készül, tehát vizuálisan gazdagnak és konkrétnak kell lennie. Például: "A minimalist, eco-friendly bathroom scene with natural light, showcasing artisanal vegan soap bars on a wooden tray, with green leaves in the background, clean aesthetic."

        {
          "socialMediaPosts": [
            {
              "platform": "Facebook",
              "content": "1. Facebook poszt: Figyelemfelkeltő, egy problémával indít és bemutatja a megoldást. Használj emojikat.",
              "hashtags": ["releváns", "hashtag", "lista"],
              "imagePrompt": "1. ANGOL NYELVŰ, vizuálisan leíró prompt az 1. Facebook poszthoz."
            },
            {
              "platform": "Facebook",
              "content": "2. Facebook poszt: Edukatív jellegű, hasznos tippet vagy információt oszt meg a témával kapcsolatban.",
              "hashtags": ["tudás", "tippek", "hashtag"],
              "imagePrompt": "2. ANGOL NYELVŰ, vizuálisan leíró prompt egy edukatív Facebook poszthoz."
            },
            {
              "platform": "Facebook",
              "content": "3. Facebook poszt: Közösségépítő, egy kérdést tesz fel a követőknek, párbeszédet kezdeményez.",
              "hashtags": ["kérdés", "közösség", "hashtag"],
              "imagePrompt": "3. ANGOL NYELVŰ, vizuálisan leíró prompt egy közösségi Facebook poszthoz."
            },
            {
              "platform": "Instagram",
              "content": "1. Instagram poszt: Rövid, inspiráló szöveg, ami egy történetet mesél el vagy egy érzést közvetít.",
              "hashtags": ["inspiráció", "vizuális", "hashtag"],
              "imagePrompt": "1. ANGOL NYELVŰ, vizuálisan leíró prompt egy esztétikus Instagram poszthoz."
            },
            {
              "platform": "Instagram",
              "content": "2. Instagram poszt: 'Kulisszák mögötti' (behind-the-scenes) jellegű, bemutatja a termék készítését vagy egy érdekességet.",
              "hashtags": ["kulisszák_mögött", "így_készül", "hashtag"],
              "imagePrompt": "2. ANGOL NYELVŰ, vizuálisan leíró 'behind-the-scenes' prompt Instagramhoz."
            },
            {
              "platform": "Instagram",
              "content": "3. Instagram poszt: Felhasználói tartalomra (UGC) ösztönző, felhívással, hogy a követők osszák meg saját tapasztalataikat.",
              "hashtags": ["ugc", "mutasd_meg", "hashtag"],
              "imagePrompt": "3. ANGOL NYELVŰ, vizuálisan leíró prompt egy felhasználói tartalomra ösztönző Instagram poszthoz."
            }
          ],
          "blogPostOutline": {
            "title": "Egy SEO-barát, kattintásra ösztönző blogbejegyzés cím.",
            "introduction": "Egy rövid bevezető, ami felkelti az olvasó érdeklődését és vázolja a problémát.",
            "sections": [
              { "title": "Első szekció címe", "points": ["Főbb pont 1", "Főbb pont 2"] },
              { "title": "Második szekció címe", "points": ["Főbb pont 1", "Főbb pont 2"] },
              { "title": "Harmadik szekció címe", "points": ["Főbb pont 1", "Főbb pont 2"] }
            ],
            "conclusion": "Egy összefoglaló, ami cselekvésre ösztönöz (Call to Action).",
            "seoKeywords": "Egy 5-7 kulcsszóból álló tömb. A kulcsszavakat a megadott elemzés 'analysisText' és 'keywords' mezőiből merítsd a legjobb SEO eredmény érdekében.",
            "imagePrompt": "Egy ANGOL NYELVŰ, vizuálisan leíró prompt egy blog fejléc képhez."
          },
          "adCopies": [
            {
              "platform": "Google Ads",
              "headline": "Egy ütős, 30 karakteres főcím.",
              "description": "Egy 90 karakteres leírás, ami kiemeli a legfontosabb előnyöket.",
              "imagePrompt": "Egy ANGOL NYELVŰ, vizuálisan leíró prompt egy Google Display hirdetéshez."
            },
            {
              "platform": "Facebook Ads",
              "headline": "Egy figyelemfelkeltő főcím, ami a célközönség érzelmeire hat.",
              "description": "Egy rövid leírás, ami egyértelműen kommunikálja az ajánlatot és cselekvésre ösztönöz.",
              "imagePrompt": "Egy ANGOL NYELVŰ, vizuálisan leíró prompt egy figyelemfelkeltő Facebook hirdetés képéhez."
            }
          ]
        }
        FONTOS: A "socialMediaPosts" tömbnek PONTOSAN 6 bejegyzést kell tartalmaznia (3 Facebook, 3 Instagram). Az "adCopies" tömbnek PONTOSAN 2 bejegyzést kell tartalmaznia.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const content = robustJsonParse<MarketingContent>(response.text);
        if (
            !content.socialMediaPosts || !Array.isArray(content.socialMediaPosts) || content.socialMediaPosts.length < 6 ||
            !content.blogPostOutline || !content.blogPostOutline.title ||
            !content.adCopies || !Array.isArray(content.adCopies) || content.adCopies.length < 2
        ) {
            throw new Error("A generált marketing tartalom hiányos vagy formátuma nem megfelelő. Kérjük, próbálja újra!");
        }
        return content;
    } catch (error) {
        console.error("Error generating marketing content:", error);
        throw new Error("Hiba történt a marketing tartalmak generálása során.");
    }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Nem sikerült képet generálni.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Hiba történt a kép generálása során.");
    }
};

export const generateBuyerPersona = async (analysisResult: AnalysisResult, userInput: string): Promise<BuyerPersona> => {
    const prompt = `
        Tapasztalt piackutatóként és UX szakértőként, a megadott piackutatási elemzés alapján készíts egy részletes, magyar nyelvű vásárlói perszónát (buyer persona).
        A perszóna legyen realisztikus, kézzelfogható, és segítsen a marketingeseknek megérteni a célközönséget.

        **Kontextus:**
        - Eredeti ötlet/termék: "${userInput}"
        - Részletes elemzés (fókuszálj a 'Célpiac' szekcióra): ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot a következő struktúrával. A válaszod kizárólag a JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        {
          "name": "Egy jellemző, magyar hangzású név (pl. 'Fenntartható Fanni', 'Technológus Tamás').",
          "age": "Egy realisztikus életkor (szám).",
          "occupation": "A perszóna foglalkozása.",
          "bio": "Egy 3-4 mondatos leírás a perszóna életéről, hátteréről és mindennapjairól.",
          "motivations": [
            "3-4 pont, ami motiválja őt a mindennapokban vagy a vásárlás során (pl. 'Szeretné csökkenteni az ökológiai lábnyomát')."
          ],
          "frustrations": [
            "3-4 pont, ami frusztrálja, vagy milyen problémákkal küzd, amire a termék megoldást nyújthat (pl. 'Nehezen talál megbízható, fenntartható termékeket')."
          ],
          "communicationChannels": [
            "3-4 csatorna, ahol legszívesebben tájékozódik vagy kommunikál (pl. 'Instagram inspirációs oldalak', 'Szakmai blogok', 'Facebook csoportok')."
          ],
          "quote": "Egy rövid, 1 mondatos idézet, ami összefoglalja a perszóna gondolkodásmódját."
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const persona = robustJsonParse<BuyerPersona>(response.text);
        if (!persona.name || !persona.age || !persona.bio) {
             throw new Error("A generált vásárlói perszóna formátuma nem megfelelő.");
        }
        return persona;
    } catch (error) {
        console.error("Error generating buyer persona:", error);
        throw new Error("Hiba történt a vásárlói perszóna generálása során.");
    }
};

export const generateMarketingStrategy = async (
    product: string,
    audience: string,
    goal: string,
    budget: string
): Promise<MarketingStrategy> => {
    const prompt = `
        Tapasztalt marketing stratégaként, készíts egy átfogó, magyar nyelvű digitális marketing stratégiát a megadott adatok alapján.
        A válaszod egy JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        **Felhasználói adatok:**
        - Termék/Szolgáltatás: "${product}"
        - Célközönség: "${audience}"
        - Fő marketing cél: "${goal}"
        - Hozzávetőleges költségkeret: "${budget}"

        **A JSON struktúra a következő legyen:**
        {
          "strategicOverview": "Egy rövid, 2-3 mondatos, magas szintű összefoglaló a javasolt stratégiáról, amely figyelembe veszi a célt és a költségkeretet.",
          "suggestedChannels": [
            {
              "name": "Javasolt csatorna neve (pl. 'Tartalommarketing és SEO')",
              "description": "Rövid indoklás, miért releváns ez a csatorna a megadott termékhez és célközönséghez.",
              "platforms": ["Konkrét platformok vagy eszközök (pl. 'Céges blog', 'Google Search Console', 'YouTube')"]
            }
          ],
          "coreMessaging": {
            "mainMessage": "A központi marketingüzenet, amely megszólítja a célközönséget és kiemeli a termék értékét.",
            "taglines": [
              "2-3 fülbemászó, rövid szlogen vagy tagline."
            ]
          },
          "campaignIdeas": [
            {
              "name": "Kreatív kampányötlet címe (pl. 'Indulási Influencer Kampány')",
              "description": "A kampányötlet rövid, 1-2 mondatos leírása, amely illeszkedik a stratégiához."
            }
          ],
          "keyPerformanceIndicators": [
            "3-5 konkrét, mérhető KPI (kulcsfontosságú teljesítménymutató) a stratégia sikerességének mérésére (pl. 'Havi 20%-os organikus forgalomnövekedés', 'Heti 50 új hírlevél feliratkozó')."
          ],
          "marketingCalendar": [
            {
              "day": "A nap megnevezése (pl. 'Hétfő', 'Szerda', 'Péntek')",
              "time": "Javasolt időpont (pl. '09:00 - 10:00', '18:00')",
              "activity": "A konkrét marketing tevékenység (pl. 'Új Instagram poszt közzététele')",
              "platform": "Az érintett platform (pl. 'Instagram')",
              "notes": "Rövid megjegyzés vagy tipp (pl. 'Fókusz a vizuális tartalomra, használj releváns hashtageket.')"
            }
          ]
        }
        
        A stratégiának gyakorlatiasnak, relevánsnak és a megadott költségkerettel megvalósíthatónak kell lennie. Generálj legalább 3 marketing csatornát, 2 kampányötletet és egy részletes, legalább 5-7 bejegyzést tartalmazó heti marketing naptárat. A naptárban javasolt időpontok legyenek összhangban a megadott célközönséggel (pl. diákoknak délután, irodai dolgozóknak ebédszünetben vagy munka után).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const strategy = robustJsonParse<MarketingStrategy>(response.text);
        if (!strategy.strategicOverview || !strategy.suggestedChannels || !strategy.coreMessaging || !strategy.marketingCalendar) {
            throw new Error("A generált marketing stratégia formátuma nem megfelelő.");
        }
        return strategy;
    } catch (error) {
        console.error("Error generating marketing strategy:", error);
        throw new Error("Hiba történt a marketing stratégia generálása során.");
    }
};

export const generateSimpleBusinessPlan = async (analysisResult: AnalysisResult, userInput: string): Promise<BusinessPlan> => {
    const prompt = `
        Tapasztalt üzleti tanácsadóként, a megadott piackutatási elemzés és a felhasználói input alapján készíts egy rövid, 3 fő részből álló üzleti terv vázlatot.
        A vázlat legyen tömör, gyakorlatias és közvetlenül kapcsolódjon az elemzés legfontosabb megállapításaihoz.

        **Felhasználói Input (Kontextus):**
        "${userInput}"

        **Piackutatási Elemzés (Adatforrás):**
        ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot, amely egyetlen üzleti tervet tartalmaz. A válaszod kizárólag a JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        **A JSON struktúra:**
        {
          "title": "A terv megnevezése (pl. '${userInput} - Üzleti Terv Vázlat')",
          "strategyFocus": "A stratégia központi gondolata egy mondatban, az elemzésre alapozva.",
          "executiveSummary": "Rövid, 2-3 mondatos vezetői összefoglaló a tervről.",
          "marketingStrategy": [
            "3-4 konkrét, a célpiacra és a versenytársakra reagáló marketing javaslat."
          ],
          "financialPlan": {
            "initialInvestment": [
              { "item": "Kulcsfontosságú kezdeti befektetési tétel", "cost": "Becsült költség (pl. '250.000 HUF')" }
            ],
            "monthlyOperationalCosts": [
              { "item": "Legfontosabb havi működési költség", "cost": "Becsült havi költség (pl. '80.000 HUF/hó')" }
            ],
            "revenueProjections": [
              { "item": "Egy reális bevételi előrejelzési tétel", "cost": "Becsült havi bevétel (pl. '150.000 HUF/hó')" }
            ]
          },
          "riskAssessment": [
            "2-3 legfontosabb, az elemzésből (különösen a SWOT 'Veszélyek' részéből) levezetett kockázati tényező."
          ],
          "fundingOptions": []
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsedPlan = robustJsonParse<Omit<BusinessPlan, 'id'>>(response.text);

        if (!parsedPlan.title || !parsedPlan.marketingStrategy || !parsedPlan.financialPlan || !parsedPlan.riskAssessment) {
            throw new Error("A generált üzleti terv vázlat formátuma nem megfelelő.");
        }

        return {
            ...parsedPlan,
            id: `simple-plan-${Date.now()}`
        };

    } catch (error) {
        console.error("Error generating simple business plan:", error);
        if (error instanceof Error && (error.message.includes("JSON") || error instanceof SyntaxError)) {
            throw new Error("Az AI válasza az üzleti terv vázlatra nem volt a megfelelő formátumban. Próbálja újra!");
        }
        throw new Error("Hiba történt az üzleti terv vázlat generálása során.");
    }
};

export const generateMarketingStrategyFromAnalysis = async (analysisResult: AnalysisResult, userInput: string): Promise<MarketingStrategy> => {
    const prompt = `
        Tapasztalt marketing stratégaként, készíts egy átfogó, magyar nyelvű digitális marketing stratégiát a megadott piackutatási elemzés alapján.
        A stratégiának gyakorlatiasnak, relevánsnak és az elemzésből levont következtetéseken kell alapulnia.
        A válaszod egy JSON objektum legyen, mindenféle extra szöveg vagy Markdown formázás nélkül.

        **Felhasználói Input (Kontextus):**
        "${userInput}"

        **Piackutatási Elemzés (Adatforrás):**
        ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot a marketing stratégiáról a következő struktúrával.
        - Használd a 'personas' és 'analysisText' részeket a célközönség és az üzenetek meghatározásához.
        - A 'suggestedChannels' legyen releváns a 'personas' 'communicationChannels' mezőjéhez.
        - A 'keyPerformanceIndicators' legyen konkrét és mérhető.
        - A 'marketingCalendar' legyen egy realisztikus heti ütemterv, legalább 5-7 bejegyzéssel.

        **A JSON struktúra:**
        {
          "strategicOverview": "Egy rövid, 2-3 mondatos, magas szintű összefoglaló a javasolt stratégiáról, amely az elemzés legfontosabb megállapításaira épül.",
          "suggestedChannels": [
            {
              "name": "Javasolt csatorna neve (pl. 'Tartalommarketing és SEO')",
              "description": "Rövid indoklás, miért releváns ez a csatorna a megadott elemzés alapján.",
              "platforms": ["Konkrét platformok vagy eszközök (pl. 'Céges blog', 'Instagram', 'YouTube')"]
            }
          ],
          "coreMessaging": {
            "mainMessage": "A központi marketingüzenet, amely megszólítja a célközönséget és kiemeli a termék értékét.",
            "taglines": [
              "2-3 fülbemászó, rövid szlogen vagy tagline."
            ]
          },
          "campaignIdeas": [
            {
              "name": "Kreatív kampányötlet címe (pl. 'Indulási Influencer Kampány')",
              "description": "A kampányötlet rövid, 1-2 mondatos leírása, amely illeszkedik a stratégiához."
            }
          ],
          "keyPerformanceIndicators": [
            "3-5 konkrét, mérhető KPI a stratégia sikerességének mérésére (pl. 'Havi 20%-os organikus forgalomnövekedés', 'Heti 50 új hírlevél feliratkozó')."
          ],
          "marketingCalendar": [
            {
              "day": "A nap megnevezése (pl. 'Hétfő', 'Szerda', 'Péntek')",
              "time": "Javasolt időpont (pl. '09:00 - 10:00', '18:00')",
              "activity": "A konkrét marketing tevékenység (pl. 'Új Instagram poszt közzététele')",
              "platform": "Az érintett platform (pl. 'Instagram')",
              "notes": "Rövid megjegyzés vagy tipp (pl. 'Fókusz a vizuális tartalomra, használj releváns hashtageket.')"
            }
          ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const strategy = robustJsonParse<MarketingStrategy>(response.text);
        if (!strategy.strategicOverview || !strategy.suggestedChannels || !strategy.coreMessaging || !strategy.marketingCalendar) {
            throw new Error("A generált marketing stratégia formátuma nem megfelelő.");
        }
        return strategy;
    } catch (error) {
        console.error("Error generating marketing strategy from analysis:", error);
        throw new Error("Hiba történt a marketing stratégia generálása során.");
    }
};

export const generateBrandIdentity = async (analysisResult: AnalysisResult, userInput: string): Promise<BrandIdentity> => {
    const prompt = `
        Tapasztalt márka- és vizuális tervezőként, a megadott piackutatási elemzés alapján készíts egy lehetséges vállalati arculatot.
        Az arculatnak tükröznie kell a termék jellegét, a célközönség stílusát és a piaci pozicionálást.

        **Kontextus:**
        - Eredeti ötlet/termék: "${userInput}"
        - Részletes elemzés (fókuszálj a perszónákra, kulcsszavakra és a piaci hangulatra): ${JSON.stringify(analysisResult, null, 2)}

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
              "url": "A Google Fonts URL-je"
            },
            "bodyFont": {
              "name": "Szövegtörzs betűtípus neve (pl. 'Lato')",
              "url": "A Google Fonts URL-je"
            }
          },
          "moodBoardDescription": "Egy 3-4 mondatos leírás a javasolt vizuális hangulatról. Térj ki a stílusra (pl. minimál, rusztikus, modern), a képi világra (pl. természetes fények, élénk színek, pasztell árnyalatok) és az általános érzésre (pl. professzionális, barátságos, luxus)."
        }

        A színpalettának harmonikusnak kell lennie, tartalmaznia kell egy vagy két fő színt, kiegészítő színeket, és semleges árnyalatokat.
        A betűtípus párosítás legyen olvasható és esztétikus. Csak Google Fonts betűtípusokat használj.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const identity = robustJsonParse<BrandIdentity>(response.text);
        if (!identity.colorPalette || identity.colorPalette.length < 6 || !identity.fontPairing || !identity.moodBoardDescription) {
            throw new Error("A generált arculat formátuma nem megfelelő.");
        }
        return identity;
    } catch (error) {
        console.error("Error generating brand identity:", error);
        throw new Error("Hiba történt a vizuális arculat generálása során.");
    }
};

export const generateProductNames = async (analysisResult: AnalysisResult, userInput: string): Promise<ProductNameSuggestions> => {
    const prompt = `
        Kreatív marketing és branding szakértőként, a megadott piackutatási elemzés és termékleírás alapján generálj 10-15 magyar nyelvű termék- vagy márkanév javaslatot.

        **Kontextus:**
        - Eredeti ötlet/termék: "${userInput}"
        - Részletes elemzés (fókuszálj a kulcsszavakra, perszónákra és a piaci hangulatra): ${JSON.stringify(analysisResult, null, 2)}

        **Feladat:**
        Generálj egy JSON objektumot, amelynek kulcsai a név kategóriái, értékei pedig a névjavaslatokat tartalmazó tömbök. A válaszod kizárólag a JSON objektum legyen.
        Minden névjavaslat legyen egy objektum, ami tartalmazza a nevet ('name') és egy rövid, egy mondatos indoklást ('reasoning'), hogy miért illik a termékhez.

        **Kategóriák:**
        - DESCRIPTIVE: Leíró, egyértelmű nevek.
        - EVOCATIVE: Hangulatos, érzelmekre ható nevek.
        - MODERN: Modern, trendi, esetleg angolos hangzású nevek.
        - PLAYFUL: Játékos, kreatív nevek.
        - PREMIUM: Prémium, elegáns hangzású nevek.

        **A JSON struktúra:**
        {
          "DESCRIPTIVE": [
            { "name": "Példa Leíró Név", "reasoning": "Röviden megindokolva, miért jó ez a név." }
          ],
          "EVOCATIVE": [
            { "name": "Példa Hangulatos Név", "reasoning": "Röviden megindokolva, miért jó ez a név." }
          ],
          "MODERN": [
            { "name": "Példa Modern Név", "reasoning": "Röviden megindokolva, miért jó ez a név." }
          ],
          "PLAYFUL": [
            { "name": "Példa Játékos Név", "reasoning": "Röviden megindokolva, miért jó ez a név." }
          ],
          "PREMIUM": [
            { "name": "Példa Prémium Név", "reasoning": "Röviden megindokolva, miért jó ez a név." }
          ]
        }

        Minden kategóriába legalább 2-3 nevet tegyél.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const names = robustJsonParse<ProductNameSuggestions>(response.text);
        if (!names.DESCRIPTIVE || !names.EVOCATIVE) { // Quick check
            throw new Error("A generált névjavaslatok formátuma nem megfelelő.");
        }
        return names;
    } catch (error) {
        console.error("Error generating product names:", error);
        throw new Error("Hiba történt a névjavaslatok generálása során.");
    }
};