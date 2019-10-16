const JsDiff = require('diff');

export function getDiffAsLineNumber(json1, json2, diffLines) {
  if (!json1 || !json2) {
    return null;
  }

  let diff;
  if (diffLines) {
    diff = JsDiff.diffLines(json1, json2);
  } else {
    diff = JsDiff.diffJson(json1, json2);
  }

  let highlightedLines = '';
  let currentLineNumber = 0;
  diff.forEach(part => {
    if (part.removed) {
      return;
    }
    if (part.added) {
      if (highlightedLines !== '') {
        highlightedLines += ',';
      }

      highlightedLines = `${highlightedLines +
        (currentLineNumber + 1)}-${part.count + currentLineNumber}`;
    }
    currentLineNumber += part.count;
  });

  return highlightedLines;
}
