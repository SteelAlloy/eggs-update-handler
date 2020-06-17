import * as color from "https://deno.land/std/fmt/colors.ts";

// https://www.npmjs.com/package/box-console

export default function boxConsole (messages: string[]): string {
  let tips = [];
  let maxLen = 0;
  let defaultSpace = 4;
  let spaceWidth =' '.length;
  let borderSpace = '│'.length;
  if (Array.isArray(messages)) {
    tips = Array.from(messages);
  } else {
    tips = [messages];
  }
  if (tips.length === 1 && tips[0] === '') {
    return '';
  }
  tips = [' ', ...tips, ' '];
  tips = tips.map((msg) => ({ val: msg, len: msg.length }));
  maxLen = tips.reduce((maxLen, tip) => {
    maxLen = Math.max(maxLen, tip.len);
    return maxLen;
  }, maxLen);
  maxLen += spaceWidth * 2 * defaultSpace;
  tips = tips.map(({ val, len }) => {
    let i = 0;
    let j = 0;
    while (len + i * 2 * spaceWidth < maxLen) {
      i++;
    }
    j = i;
    while (j > 0 && len + i * spaceWidth + j * spaceWidth > maxLen) {
      j--;
    }
    return ' '.repeat(i) + val + ' '.repeat(j);
  });
  let line = color.yellow('─'.repeat(maxLen));
  let result = ['\n', color.yellow('┌') + line + color.yellow('┐')];
  for (let msg of tips) {
    result.push(color.yellow('│') + msg + color.yellow('│'));
  }
  result.push(color.yellow('└') + line + color.yellow('┘'));
  return result.join('\n');
};
