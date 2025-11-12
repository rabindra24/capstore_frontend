import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

const EmailContent = ({ email }) => {
  if (!email)
    return (
      <div className="p-4 text-gray-500">Select an email to view</div>
    );

  const { content, contentHtml } = email;

  // Sanitize HTML safely
  const safeHtml = contentHtml ? DOMPurify.sanitize(contentHtml) : null;

  return (
    <div className="prose max-w-none p-6 bg-white rounded-lg shadow-sm">
      {safeHtml ? (
        // Render sanitized HTML if available
        <div
          className="email-html-content"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        // Otherwise render Markdown
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, children, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#004aad", textDecoration: "underline" }}
              >
                {children}
              </a>
            ),
            img: ({ node, ...props }) => (
              <img
                {...props}
                alt={props.alt}
                loading="lazy"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                  display: "block",
                }}
               
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default EmailContent;
