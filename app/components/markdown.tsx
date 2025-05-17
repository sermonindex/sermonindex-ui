import React, { ReactNode, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import rehypeRaw from 'rehype-raw';
import { toString } from 'mdast-util-to-string';

import { linkifyScripture } from '~/components/linkify-scripture';
import { ClickableText } from '~/components/section';
import { FaCheck, FaLink } from 'react-icons/fa6';
import { Link } from '@remix-run/react';

const xPadding = 'px-6 md:px-10';
const baseText = 'text-base leading-relaxed';

interface SiHeadingProps {
  children: ReactNode;
  node?: {
    properties?: {
      id?: string; // This ID comes from remark-slug
    };
    // Allow other mdast node properties for flexibility
    [key: string]: any;
  };
}

// Common Heading Renderer with LinkIcon Logic
const HeadingRenderer = ({
  level,
  children,
  node,
}: SiHeadingProps & { level: 1 | 2 }) => {
  const id = node?.properties?.id;
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!id || typeof window === 'undefined') return;

    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }

    // Scroll to the element, ideally after the state update has a chance to settle
    // Using requestAnimationFrame can help defer execution until after the current browser paint.
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // update the url hash
        if (window.location.hash !== `#${id}`) {
          history.replaceState(null, '', `${window.location.pathname}#${id}`);
        }
      }
    });
  };

  const HeadingTag = level === 1 ? 'h1' : 'h2';
  const headingClasses = level === 1 ? `text-3xl` : `text-2xl`;
  // The border and padding are specific to H1 and H2
  const borderAndPaddingClass = `border-b border-neutral-300 dark:border-neutral-700 pb-2`;

  // Fallback for simple rendering if no ID (should not happen with remark-slug)
  if (!id) {
    return (
      <div className={`py-4`}>
        <HeadingTag
          className={`${headingClasses} ${borderAndPaddingClass} scroll-mt-16`}
        >
          {children}
        </HeadingTag>
      </div>
    );
  }

  return (
    <div
      className={`py-4 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HeadingTag
        id={id}
        className={`${headingClasses} ${borderAndPaddingClass} relative scroll-mt-16`}
      >
        {/* Icon Button: Absolutely positioned to the left of the HeadingTag's content */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy link to this section"
          title="Copy link to this section"
          className={`hidden md:inline-flex
                      absolute top-1/2 -translate-y-1/2 left-[-2rem] 
                      p-1 text-neutral-400 dark:text-neutral-500 
                      hover:text-blue-500 dark:hover:text-blue-400 
                      cursor-pointer transition-all duration-150
                     ${
                       isHovered || copied
                         ? 'opacity-100 scale-100'
                         : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                     }`}
        >
          {copied ? (
            <FaCheck className="w-4 h-4 text-green-800 dark:text-green-200" />
          ) : (
            <FaLink className="w-4 h-4" />
          )}
        </button>
        {children}
      </HeadingTag>
    </div>
  );
};

export const SiHeading1 = (props: SiHeadingProps) => (
  <HeadingRenderer level={1} {...props} />
);

export const SiHeading2 = (props: SiHeadingProps) => (
  <HeadingRenderer level={2} {...props} />
);

const TOC_MARKER_HEADING_TEXT = 'inject-toc-here';

export const CustomH2Renderer = (props: SiHeadingProps & { node: any }) => {
  const { node, children } = props;
  const textContent = toString(node);

  if (textContent.trim() === TOC_MARKER_HEADING_TEXT) {
    return null;
  }
  return <SiHeading2 {...props}>{children}</SiHeading2>;
};

const SiHeading3 = ({ children, node }: SiHeadingProps) => {
  const id = node?.properties?.id;
  return (
    <h3 id={id} className={`text-lg font-semibold py-2`}>
      {children}
    </h3>
  );
};

const SiHeading4 = ({ children, node }: SiHeadingProps) => {
  const id = node?.properties?.id;
  return (
    <h4 id={id} className={`text-base font-semibold py-2`}>
      {children}
    </h4>
  );
};

const SiHeading5 = ({ children, node }: SiHeadingProps) => {
  const id = node?.properties?.id;
  return (
    <h5 id={id} className={`text-sm font-semibold py-2`}>
      {children}
    </h5>
  );
};

const SiHeading6 = ({ children, node }: SiHeadingProps) => {
  const id = node?.properties?.id;
  return (
    <h6 id={id} className={`text-xs font-semibold py-2`}>
      {children}
    </h6>
  );
};

export const SiParagraph = ({ children }: { children: ReactNode }) => {
  const renderableChildren: ReactNode[] = [];

  React.Children.forEach(children, (child, index) => {
    if (typeof child === 'string') {
      // If the child is a string, process it with linkifyScripture
      const linkifiedParts = linkifyScripture(child);
      linkifiedParts.forEach((part, partIndex) => {
        renderableChildren.push(
          <React.Fragment key={`child-${index}-part-${partIndex}`}>
            {part}
          </React.Fragment>,
        );
      });
    } else {
      // If the child is already a React element (e.g., an <img> from SiImage,
      // or <em>, <strong> from their respective SiEmphasis/SiStrong components),
      // pass it through directly.
      renderableChildren.push(
        // Ensure React elements passed as children also get a key if they are part of a list.
        // If `child` is a single element, this direct push is fine.
        // If `children` was an array of elements, `React.Children.forEach` handles keys implicitly.
        // Adding a key here for safety if `child` itself might be an array fragment.
        React.isValidElement(child)
          ? React.cloneElement(child, { key: `child-${index}` })
          : child,
      );
    }
  });

  return <p className={`py-2 ${baseText}`}>{renderableChildren}</p>;
};

const SiLink = ({ href, children }: { href: string; children: ReactNode }) => {
  // Check if it's an external link, mailto, or tel link
  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:');

  if (isExternal) {
    // For external links, use a standard <a> tag and openin new tab
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <ClickableText>{children}</ClickableText>
      </a>
    );
  }

  // For internal links (including hash links like those in the TOC), use Remix's Link
  return (
    <Link to={href}>
      <ClickableText>{children}</ClickableText>
    </Link>
  );
};

const SiBlockquote = ({ children }: { children: ReactNode }) => (
  <div className={`py-2 ${baseText}`}>
    <blockquote
      className={`pl-4 pr-2 border-l-4 border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 italic my-2`}
    >
      {children}
    </blockquote>
  </div>
);

const SiCodeBlock = ({
  language,
  value,
}: {
  language: string | null;
  value: string;
}) => (
  <pre
    className={`bg-gray-100 dark:bg-gray-800 rounded-md py-3 px-4 overflow-x-auto my-4`}
  >
    <code
      className={`font-mono text-sm ${language ? `language-${language}` : ''}`}
    >
      {value}
    </code>
  </pre>
);

const SiInlineCode = ({ children }: { children: ReactNode }) => (
  <code
    className={`bg-gray-100 dark:bg-gray-800 rounded-sm px-1 py-0.5 font-mono text-sm`}
  >
    {children}
  </code>
);

const SiImage = ({
  src,
  alt,
  title,
}: {
  src: string;
  alt?: string;
  title?: string;
}) => {
  if (!src) {
    return <p style={{ color: 'red' }}>Image source is missing!</p>;
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      title={title}
      className="block max-w-full rounded-lg my-2 mx-auto shadow-lg"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        console.error('SiImage: Error loading image.', {
          src: target.src,
          naturalWidth: target.naturalWidth,
          errorEvent: e,
        });
        target.alt = `Error loading image: ${alt || 'untitled'}`;
      }}
    />
  );
};

const SiThematicBreak = () => (
  <hr className={`border-t border-gray-300 dark:border-neutral-700 my-6`} />
);

const SiUnorderedList = ({ children }: { children: ReactNode }) => (
  <div className={`${baseText} px-4`}>
    <ul className={`list-disc pl-4`}>{children}</ul>
  </div>
);

const SiOrderedList = ({ children }: { children: ReactNode }) => (
  <div className={`${baseText} px-4`}>
    <ol className={`list-decimal pl-4`}>{children}</ol>
  </div>
);

const SiListItem = ({ children }: { children: ReactNode }) => (
  <li>{children}</li>
);

const SiEmphasis = ({ children }: { children: ReactNode }) => (
  <em className="italic">{children}</em>
);

const SiStrong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold">{children}</strong>
);

const SiDelete = ({ children }: { children: ReactNode }) => (
  <del className="line-through text-gray-500">{children}</del>
);

const SiInput = ({
  type,
  checked,
  ...props
}: { type: string; checked?: boolean } & React.ComponentProps<'input'>) => (
  <input
    type={type}
    checked={checked}
    className="mr-2 form-checkbox dark:bg-neutral-700 dark:border-neutral-600"
    {...props}
    disabled={props.disabled !== undefined ? props.disabled : true}
  />
);

const SiTable = ({ children }: { children: ReactNode }) => (
  <div className={`my-4 overflow-x-auto`}>
    <table className="table-auto border-collapse border border-gray-300 dark:border-neutral-700 w-full">
      {children}
    </table>
  </div>
);

const SiTableHeader = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-100 dark:bg-neutral-800">{children}</thead>
);

const SiTableBody = ({ children }: { children: ReactNode }) => (
  <tbody>{children}</tbody>
);

const SiTableRow = ({
  children,
  node,
  isHeader,
}: {
  children: ReactNode;
  node?: any;
  isHeader?: boolean;
}) => (
  <tr className="border-b border-gray-300 dark:border-neutral-700">
    {children}
  </tr>
);

const SiTableCell = ({
  children,
  node,
  isHeader,
}: {
  children: ReactNode;
  node?: any;
  isHeader?: boolean;
}) => {
  return isHeader ? (
    <th className="py-2 px-4 font-semibold text-left border border-gray-300 dark:border-neutral-600">
      {children}
    </th>
  ) : (
    <td className="py-2 px-4 border border-gray-300 dark:border-neutral-600">
      {children}
    </td>
  );
};

interface MarkdownRendererProps {
  markdownContent: string;
}

export default function MarkdownRenderer({
  markdownContent,
}: MarkdownRendererProps) {
  // To use [[_TOC_]], replace it with a heading that remark-toc can find.
  // The 'heading' option in remarkToc below should match this.
  const processedText = markdownContent
    .replace(
      /\[\[_TOC_\]\]/g,
      `\n## ${TOC_MARKER_HEADING_TEXT}\n`, // Using H2 for TOC heading, can be any level
    )
    .replace(
      /:::card-start/g,
      `<div class="flex flex-row gap-x-6 items-start my-2">
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
    <div className={`markdown-container my-6 pb-8 ${xPadding}`}>
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
          h1: SiHeading1,
          h2: CustomH2Renderer,
          h3: SiHeading3,
          h4: SiHeading4,
          h5: SiHeading5,
          h6: SiHeading6,
          p: SiParagraph,
          a: SiLink,
          blockquote: SiBlockquote,
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
    </div>
  );
}
