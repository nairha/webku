"use client";

import { useState } from "react";
import { Column, Row, Text, Heading, Icon, Button } from "@once-ui-system/core";

interface FriendRequestModalProps {
  lang: string;
  onClose: () => void;
}

const SITE_INFO = {
  name: "Davin's Blog",
  nickname: "Davin",
  description: "Never say never.",
  url: "https://davingm.com",
  avatar: "https://davingm.com/images/author.jpg",
};

const i18n = {
  id: {
    title: "Ajukan Pertemanan",
    subtitle: "Isi informasi website kamu di bawah ini",
    siteName: "Nama Website",
    siteNamePlaceholder: "Contoh: Blog Nairha",
    nickname: "Nama Panggilan",
    nicknamePlaceholder: "Contoh: Rha",
    description: "Deskripsi Singkat",
    descriptionPlaceholder: "Contoh: jawa jawa jawa.",
    url: "URL Website",
    urlPlaceholder: "https://example.com",
    avatar: "URL Avatar / gravatar.com",
    avatarPlaceholder: "https://example.com/avatar.png",
    siteInfoTitle: "Info Situs Ini (untuk dipasang di website kamu)",
    submit: "Kirim Permintaan",
    submitting: "Mengirim...",
    cancel: "Batal",
    success: "Permintaan berhasil dikirim! Akan direview secara manual.",
    required: "Wajib diisi",
    invalidUrl: "Format URL tidak valid",
  },
  en: {
    title: "Request Friendship",
    subtitle: "Fill in your website information below",
    siteName: "Website Name",
    siteNamePlaceholder: "e.g. Kinn's Blog",
    nickname: "Nickname",
    nicknamePlaceholder: "e.g. Kinn",
    description: "Short Description",
    descriptionPlaceholder: "e.g. Never say never.",
    url: "Website URL",
    urlPlaceholder: "https://example.com",
    avatar: "Avatar / gravatar.com",
    avatarPlaceholder: "https://example.com/avatar.png",
    siteInfoTitle: "This Site's Info (to add on your website)",
    submit: "Send Request",
    submitting: "Sending...",
    cancel: "Cancel",
    success: "Request sent successfully! It will be reviewed manually.",
    required: "Required",
    invalidUrl: "Invalid URL format",
  },
  cn: {
    title: "申请友链",
    subtitle: "请填写您的网站信息",
    siteName: "网站名称",
    siteNamePlaceholder: "Vio's Blog",
    nickname: "昵称",
    nicknamePlaceholder: "例如：Vion you",
    description: "简短描述",
    descriptionPlaceholder: "例如：Never say never.",
    url: "网站地址",
    urlPlaceholder: "https://example.com",
    avatar: "头像 / gravatar.com",
    avatarPlaceholder: "https://example.com/avatar.png",
    siteInfoTitle: "本站信息（请添加到您的网站）",
    submit: "发送申请",
    submitting: "发送中...",
    cancel: "取消",
    success: "申请已成功发送！将进行人工审核。",
    required: "必填",
    invalidUrl: "URL 格式无效",
  },
};

