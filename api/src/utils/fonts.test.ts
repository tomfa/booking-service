import { extractUsedFonts, findGoogleFontUrl, Font } from './fonts';

const googleFont: Font = {
  name: 'Roboto',
  types: [{ weight: 400, italic: false }],
};

const unknownFont: Font = {
  name: 'Waterfall',
  types: [{ weight: 400, italic: false }],
};

describe('findGoogleFontUrl', () => {
  it('returns url for known google fonts', () => {
    const { url, html, unmatchedFonts } = findGoogleFontUrl([googleFont]);
    expect(url).toBe(
      'https://fonts.googleapis.com/css?family=Roboto:regular&display=block'
    );
    expect(html).toBe(`<link rel="stylesheet" href="${url}" />`);
    expect(unmatchedFonts.length).toBe(0);
  });
  it('returns missing for unknown fonts', () => {
    const { url, html, unmatchedFonts } = findGoogleFontUrl([unknownFont]);
    expect(url).toBe(undefined);
    expect(html).toBe(undefined);
    expect(unmatchedFonts.length).toBe(1);
  });
});

describe('extractUsedFonts', () => {
  it('returns used fonts', () => {
    const svg = `
    <text font-family="Roboto" font-size="12" letter-spacing="0em"><tspan x="56" y="83.1016">Roboto Text</tspan></text>
    <text font-family="Red Hat Display" font-size="12" font-style="italic" letter-spacing="0em"><tspan x="56" y="120.278">Red Hat Display Text</tspan></text>
    <text font-family="Roboto" font-size="12" font-weight="bold" letter-spacing="0em"><tspan x="56" y="155.102">Roboto Bold Text</tspan></text>`;

    const usedFonts = extractUsedFonts(svg);

    expect(usedFonts.length).toBe(2);
    expect(usedFonts.find(f => f.name === 'Roboto')).toEqual(
      expect.objectContaining({
        name: 'Roboto',
        types: [
          { weight: 400, italic: false },
          { weight: 700, italic: false },
        ],
      })
    );
    expect(usedFonts.find(f => f.name === 'Red Hat Display')).toEqual(
      expect.objectContaining({
        name: 'Red Hat Display',
        types: [{ weight: 400, italic: true }],
      })
    );
  });
});
