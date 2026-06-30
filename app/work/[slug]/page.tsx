import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/config/projects";
import { buildCanonicalUrl } from "@/config/seo";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: buildCanonicalUrl(`/work/${project.slug}`),
    },
    openGraph: {
      title: `${project.title} | Sooho Shin`,
      description: project.summary,
      type: "article",
      url: buildCanonicalUrl(`/work/${project.slug}`),
      siteName: "신수호 개발자 포트폴리오",
      locale: "ko_KR",
      images: project.images?.[0] ? [project.images[0].src] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | 신수호 개발자 포트폴리오`,
      description: project.summary,
      images: project.images?.[0] ? [project.images[0].src] : undefined,
    },
  };
}

export default function WorkDetailPage({ params }: Props) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  const [heroImage, ...supportImages] = project.images ?? [];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>{project.type}</p>
        <h1 style={styles.title}>{project.title}</h1>
        <dl style={styles.metaList}>
          <div style={styles.metaItem}>
            <dt style={styles.metaLabel}>Period</dt>
            <dd style={styles.metaValue}>{project.period}</dd>
          </div>
        </dl>
        <p style={styles.summary}>{project.summary}</p>
        <ul style={styles.proofList}>
          {project.proofPoints.map(point => (
            <li key={point} style={styles.proofItem}>
              {point}
            </li>
          ))}
        </ul>
        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.externalLink}
          >
            {project.externalLabel ?? "Visit project"}
          </a>
        ) : null}
      </section>

      {heroImage ? (
        <section style={styles.heroImage}>
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </section>
      ) : null}

      <section style={styles.grid}>
        <article style={styles.panel}>
          <h2 style={styles.heading}>Problem</h2>
          <p style={styles.body}>{project.problem}</p>
        </article>
        <article style={styles.panel}>
          <h2 style={styles.heading}>Role</h2>
          <ul style={styles.list}>
            {project.role.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article style={styles.panel}>
          <h2 style={styles.heading}>Verification</h2>
          <ul style={styles.list}>
            {project.verification.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article style={styles.panel}>
          <h2 style={styles.heading}>Result</h2>
          <ul style={styles.list}>
            {project.result.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section style={styles.stackSection}>
        <h2 style={styles.heading}>Stack</h2>
        <ul style={styles.stackList}>
          {project.stack.map(item => (
            <li key={item} style={styles.stackListItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {supportImages.length > 0 ? (
        <section style={styles.imageGrid}>
          {supportImages.map(image => (
            <div
              key={image.src}
              style={{
                ...styles.previewImage,
                aspectRatio: image.aspectRatio ?? styles.previewImage.aspectRatio,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: image.fit ?? "cover" }}
              />
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(60rem 40rem at 70% -10%, rgb(48 193 178 / 8%), transparent), #050505",
    color: "#fafafa",
    padding: "96px max(24px, calc((100vw - 1072px) / 2)) 120px",
    fontFamily:
      '"Geist", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    maxWidth: 820,
    marginBottom: 40,
  },
  eyebrow: {
    color: "#e8e8e8",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 400,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    marginBottom: 22,
  },
  title: {
    color: "#fafafa",
    fontSize: 64,
    lineHeight: 1.04,
    fontWeight: 800,
    marginBottom: 24,
    letterSpacing: 0,
  },
  summary: {
    maxWidth: 760,
    color: "#b8b8b8",
    fontSize: 17,
    lineHeight: 1.75,
    marginBottom: 24,
  },
  metaList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "0 0 24px",
  },
  metaItem: {
    border: "1px solid rgb(255 255 255 / 10%)",
    borderRadius: 999,
    background: "#262626",
    padding: "8px 12px",
  },
  metaLabel: {
    color: "#a3a3a3",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaValue: {
    color: "#e8e8e8",
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
  },
  proofList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  proofItem: {
    borderRadius: 999,
    background: "#262626",
    color: "#e8e8e8",
    padding: "7px 11px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11,
    fontWeight: 700,
  },
  externalLink: {
    display: "inline-flex",
    minHeight: 40,
    alignItems: "center",
    border: "1px solid rgb(232 232 232 / 40%)",
    borderRadius: 8,
    background: "#262626",
    color: "#e8e8e8",
    padding: "10px 14px",
    marginTop: 18,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
  },
  heroImage: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    border: "1px solid rgb(255 255 255 / 10%)",
    borderRadius: 14,
    marginBottom: 40,
    overflow: "hidden",
    background: "#141414",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginBottom: 40,
  },
  panel: {
    padding: 24,
    border: "1px solid rgb(255 255 255 / 10%)",
    borderRadius: 14,
    background: "#141414",
    minHeight: 220,
  },
  heading: {
    color: "#e8e8e8",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 16,
  },
  body: {
    color: "#a3a3a3",
    fontSize: 16,
    lineHeight: 1.7,
  },
  list: {
    color: "#a3a3a3",
    margin: 0,
    paddingLeft: 18,
    listStyle: "disc",
    fontSize: 16,
    lineHeight: 1.7,
  },
  stackSection: {
    border: "1px solid rgb(255 255 255 / 10%)",
    borderRadius: 14,
    background: "#141414",
    padding: 24,
    marginBottom: 40,
  },
  stackList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  stackListItem: {
    borderRadius: 999,
    background: "#262626",
    color: "#e8e8e8",
    padding: "7px 11px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11,
    fontWeight: 700,
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  previewImage: {
    position: "relative",
    aspectRatio: "4 / 3",
    border: "1px solid rgb(255 255 255 / 10%)",
    borderRadius: 14,
    overflow: "hidden",
    background: "#141414",
  },
};
