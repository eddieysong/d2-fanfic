import React from "react";
import Image from "next/image";
import type { Illustration } from "../lib/library-types";

function inline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }
    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
}

function StoryIllustration({ illustration }: { illustration: Illustration }) {
  return (
    <figure className="story-illustration">
      <a href={illustration.src} target="_blank" rel="noreferrer" aria-label={`Open full-size illustration: ${illustration.caption}`}>
        <Image
          src={illustration.src}
          alt={illustration.alt}
          width={1152}
          height={1728}
          loading={illustration.placement <= 0.15 ? "eager" : "lazy"}
          sizes="(max-width: 760px) calc(100vw - 3rem), 34rem"
          unoptimized
        />
      </a>
      <figcaption>{illustration.caption}</figcaption>
    </figure>
  );
}

export function MarkdownProse({ markdown, illustrations = [] }: { markdown: string; illustrations?: Illustration[] }) {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  const scheduled = new Map<number, Illustration[]>();

  for (const illustration of illustrations) {
    const index = Math.max(0, Math.min(blocks.length - 1, Math.round((blocks.length - 1) * illustration.placement)));
    scheduled.set(index, [...(scheduled.get(index) ?? []), illustration]);
  }

  return (
    <div className="prose">
      {blocks.map((block, index) => {
        const normalized = block;
        const heading = normalized.match(/^(#{2,4})\s+(.+)$/s);
        let rendered: React.ReactNode;
        if (heading) {
          const level = heading[1].length;
          const text = heading[2].replace(/\n/g, " ");
          if (level === 2) rendered = <h2>{inline(text)}</h2>;
          else if (level === 3) rendered = <h3>{inline(text)}</h3>;
          else rendered = <h4>{inline(text)}</h4>;
        } else {
          rendered = <p>{inline(normalized.replace(/\n/g, " "))}</p>;
        }
        return (
          <React.Fragment key={index}>
            {rendered}
            {(scheduled.get(index) ?? []).map((illustration) => (
              <StoryIllustration key={illustration.src} illustration={illustration} />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}
