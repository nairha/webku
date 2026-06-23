"use client";

import {
  Column,
  Flex,
  Heading,
  Icon,
  Row,
  Text,
  SmartLink,
  Tag,
  RevealFx,
  Grid,
  Avatar,
} from "@once-ui-system/core";
import { Repository } from "@/utils/github";
import { formatDate } from "@/utils/formatDate";

interface GitHubRepoListProps {
  repos: Repository[];
}

export const GitHubRepoList: React.FC<GitHubRepoListProps> = ({ repos }) => {
  const getIconName = (frameworkName: string, icon: string): any => {
    const mapping: Record<string, string> = {
      "Nuxt": "nuxt",
      "Next.js": "nextjs",
      "Vue": "vue",
      "React": "reactapi",
      "Angular": "angular",
      "Svelte": "svelte",
      "Laravel": "laravel",
      "CodeIgniter 4": "codeigniter",
      "CodeIgniter 3": "codeigniter",
      "Spring Boot": "springboot",
      "Vocaloid (VPR)": "vocaloid",
      "C++": "cpp",
      "Python": "python",
      "Go": "go",
    };
    return mapping[frameworkName] || icon || "github";
  };

  return (
    <Grid
      columns="2"
      s={{ columns: 1 }}
      fillWidth
      gap="24"
      paddingTop="20"
      paddingX="m"
      style={{ overflow: 'hidden' }}
    >
      {repos.map((repo, index) => (
        <RevealFx key={repo.id} delay={index * 0.05} translateY="16">
          <Column
            fillWidth
            padding="24"
            s={{ style: { padding: "var(--spacing-16)" } }}
            radius="xl"
            background="neutral-alpha-weak"
            className="premium-card"
            style={{
              height: '100%',
              border: '1px solid var(--neutral-alpha-weak)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Tech Icon */}
            {repo.framework && (
              <div style={{
                position: 'absolute',
                bottom: '-100px',
                right: '-100px',
                opacity: 0.06,
                transform: 'rotate(-20deg)',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                <Icon
                  name={getIconName(repo.framework.name, repo.framework.icon)}
                  style={{ width: '400px', height: '400px', fontSize: '400px' }}
                  onBackground="brand-strong"
                />
              </div>
            )}

            <Column fillWidth style={{ zIndex: 1 }}>
              <Row horizontal="between" vertical="center" marginBottom="16" gap="12">
                <Avatar
                  src={repo.owner_avatar || `https://github.com/${repo.html_url.split('/')[3]}.png`}
                  size="l"
                  style={{ border: '2px solid var(--neutral-alpha-weak)' }}
                />
                
                <Row gap="12" vertical="center" style={{ flexShrink: 0 }}>
                  <Row gap="4" vertical="center">
                    <Icon name="star" size="xs" onBackground="neutral-weak" />
                    <Text variant="label-strong-s" onBackground="neutral-strong">{repo.stargazers_count}</Text>
                  </Row>
                  <Row gap="4" vertical="center" m={{ hide: true }}>
                    <Icon name="git-fork" size="xs" onBackground="neutral-weak" />
                    <Text variant="label-strong-s" onBackground="neutral-strong">{repo.forks_count}</Text>
                  </Row>
                </Row>
              </Row>

              <Column gap="8" marginBottom="16">
                <SmartLink href={repo.html_url} target="_blank" style={{ textDecoration: 'none', maxWidth: '100%' }}>
                  <Heading 
                    variant="heading-strong-l" 
                    style={{ 
                      letterSpacing: '-0.02em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {repo.name}
                  </Heading>
                </SmartLink>
                <Row gap="8" vertical="center" wrap>
                  {repo.language && (
                    <Tag size="s" variant="neutral">
                      <span style={{ opacity: 0.8, fontSize: '8px' }}>●</span> {repo.language}
                    </Tag>
                  )}
                  {repo.framework && (
                    <Tag size="s" variant="brand">
                      {repo.framework.name}
                    </Tag>
                  )}
                </Row>
              </Column>

              {repo.description && (
                <Text
                  variant="body-default-s"
                  onBackground="neutral-medium"
                  marginBottom="20"
                  style={{ 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {repo.description}
                </Text>
              )}

              {repo.recent_commits.length > 0 && (
                <Column gap="8" paddingX="4" marginBottom="16">
                  <Row gap="8" vertical="center" marginBottom="4">
                    <Icon name="history" size="xs" onBackground="neutral-weak" />
                    <Text variant="label-strong-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.05em' }}>
                      RECENT UPDATE
                    </Text>
                  </Row>
                  <Column gap="8">
                    {repo.recent_commits.slice(0, 1).map((commit) => (
                      <Row key={commit.sha} gap="8" vertical="center">
                        <Text variant="body-default-xs" onBackground="neutral-strong" style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: 1
                        }}>
                          {commit.message}
                        </Text>
                        <Text variant="body-default-xs" onBackground="brand-medium" style={{ flexShrink: 0, opacity: 0.7 }}>
                          {formatDate(commit.date)}
                        </Text>
                      </Row>
                    ))}
                  </Column>
                </Column>
              )}
            </Column>

            <Row horizontal="end" marginTop="12" paddingX="4" style={{ zIndex: 1 }}>
              <Text variant="body-default-xs" onBackground="neutral-weak" style={{ fontStyle: 'italic' }}>
                Updated {formatDate(repo.updated_at)}
              </Text>
            </Row>
          </Column>
        </RevealFx>
      ))}
    </Grid>
  );
};
