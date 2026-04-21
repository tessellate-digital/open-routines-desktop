import { describe, it, expect } from 'vitest';
import { parseDisplayPrompt } from './parseDisplayPrompt';

describe('parseDisplayPrompt', () => {
  it('returns plain text segment for text with no tags', () => {
    const result = parseDisplayPrompt('Hello world');
    expect(result).toEqual([{ type: 'text', content: 'Hello world' }]);
  });

  it('returns plain text for empty string', () => {
    const result = parseDisplayPrompt('');
    expect(result).toEqual([{ type: 'text', content: '' }]);
  });

  it('does not match regular @mentions like @email.com', () => {
    const result = parseDisplayPrompt('Contact @email.com for help');
    expect(result).toEqual([{ type: 'text', content: 'Contact @email.com for help' }]);
  });

  it('parses a single file-browse tag', () => {
    const result = parseDisplayPrompt('@customTag:file-browse(/Users/loic/image.png)');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'tag',
      actionId: 'file-browse',
      rawValue: '/Users/loic/image.png',
    });
  });

  it('uses feedRenderer for display text when available', () => {
    const result = parseDisplayPrompt('@customTag:file-browse(/Users/loic/image.png)');
    const tag = result[0];
    expect(tag.type).toBe('tag');
    if (tag.type === 'tag') {
      // file-browse feedRenderer returns the full path
      expect(tag.displayText).toBe('/Users/loic/image.png');
    }
  });

  it('splits text around a tag', () => {
    const result = parseDisplayPrompt('Describe @customTag:file-browse(/path/img.png) please');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: 'text', content: 'Describe ' });
    expect(result[1]).toMatchObject({
      type: 'tag',
      actionId: 'file-browse',
      rawValue: '/path/img.png',
    });
    expect(result[2]).toEqual({ type: 'text', content: ' please' });
  });

  it('handles multiple tags', () => {
    const result = parseDisplayPrompt(
      '@customTag:file-browse(/a.png) and @customTag:file-browse(/b.png)'
    );
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ type: 'tag', rawValue: '/a.png' });
    expect(result[1]).toEqual({ type: 'text', content: ' and ' });
    expect(result[2]).toMatchObject({ type: 'tag', rawValue: '/b.png' });
  });

  it('falls back to rawValue as displayText for unknown action id', () => {
    const result = parseDisplayPrompt('@customTag:unknown-action(somevalue)');
    expect(result).toHaveLength(1);
    const tag = result[0];
    expect(tag.type).toBe('tag');
    if (tag.type === 'tag') {
      expect(tag.displayText).toBe('somevalue');
    }
  });

  it('handles tag at the very start with trailing text', () => {
    const result = parseDisplayPrompt('@customTag:file-browse(/f.png) is attached');
    expect(result[0]).toMatchObject({ type: 'tag' });
    expect(result[1]).toEqual({ type: 'text', content: ' is attached' });
  });

  it('handles tag at the very end with leading text', () => {
    const result = parseDisplayPrompt('Please review @customTag:file-browse(/f.png)');
    expect(result[0]).toEqual({ type: 'text', content: 'Please review ' });
    expect(result[1]).toMatchObject({ type: 'tag' });
  });
});
