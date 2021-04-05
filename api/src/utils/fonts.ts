import cheerio from 'cheerio';
import { Element } from 'domhandler';
import fontFamilies from './googleFontFamilies.json';

type FontType = {
  weight: number;
  italic: boolean;
};

export type Font = {
  name: string;
  types: FontType[];
};

type FontInstance = {
  name: string;
  weight: number;
  italic: boolean;
};

const toGoogleFontType = (type: FontType): string => {
  if (type.weight === 400) {
    return type.italic ? 'italic' : 'regular';
  }
  const italicPostfix = type.italic ? 'italic' : '';
  return `${type.weight}${italicPostfix}`;
};

export const findGoogleFontFamily = (font: Font): string | undefined => {
  if (!fontFamilies.includes(font.name)) {
    return undefined;
  }
  const googleFontTypes = font.types.map(toGoogleFontType);
  return `${font.name.replace(/ /g, '+')}:${googleFontTypes.join(',')}`;
};

export const findGoogleFontUrl = (
  fonts: Font[]
): { url?: string; html?: string; unmatchedFonts: Font[] } => {
  const fontMatches = fonts.map(font => ({
    font,
    result: findGoogleFontFamily(font),
  }));
  const unmatchedFonts = fontMatches.filter(m => !m.result).map(m => m.font);
  const queryParam = fontMatches
    .filter(m => !!m.result)
    .map(m => m.result)
    .join('|');
  if (!queryParam) {
    return { unmatchedFonts };
  }
  const url = `https://fonts.googleapis.com/css?family=${queryParam}&display=block`;
  const html = `<link rel="stylesheet" href="${url}" />`;
  return { unmatchedFonts, url, html };
};

const toNumericFontWeight = (domWeight: undefined | string): number => {
  if (!domWeight) {
    return 400;
  }
  if (!Number.isNaN(Number.parseInt(domWeight))) {
    return Number.parseInt(domWeight);
  }
  if (domWeight === 'regular') {
    return 400;
  }
  if (domWeight === 'bold') {
    return 700;
  }
  if (!Number.isNaN(Number.parseInt(domWeight))) {
    return Number.parseInt(domWeight);
  }
  throw new Error(`Unknown font weight ${domWeight}`);
};

const toFontStyle = (domStyle: undefined | string): 'normal' | 'italic' => {
  if (!domStyle) {
    return 'normal';
  }
  if (domStyle === 'normal' || domStyle === 'italic') {
    return domStyle;
  }
  throw new Error(`Unknown font style ${domStyle}`);
};

const mergeDuplicates = (instances: FontInstance[]): Font[] => {
  const fonts: Record<string, Font> = {};
  instances.forEach(instance => {
    if (!fonts[instance.name]) {
      fonts[instance.name] = {
        name: instance.name,
        types: [],
      };
    }
    const font = fonts[instance.name];
    const fontExists = !!font.types.find(
      f => f.weight === instance.weight && f.italic === instance.italic
    );
    if (!fontExists) {
      font.types = [
        ...font.types,
        { weight: instance.weight, italic: instance.italic },
      ];
    }
  });
  return Object.values(fonts);
};

const getFontFromDomElement = (element: Element): FontInstance => {
  const name = element.attribs['font-family'];
  const weight = toNumericFontWeight(element.attribs['font-weight']);
  const italic = toFontStyle(element.attribs['font-style']) === 'italic';

  if (!name) {
    return undefined;
  }
  return {
    name,
    weight,
    italic,
  };
};

export const extractUsedFonts = (svg: string): Font[] => {
  const $ = cheerio.load(svg);
  const fonts = Array.from($('text[font-family]')).map(getFontFromDomElement);
  return mergeDuplicates(fonts);
};

export const insertFontsInSVG = (svg: string): string => {
  const usedFonts = extractUsedFonts(svg);
  const fontUrls = findGoogleFontUrl(usedFonts);
  const $ = cheerio.load(svg);
  const head = $('head');
  const meta = `<meta content="text/html;charset=utf-8" http-equiv="Content-Type">\n<meta content="utf-8" http-equiv="encoding">`;
  head.append(meta);
  const style = `<style>body { padding: 0; margin: 0 }</style>`;
  head.append(style);
  if (fontUrls.html) {
    head.append(`${fontUrls.html}`);
  }
  return $.html();
};
