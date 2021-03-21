import { insertVariables } from './variables';

describe('insertVariables', () => {
  it('replaces variables in curly brackets', () => {
    const html = 'Hei {{ name }}!';
    const variables = { name: 'Cheese' };
    const output = insertVariables(html, variables);

    expect(output).toEqual('Hei Cheese!');
  });

  it('replaces missing variables with empty string', () => {
    const html = 'Hei {{ name }}!';
    const variables = {};
    const output = insertVariables(html, variables);

    expect(output).toEqual('Hei !');
  });

  it('can contain lists of items', () => {
    const html = '{{#each array}}{{title}}: {{cost}} {{/each}}';
    const variables = {
      array: [
        { cost: 14, title: 'Cake' },
        { cost: 2, title: 'Fish' },
      ],
    };

    const output = insertVariables(html, variables);

    expect(output).toEqual('Cake: 14 Fish: 2 ');
  });

  it('throws if missing variables and strict', () => {
    const html = 'Hei {{ name }}!';
    const variables = {};
    try {
      insertVariables(html, variables, true);
      fail('Missing variable insertion should throw error');
    } catch (err) {}
  });
});
