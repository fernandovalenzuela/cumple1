import sharp from "sharp";

export default sharp;


// Esto es debido a que si se carga por primera vez en C:\fuentes\nextjs\cumple1\cumple1\app\lib\images\imagePipeline.ts, function processImage, 
// da un error. Por eso se hace este preload

// Workaround para un problema reproducible en Windows donde la primera carga
// de `sharp` durante una Server Action puede fallar con ERR_DLOPEN_FAILED.
// Precargar el módulo al iniciar la aplicación evita el problema.