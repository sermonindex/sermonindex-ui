import React, { ReactNode, useState } from 'react';
import { linkifyScripture } from '~/components/linkify-scripture';
import { ClickableText } from '~/components/section';
import { Link } from '@remix-run/react';
import { FaCheck, FaLink } from 'react-icons/fa6';

const baseText = 'text-base leading-relaxed';

export interface SiHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: ReactNode;
  customId?: string | undefined;
  node?: {
    properties?: {
      id?: string; // This ID comes from remark-slug
    };
    // Allow other mdast node properties for flexibility
    [key: string]: any;
  };
}

function getId(node: any, customId: string | undefined): string {
  const rawId = customId ?? node?.properties?.id;
  return rawId?.toLowerCase().replace(/\s+/g, '-');
}

// Common Heading Renderer with LinkIcon Logic
const HeadingRenderer = ({
  level,
  children,
  className,
  customId = undefined,
  node,
}: SiHeadingProps & { level: 1 | 2 }) => {
  const id = getId(node, customId);

  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!id || typeof document === 'undefined') return;

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
  const headingTextSize = level === 1 ? `text-xl` : `text-lg`;
  const headingBaseClass =
    'flex items-center text-black dark:text-white scroll-mt-16';
  // The border and padding are specific to H1 and H2
  const borderAndPaddingClass = `border-b-2 border-neutral-300 dark:border-neutral-700 py-1 md:py-2`;
  const combinedClassName = `${headingBaseClass} ${headingTextSize} ${borderAndPaddingClass} ${
    className || ''
  }`;

  // Fallback for simple rendering if no ID (should not happen with remark-slug)
  if (!id) {
    return <HeadingTag className={combinedClassName}>{children}</HeadingTag>;
  }

  return (
    <div
      className="group items-center pb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HeadingTag
        id={id}
        className={`relative items-center ${combinedClassName}`}
      >
        {/* Icon Button: Absolutely positioned to the left of the HeadingTag's content */}
        {/* IMPORTANT NOTE: Greg asked for this nice feature to be removed for fear of search engines indexing tags */}
        {/*<button*/}
        {/*  type="button"*/}
        {/*  onClick={handleCopyLink}*/}
        {/*  aria-label="Copy link to this section"*/}
        {/*  title="Copy link to this section"*/}
        {/*  className={`hidden md:inline-flex*/}
        {/*              absolute top-1/2 -translate-y-1/2 left-[-1rem] */}
        {/*              p-1 text-neutral-400 dark:text-neutral-500 */}
        {/*              hover:text-blue-500 dark:hover:text-blue-400 */}
        {/*              cursor-pointer transition-all duration-150*/}
        {/*             ${*/}
        {/*               isHovered || copied*/}
        {/*                 ? 'opacity-100 scale-100'*/}
        {/*                 : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'*/}
        {/*             }`}*/}
        {/*>*/}
        {/*  {copied ? (*/}
        {/*    <FaCheck className="w-4 h-4 text-green-800 dark:text-green-200" />*/}
        {/*  ) : (*/}
        {/*    <FaLink className="w-4 h-4" />*/}
        {/*  )}*/}
        {/*</button>*/}
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

export const SiHeading3 = (props: SiHeadingProps) => {
  const id = getId(props.node, props.customId);
  return (
    <h3
      id={id}
      className={`py-1 md:py-2 text-lg font-semibold ${props.className}`}
    >
      {props.children}
    </h3>
  );
};

export const SiHeading4 = (props: SiHeadingProps) => {
  const id = getId(props.node, props.customId);

  return (
    <h4
      id={id}
      className={`py-1 md:py-2 text-base font-semibold ${props.className}`}
    >
      {props.children}
    </h4>
  );
};

export const SiHeading5 = (props: SiHeadingProps) => {
  const id = getId(props.node, props.customId);

  return (
    <h5
      id={id}
      className={`py-1 md:py-2 text-sm font-semibold ${props.className}`}
    >
      {props.children}
    </h5>
  );
};

export const SiHeading6 = (props: SiHeadingProps) => {
  const id = getId(props.node, props.customId);

  return (
    <h6
      id={id}
      className={`py-1 md:py-2 text-xs font-semibold ${props.className}`}
    >
      {props.children}
    </h6>
  );
};

export const SiParagraph = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
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

  return (
    <p className={`${baseText} pt-2 pb-1 ${className}`}>{renderableChildren}</p>
  );
};

export const SiLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
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

export const SiBlockquote = ({ children }: { children: ReactNode }) => (
  <div className={`${baseText}`}>
    <blockquote
      className={`pl-4 pr-2 border-l-4 border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 italic my-2`}
    >
      {children}
    </blockquote>
  </div>
);

export const SiCodeBlock = ({
  language,
  value,
}: {
  language: string | null;
  value: string;
}) => (
  <pre
    className={`bg-gray-100 dark:bg-gray-800 rounded-md py-1 px-4 overflow-x-auto my-4`}
  >
    <code
      className={`font-mono text-sm ${language ? `language-${language}` : ''}`}
    >
      {value}
    </code>
  </pre>
);

export const SiInlineCode = ({ children }: { children: ReactNode }) => (
  <code
    className={`bg-gray-100 dark:bg-gray-800 rounded-sm px-1 py-0.5 font-mono text-sm`}
  >
    {children}
  </code>
);

export const SiImage = ({
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
      loading="lazy"
    />
  );
};

export const SiThematicBreak = () => (
  <hr className={`border-t border-gray-300 dark:border-neutral-700 my-6`} />
);

export const SiUnorderedList = ({ children }: { children: ReactNode }) => (
  <div className={`${baseText} px-4 py-2 pl-8`}>
    <ul className={`list-disc pl-4`}>{children}</ul>
  </div>
);

export const SiOrderedList = ({ children }: { children: ReactNode }) => (
  <div className={`${baseText} px-4 py-2 pl-8`}>
    <ol className={`list-decimal pl-4`}>{children}</ol>
  </div>
);

export const SiListItem = ({ children }: { children: ReactNode }) => (
  <li>{children}</li>
);

export const SiEmphasis = ({ children }: { children: ReactNode }) => (
  <em className="italic">{children}</em>
);

export const SiStrong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold">{children}</strong>
);

export const SiDelete = ({ children }: { children: ReactNode }) => (
  <del className="line-through text-gray-500">{children}</del>
);

export const SiInput = ({
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

export const SiTable = ({ children }: { children: ReactNode }) => (
  <div className={`my-4 overflow-x-auto`}>
    <table className="table-auto border-collapse border border-gray-300 dark:border-neutral-700 w-full">
      {children}
    </table>
  </div>
);

export const SiTableHeader = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-100 dark:bg-neutral-800">{children}</thead>
);

export const SiTableBody = ({ children }: { children: ReactNode }) => (
  <tbody>{children}</tbody>
);

export const SiTableRow = ({
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

export const SiTableCell = ({
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
