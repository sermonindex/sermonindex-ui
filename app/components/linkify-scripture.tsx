import React from 'react';
import { Link } from '@remix-run/react';
import { bcv_parser } from 'bible-passage-reference-parser/esm/bcv_parser.js';
import * as lang from 'bible-passage-reference-parser/esm/lang/en.js';
import { ClickableText } from '~/components/section';
import { COMMON_NAME_OSIS_MAP } from '~/common/bible-constants';

const parseScripture = (text: string) => {
  const bcv = new bcv_parser(lang);
  bcv.set_options({ sequence_combination_strategy: 'separate' });
  return bcv.parse(text).osis_and_indices();
};

interface ScriptureReference {
  osis: string;
  translations: string[];
  indices: number[];
}

function osis_to_link(osis: string): string {
  const span = osis.split('-');
  const parts = span[0].split('.');
  // todo: use state for user preferred translation?
  let book = COMMON_NAME_OSIS_MAP.get(parts[0].toLowerCase());
  // todo: chapter validation - does this number exist in the canon
  let chapter = parts.length >= 2 ? parts[1] : undefined;
  // todo: verse validation - does this verse exist in the canon
  let verse = parts.length >= 3 ? parts[2] : undefined;
  // todo parse out end reference

  if (verse) {
    return `/bible/parallel/${book}/${chapter}/${verse}`;
  } else {
    return `/bible/BSB/${book}/${chapter}`;
  }
}

export const linkifyScripture = (text: string | undefined) => {
  text = text || '';
  const matches: ScriptureReference[] = parseScripture(text);
  let elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    const [startIndex, endIndex] = match.indices;

    // Add the text *before* the match
    if (startIndex > lastIndex) {
      elements.push(text.substring(lastIndex, startIndex));
    }

    const referenceText = text.substring(startIndex, endIndex);

    // Create the link
    const link = (
      <Link to={osis_to_link(match.osis)} prefetch="intent" key={startIndex}>
        <ClickableText>{referenceText}</ClickableText>
      </Link>
    );
    elements.push(link);

    lastIndex = endIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
};
