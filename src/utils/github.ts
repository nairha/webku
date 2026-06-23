import { Octokit } from "@octokit/rest";

import { unstable_cache } from "next/cache";
import { githubConfig } from "@/resources/content";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  framework?: {
    name: string;
    icon: string;
  };
  owner_avatar: string;
  recent_commits: {
    message: string;
    date: string;
    sha: string;
  }[];
}

const fetchGithubRepos = async (username: string): Promise<Repository[]> => {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 50,
      type: "owner",
    });

    const detailedRepos = await Promise.all(
      repos.map(async (repo) => {
        // Fetch recent commits
        let recentCommits: any[] = [];
        try {
          const { data: commits } = await octokit.repos.listCommits({
            owner: username,
            repo: repo.name,
            per_page: 3,
          });
          recentCommits = commits.map((c) => ({
            message: c.commit.message,
            date: c.commit.author?.date || "",
            sha: c.sha,
          }));
        } catch (e: any) {
          if (e.status === 409) {
            // Empty repository, ignore and continue
          } else {
            console.error(`Error fetching commits for ${repo.name}`, e);
          }
        }

        // Smart Analysis for Frameworks
        let framework = undefined;
        try {
          // Check for package.json
          const { data: files } = await octokit.repos.getContent({
            owner: username,
            repo: repo.name,
            path: "",
          });

          const filenames = Array.isArray(files) ? files.map((f) => f.name) : [];

          // JavaScript Frameworks
          if (filenames.includes("package.json")) {
            const { data: pkgJsonContent }: any = await octokit.repos.getContent({
              owner: username,
              repo: repo.name,
              path: "package.json",
            });
            const content = Buffer.from(pkgJsonContent.content, "base64").toString();
            const pkg = JSON.parse(content);
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };

            if (deps["nuxt"] || deps["@nuxt/kit"]) framework = { name: "Nuxt", icon: "nuxt" };
            else if (deps["next"]) framework = { name: "Next.js", icon: "nextjs" };
            else if (deps["vue"]) framework = { name: "Vue", icon: "vue" };
            else if (deps["react"]) framework = { name: "React", icon: "reactapi" };
            else if (deps["@angular/core"]) framework = { name: "Angular", icon: "angular" };
            else if (deps["svelte"]) framework = { name: "Svelte", icon: "svelte" };
          }

          // PHP Frameworks
          if (!framework && filenames.includes("composer.json")) {
            const { data: compJsonContent }: any = await octokit.repos.getContent({
              owner: username,
              repo: repo.name,
              path: "composer.json",
            });
            const content = Buffer.from(compJsonContent.content, "base64").toString();
            const comp = JSON.parse(content);
            const req = { ...comp.require };

            if (req["laravel/framework"]) framework = { name: "Laravel", icon: "laravel" };
            else if (req["yiisoft/yii2"]) framework = { name: "Yii2", icon: "yii" };
            else if (req["codeigniter4/framework"]) framework = { name: "CodeIgniter 4", icon: "codeigniter" };
          }

          // Spring Boot
          if (!framework && (filenames.includes("pom.xml") || filenames.includes("build.gradle"))) {
            framework = { name: "Spring Boot", icon: "springboot" };
          }

          // Vocaloid (VPR)
          if (!framework && filenames.some(f => f.endsWith(".vpr") || f.endsWith(".vprproj"))) {
            framework = { name: "Vocaloid (VPR)", icon: "vocaloid" };
          }

          // CI/CD or Legacy PHP
          if (!framework && filenames.includes("index.php")) {
            if (filenames.includes("system") && filenames.includes("application")) {
              framework = { name: "CodeIgniter 3", icon: "codeigniter" };
            }
          }

          // Language Fallback for Background Icons
          if (!framework && repo.language) {
            const langIconMapping: Record<string, string> = {
              "C++": "cpp",
              "Python": "python",
              "Go": "go",
              "JavaScript": "javascript",
              "TypeScript": "typescript",
              "PHP": "php",
              "CSS": "sass",
            };

            if (langIconMapping[repo.language]) {
              framework = {
                name: repo.language,
                icon: langIconMapping[repo.language]
              };
            }
          }
        } catch (e) {
          // Silently fail for content check (might be empty repo)
        }

        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          topics: repo.topics || [],
          updated_at: repo.updated_at || "",
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          framework,
          owner_avatar: repo.owner.avatar_url,
          recent_commits: recentCommits,
        } as Repository;
      })
    );

    return detailedRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
};

export const getGithubRepos = (username: string) =>
  unstable_cache(
    async () => fetchGithubRepos(username),
    [`github-repos-v4-${username}`],
    {
      revalidate: githubConfig.revalidate,
      tags: ["github-repos"],
    }
  )();
