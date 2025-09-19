# AI Studio Alkalmazás Fejlesztési Szabályok

Ez a dokumentum az alkalmazás technológiai stackjét és a fejlesztési irányelveket vázolja fel, hogy biztosítsa a konzisztenciát és a hatékonyságot a fejlesztés során.

## Technológiai Stack

*   **React**: A felhasználói felület építéséhez használt JavaScript könyvtár.
*   **TypeScript**: A kód minőségének és karbantarthatóságának javítása érdekében használt típusos JavaScript.
*   **Tailwind CSS**: Utility-first CSS keretrendszer a gyors és reszponzív stílusozáshoz.
*   **Google Gemini API**: A mesterséges intelligencia alapú elemzések és tartalomgenerálás motorja.
*   **Recharts**: Egy React-alapú diagramkönyvtár az adatvizualizációhoz.
*   **Lucide React**: Könnyen használható, testreszabható ikonkönyvtár.
*   **Shadcn/ui**: Egy gyűjtemény újrahasználható UI komponensekből, amelyek a Radix UI-ra épülnek és Tailwind CSS-t használnak.
*   **React Router**: A kliensoldali útválasztás kezelésére szolgál az alkalmazáson belül.

## Könyvtárhasználati Szabályok

A fejlesztés során az alábbi irányelveket kell követni a könyvtárak és eszközök használatára vonatkozóan:

*   **Felhasználói Felület (UI) Komponensek**:
    *   Preferáltan a **shadcn/ui** komponenseket használjuk. Ha egy adott funkcionalitáshoz nincs megfelelő shadcn/ui komponens, vagy egyedi stílusra van szükség, akkor hozzunk létre új, dedikált komponenseket.
    *   Minden új komponensnek saját fájlban kell lennie (`src/components/MyComponent.tsx`).
*   **Stílusozás**:
    *   Minden stílusozáshoz kizárólag a **Tailwind CSS** utility osztályait használjuk. Kerüljük az inline stílusokat és a hagyományos CSS fájlokat, kivéve, ha feltétlenül szükséges (pl. globális stílusok az `index.css`-ben).
*   **Ikonok**:
    *   Az alkalmazásban használt összes ikonhoz a **lucide-react** könyvtárat használjuk.
*   **Állapotkezelés**:
    *   Az alkalmazás állapotkezeléséhez a React beépített hookjait (**useState**, **useEffect**, **useMemo**, **useCallback**) használjuk. Kerüljük a külső állapotkezelő könyvtárakat, hacsak nem indokolt egy komplexebb use case.
*   **Útválasztás (Routing)**:
    *   Az alkalmazás navigációjához a **React Router**-t használjuk. Az útvonalakat a `src/App.tsx` fájlban kell definiálni.
*   **Adatvizualizáció**:
    *   Minden diagram és grafikon megjelenítéséhez a **Recharts** könyvtárat használjuk.
*   **AI Szolgáltatások**:
    *   A Gemini API-val való interakcióhoz az **@google/genai** könyvtárat használjuk. Az API hívásokat a `src/services/geminiService.ts` fájlban kell kezelni.
*   **Fájlstruktúra**:
    *   A forráskód a `src` mappában található.
    *   Az oldalak a `src/pages/` mappában, a komponensek a `src/components/` mappában, az ikonok a `src/components/icons/` mappában, a szolgáltatások pedig a `src/services/` mappában helyezkednek el.
    *   A fájlnevek lehetnek vegyes kis- és nagybetűsek (PascalCase komponensekhez), a könyvtárnevek pedig kisbetűsek.