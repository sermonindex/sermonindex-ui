import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import rehypeRaw from 'rehype-raw';
import {
  SiBlockquote,
  SiCodeBlock,
  SiDelete,
  SiEmphasis,
  SiHeading1,
  SiHeading2,
  SiHeading3,
  SiHeading4,
  SiHeading5,
  SiHeading6,
  SiHeadingProps,
  SiImage,
  SiInlineCode,
  SiInput,
  SiLink,
  SiListItem,
  SiOrderedList,
  SiParagraph,
  SiStrong,
  SiTable,
  SiTableBody,
  SiTableCell,
  SiTableHeader,
  SiTableRow,
  SiThematicBreak,
  SiUnorderedList,
} from '~/components/si-styles';
import { toString } from 'mdast-util-to-string';
import { SiSection } from '~/components/section';

const TOC_MARKER_HEADING_TEXT = 'inject-toc-here';
const basePadding = 'px-2 md:px-4';
const baseHeading = `${basePadding}`;

interface MarkdownRendererProps {
  markdownContent: string;
}

const SiHeading1Wrapper = (props: SiHeadingProps) => {
  return <SiHeading1 {...props} className={baseHeading} />;
};

// The second heading is custom because it is where the table of contents can be placed
export const CustomH2Renderer = (props: SiHeadingProps & { node: any }) => {
  const { node, children } = props;
  const textContent = toString(node);

  if (textContent.trim() === TOC_MARKER_HEADING_TEXT) {
    return null;
  }
  return (
    <SiHeading2 className={baseHeading} {...props}>
      {children}
    </SiHeading2>
  );
};

const SiHeading3Wrapper = (props: SiHeadingProps) => {
  return <SiHeading3 {...props} className={baseHeading} />;
};

const SiHeading4Wrapper = (props: SiHeadingProps) => {
  return <SiHeading4 {...props} className={baseHeading} />;
};

const SiHeading5Wrapper = (props: SiHeadingProps) => {
  return <SiHeading5 {...props} className={baseHeading} />;
};

const SiHeading6Wrapper = (props: SiHeadingProps) => {
  return <SiHeading6 {...props} className={baseHeading} />;
};

const SiParagraphWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={basePadding}>
      <SiParagraph>{children}</SiParagraph>
    </div>
  );
};

const SiBlockQuoteWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={basePadding}>
      <SiBlockquote>{children}</SiBlockquote>
    </div>
  );
};

export default function MarkdownRenderer({
  markdownContent,
}: MarkdownRendererProps) {
  // To use :::table-of-contents, replace it with a heading that remark-toc can find.
  // The 'heading' option in remarkToc below should match this.
  const processedText = markdownContent
    .replace(
      /:::table-of-contents/g,
      `\n## ${TOC_MARKER_HEADING_TEXT}\n`, // Using H2 for TOC heading, can be any level
    )
    .replace(
      /:::card-start/g,
      `<div class="flex flex-row gap-x-2 items-center my-2">
  <div class="w-32 flex-shrink-0">`,
    )
    .replace(
      /:::card-middle/g,
      `</div>
  <div class="flex-grow">`,
    )
    .replace(
      /:::card-end/g,
      `</div>
</div>
`,
    );

  return (
    <ReactMarkdown
      children={processedText}
      remarkPlugins={[
        remarkGfm,
        remarkSlug, // For some reason this must come BEFORE remark-toc.
        [
          remarkToc,
          {
            heading: TOC_MARKER_HEADING_TEXT,
            tight: true,
            maxDepth: 5,
          },
        ],
      ]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: SiHeading1Wrapper,
        h2: CustomH2Renderer,
        h3: SiHeading3Wrapper,
        h4: SiHeading4Wrapper,
        h5: SiHeading5Wrapper,
        h6: SiHeading6Wrapper,
        p: SiParagraphWrapper,
        a: SiLink,
        blockquote: SiBlockQuoteWrapper,
        // Updated code component handling:
        code: ({ node, inline, className, children, ...props }) => {
          if (inline) {
            return <SiInlineCode {...props}>{String(children)}</SiInlineCode>;
          }
          const match = /language-(\w+)/.exec(className || '');
          return (
            <SiCodeBlock
              language={match ? match[1] : null}
              value={String(children).trimEnd()}
            />
          );
        },
        em: SiEmphasis,
        strong: SiStrong,
        hr: SiThematicBreak,
        img: SiImage,
        li: SiListItem,
        ol: SiOrderedList,
        ul: SiUnorderedList,
        del: SiDelete,
        input: SiInput,
        table: SiTable,
        thead: SiTableHeader,
        tbody: SiTableBody,
        tr: SiTableRow,
        td: SiTableCell,
      }}
    />
  );
}
