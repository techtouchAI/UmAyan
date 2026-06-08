import type { Post } from "./types";

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface CMSPost extends Post {
  sha?: string;
  fileName?: string;
}

// Unicode-safe base64 encoder
export function encodeBase64Unicode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
  );
}

// Unicode-safe base64 decoder (optional, not strictly needed for download_url fetching but good for completeness)
export function decodeBase64Unicode(str: string): string {
  return decodeURIComponent(
    atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')
  );
}

const GITHUB_REPO = "techtouchAI/UmAyan";

export async function fetchGithubPosts(token: string): Promise<CMSPost[]> {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/content/posts`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch posts list");
  }

  const files: GitHubFile[] = await response.json();
  const jsonFiles = files.filter(f => f.name.endsWith(".json"));

  const loadedPosts = await Promise.all(
    jsonFiles.map(async (file) => {
      const fileRes = await fetch(file.download_url);
      if (!fileRes.ok) throw new Error(`Failed to fetch ${file.name}`);
      const content: Post = await fileRes.json();
      return { ...content, sha: file.sha, fileName: file.name };
    })
  );

  return loadedPosts;
}

export async function saveGithubPost(token: string, post: CMSPost): Promise<void> {
  const fileName = post.fileName || `${post.slug}.json`;
  const path = `content/posts/${fileName}`;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  const postData: Post = {
    title: post.title,
    slug: post.slug,
    portraitImage: post.portraitImage,
    category: post.category,
    bodyContent: post.bodyContent,
    conclusion: post.conclusion,
    seoMetaTitle: post.seoMetaTitle,
    seoMetaDescription: post.seoMetaDescription,
  };

  const contentStr = JSON.stringify(postData, null, 2);
  const contentBase64 = encodeBase64Unicode(contentStr);

  const body: { message: string; content: string; branch: string; sha?: string } = {
    message: `CMS: ${post.sha ? "Update" : "Create"} post ${post.title}`,
    content: contentBase64,
    branch: "main",
  };

  if (post.sha) {
    body.sha = post.sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to save post");
  }
}

export async function deleteGithubPost(token: string, post: CMSPost): Promise<void> {
  if (!post.sha || !post.fileName) {
    throw new Error("Missing required post metadata for deletion");
  }

  const path = `content/posts/${post.fileName}`;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `CMS: Delete post ${post.title}`,
      sha: post.sha,
      branch: "main",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
}