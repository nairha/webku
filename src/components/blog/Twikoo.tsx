"use client";

import React, { useEffect, useState } from "react";
import { Column, Text } from "@once-ui-system/core";
import Script from "next/script";

interface TwikooProps {
  lang?: string;
}

interface Comment {
  id: string;
  nick: string;
  email?: string;
  website?: string;
  content: string;
  created_at: string;
}

export const Twikoo: React.FC<TwikooProps> = ({ lang = "id" }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [path, setPath] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Current URL path
    const currentPath = window.location.pathname;
    setPath(currentPath);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Column fillWidth gap="24" marginTop="40" id="comments">
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-twikoo-container {
          width: 100%;
        }
        .tk-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
          background: var(--neutral-alpha-weak);
          border: 1px solid var(--neutral-alpha-medium);
          padding: 20px;
          border-radius: 12px;
          opacity: 0.7;
          position: relative;
        }
        .tk-inputs {
          display: flex;
          gap: 12px;
        }
        .tk-inputs input {
          flex: 1;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--neutral-alpha-medium);
          background: var(--neutral-alpha-weak);
          color: var(--neutral-on-background-strong);
          outline: none;
          min-width: 0;
        }
        .tk-textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--neutral-alpha-medium);
          background: var(--neutral-alpha-weak);
          color: var(--neutral-on-background-strong);
          resize: vertical;
          outline: none;
          font-family: inherit;
        }
        .tk-submit-col {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
        }
        .tk-submit-btn {
          background: var(--neutral-alpha-medium);
          color: var(--neutral-on-background-weak);
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          cursor: not-allowed;
          font-weight: 500;
        }
        .tk-disabled-msg {
          color: var(--brand-on-background-strong);
          font-weight: 500;
          font-size: 0.9em;
        }
        .tk-comment-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .tk-comment {
          padding-bottom: 20px;
          border-bottom: 1px solid var(--neutral-alpha-weak);
        }
        .tk-comment-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .tk-nick {
          font-weight: 600;
          color: var(--brand-on-background-strong);
        }
        .tk-time {
          font-size: 0.85em;
          color: var(--neutral-on-background-weak);
        }
        .tk-content {
          color: var(--neutral-on-background-medium);
          line-height: 1.6;
          white-space: pre-wrap;
        }
        @media (max-width: 600px) {
          .tk-inputs {
            flex-direction: column;
          }
        }
      `}} />

      <Text as="h2" variant="heading-strong-l">
        {lang === "id" ? "Komentar" : lang === "zh" ? "评论" : "Comments"}
      </Text>

      <div className="custom-twikoo-container">
        {/* Form Komentar - Disabled State */}
        <form className="tk-form" onSubmit={(e) => e.preventDefault()}>
          <div className="tk-inputs">
            <input
              disabled
              type="text"
              placeholder={lang === "id" ? "Nama Pengguna *" : "Nickname *"}
              value={nick}
              readOnly
            />
            <input
              disabled
              type="email"
              placeholder={lang === "id" ? "Email (Opsional)" : "Email (Optional)"}
              value={email}
              readOnly
            />
            <input
              disabled
              type="url"
              placeholder={lang === "id" ? "Website (Opsional)" : "Website (Optional)"}
              value={website}
              readOnly
            />
          </div>
          <textarea
            disabled
            className="tk-textarea"
            placeholder={lang === "id" 
              ? "Untuk menghindari spam, fitur komentar dinonaktifkan sementara. Jika ingin memberikan feedback, silakan hubungi melalui media sosial atau buka issue di GitHub." 
              : lang === "zh"
              ? "为了防止垃圾信息，评论功能已暂时关闭。如果您想提供反馈，请通过社交媒体联系我或在 GitHub 上提交 Issue。"
              : "To prevent spam, the comment feature is temporarily disabled. If you'd like to provide feedback, please contact me via social media or open an issue on GitHub."
            }
            readOnly
          />
          <div className="tk-submit-col">
            <span className="tk-disabled-msg">
              {lang === "id" ? "Komentar Dinonaktifkan" : "Comments Disabled"}
            </span>
            <button type="button" className="tk-submit-btn" disabled>
              {lang === "id" ? "Kirim Komentar" : "Send Comment"}
            </button>
          </div>
        </form>

        {/* Daftar Komentar */}
        <div className="tk-comment-list">
          {comments.length === 0 ? (
            <Text onBackground="neutral-weak" variant="body-default-m">
              {lang === "id" ? "Fitur komentar fitur dinonaktifkan." : "Comment feature is disabled."}
            </Text>
          ) : (
            comments.map((cmd) => (
              <div key={cmd.id} className="tk-comment">
                <div className="tk-comment-head">
                  <span className="tk-nick">
                    {cmd.website ? (
                      <a href={cmd.website} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>{cmd.nick}</a>
                    ) : (
                      cmd.nick
                    )}
                  </span>
                  <span className="tk-time">{formatDate(cmd.created_at)}</span>
                </div>
                <div className="tk-content">{cmd.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </Column>
  );
};