export function FriendRequestModal({ lang, onClose }: FriendRequestModalProps) {
  const t = i18n[lang as keyof typeof i18n] || i18n.id;

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    description: "",
    url: "",
    avatar: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.url.trim()) {
      e.url = t.required;
    } else {
      try {
        const p = new URL(form.url);
        if (!["http:", "https:"].includes(p.protocol)) e.url = t.invalidUrl;
      } catch {
        e.url = t.invalidUrl;
      }
    }
    if (!form.avatar.trim()) {
      e.avatar = t.required;
    } else {
      try {
        new URL(form.avatar);
      } catch {
        e.avatar = t.invalidUrl;
      }
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.message || data.error || "Error");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  const handleCopy = () => {
    const text = `name: "${SITE_INFO.name}", nickname: "${SITE_INFO.nickname}", description: "${SITE_INFO.description}", url: "${SITE_INFO.url}", avatar: "${SITE_INFO.avatar}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "var(--page-background)",
          border: "1px solid var(--neutral-alpha-weak)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--neutral-medium)",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon name="close" size="s" />
        </button>

        {status === "success" ? (
          <Column gap="24" horizontal="center" align="center" paddingY="32">
            <div style={{ fontSize: "48px" }}>🎉</div>
            <Heading variant="heading-strong-m" align="center">{t.success}</Heading>
            <Button variant="secondary" onClick={onClose}>OK</Button>
          </Column>
        ) : (
          <form onSubmit={handleSubmit}>
            <Column gap="24">
              <Column gap="8">
                <Heading variant="heading-strong-l">{t.title}</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">{t.subtitle}</Text>
              </Column>

              {/* Site info to copy */}
              <div style={{
                background: "var(--neutral-alpha-weak)",
                border: "1px solid var(--neutral-alpha-medium)",
                borderRadius: "12px",
                padding: "16px",
              }}>
                <Row gap="8" vertical="center" marginBottom="12">
                  <Icon name="link" size="xs" onBackground="brand-medium" />
                  <Text variant="label-strong-s" onBackground="brand-medium">{t.siteInfoTitle}</Text>
                </Row>
                <Column gap="4">
                  {Object.entries(SITE_INFO).map(([k, v]) => (
                    <Row key={k} gap="8">
                      <Text variant="label-strong-xs" onBackground="neutral-weak" style={{ minWidth: "80px" }}>{k}:</Text>
                      <Text variant="body-default-xs" style={{ wordBreak: "break-all" }}>{v}</Text>
                    </Row>
                  ))}
                </Column>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    marginTop: "12px",
                    background: "var(--brand-alpha-weak)",
                    border: "1px solid var(--brand-alpha-medium)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    color: "var(--brand-strong)",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Icon name={copied ? "check" : "copy"} size="xs" />
                  {copied ? "Copied!" : "Copy Info"}
                </button>
              </div>

              {/* Form fields */}
              <Column gap="16">
                <FieldInput
                  label={t.siteName}
                  placeholder={t.siteNamePlaceholder}
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => { setForm(f => ({ ...f, name: v })); setErrors(e => ({ ...e, name: "" })); }}
                />
                <FieldInput
                  label={t.nickname}
                  placeholder={t.nicknamePlaceholder}
                  value={form.nickname}
                  onChange={(v) => setForm(f => ({ ...f, nickname: v }))}
                />
                <FieldInput
                  label={t.description}
                  placeholder={t.descriptionPlaceholder}
                  value={form.description}
                  onChange={(v) => setForm(f => ({ ...f, description: v }))}
                />
                <FieldInput
                  label={t.url}
                  placeholder={t.urlPlaceholder}
                  value={form.url}
                  error={errors.url}
                  onChange={(v) => { setForm(f => ({ ...f, url: v })); setErrors(e => ({ ...e, url: "" })); }}
                />
                <FieldInput
                  label={t.avatar}
                  placeholder={t.avatarPlaceholder}
                  value={form.avatar}
                  error={errors.avatar}
                  onChange={(v) => { setForm(f => ({ ...f, avatar: v })); setErrors(e => ({ ...e, avatar: "" })); }}
                />
              </Column>

              {status === "error" && (
                <div style={{
                  background: "var(--danger-alpha-weak)",
                  border: "1px solid var(--danger-alpha-medium)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                }}>
                  <Text variant="body-default-s" onBackground="danger-medium">{errorMsg}</Text>
                </div>
              )}

              <Row gap="12" horizontal="end">
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "1px solid var(--neutral-alpha-medium)",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "var(--neutral-medium)",
                    fontSize: "14px",
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    background: status === "loading" ? "var(--success-alpha-medium)" : "var(--success-strong)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 24px",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background 0.2s",
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      {t.submitting}
                    </>
                  ) : (
                    <>
                      <Icon name="send" size="xs" />
                      {t.submit}
                    </>
                  )}
                </button>
              </Row>
            </Column>
          </form>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>
    </div>
  );
}

function FieldInput({
  label,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <Column gap="8">
      <Text variant="label-strong-s">{label}</Text>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "var(--neutral-alpha-weak)",
          border: `1px solid ${error ? "var(--danger-strong)" : "var(--neutral-alpha-medium)"}`,
          borderRadius: "8px",
          padding: "10px 14px",
          color: "var(--neutral-strong)",
          fontSize: "14px",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = "var(--brand-strong)"; }}
        onBlur={(e) => { e.target.style.borderColor = error ? "var(--danger-strong)" : "var(--neutral-alpha-medium)"; }}
      />
      {error && <Text variant="body-default-xs" onBackground="danger-medium">{error}</Text>}
    </Column>
  );
}
