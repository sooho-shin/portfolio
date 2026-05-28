import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/config/projects";
import { siteProfile } from "@/config/profile";

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
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Sooho Shin`,
      description: project.summary,
      type: "article",
      url: `${siteProfile.siteUrl}/work/${project.slug}`,
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
      <Link href="/work" style={styles.backLink}>
        Back to work
      </Link>
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
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {supportImages.length > 0 ? (
        <section style={styles.imageGrid}>
          {supportImages.map(image => (
            <div key={image.src} style={styles.previewImage}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </section>
      ) : null}

      {project.source ? (
        <p style={styles.source}>Source note: {project.source}</p>
      ) : null}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    color: "#000",
    padding: "96px 32px 48px",
  },
  backLink: {
    display: "inline-block",
    border: "2px solid #000",
    padding: "8px 12px",
    marginBottom: 32,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  hero: {
    maxWidth: 980,
    marginBottom: 32,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    fontSize: "clamp(48px, 9vw, 140px)",
    lineHeight: 0.92,
    marginBottom: 24,
    textTransform: "uppercase",
  },
  summary: {
    maxWidth: 760,
    fontSize: 20,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  metaList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "0 0 24px",
  },
  metaItem: {
    border: "2px solid #000",
    padding: "8px 10px",
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaValue: {
    margin: 0,
    fontSize: 15,
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
    border: "2px solid #000",
    padding: "6px 10px",
    fontSize: 13,
    fontWeight: 700,
  },
  externalLink: {
    display: "inline-block",
    border: "2px solid #000",
    padding: "10px 12px",
    marginTop: 18,
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
  },
  heroImage: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    border: "4px solid #000",
    marginBottom: 32,
    overflow: "hidden",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    borderTop: "4px solid #000",
    borderLeft: "4px solid #000",
    marginBottom: 32,
  },
  panel: {
    padding: 24,
    borderRight: "4px solid #000",
    borderBottom: "4px solid #000",
    minHeight: 220,
  },
  heading: {
    fontSize: 18,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 1.7,
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    fontSize: 16,
    lineHeight: 1.7,
  },
  stackSection: {
    border: "4px solid #000",
    padding: 24,
    marginBottom: 32,
  },
  stackList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  previewImage: {
    position: "relative",
    aspectRatio: "4 / 3",
    border: "4px solid #000",
    overflow: "hidden",
  },
  source: {
    marginTop: 24,
    fontSize: 13,
  },
};
