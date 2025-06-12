declare module 'convert-country-codes';

interface Country {
    iso2: string;
    iso3: string;
}

export function convertIocCode(code: string): Country | null;
