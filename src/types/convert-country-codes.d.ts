declare module 'convert-country-codes' {
    export function convertIocCode(code: string): Country | null;
}

interface Country {
    iso2: string;
    iso3: string;
}
