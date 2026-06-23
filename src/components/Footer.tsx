"use client";

import { Row, IconButton, SmartLink, Text, Icon } from "@once-ui-system/core";
import { getContent } from "@/resources";
import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import { SakanaWidget } from "./SakanaWidget";

export const Footer = () => {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/");
  const locale = segments[1] || "id";
  const { person: translatedPerson, social } = getContent(locale);

  return (
    <Row as="footer" fillWidth paddingX="8" paddingTop="8" paddingBottom="0" horizontal="center" s={{ direction: "column" }} position="relative">
      <SakanaWidget />
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          vertical: "center",
        }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© 2024 – Present {translatedPerson.name} — Licensed under </Text>
          <SmartLink href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style={{ color: 'inherit', textDecoration: 'underline' }}>
            CC BY-NC-SA 4.0
          </SmartLink>
          {" — "}
          <SmartLink href="/rss.xml" title="RSS Feed" style={{ color: 'inherit', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Icon name="rss" size="s" /> RSS
          </SmartLink>
        </Text>
        <Row gap="16" vertical="center">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>
      </Row>
      <div className={styles.scanContainer}>
        <img src="/images/scan/scan_light.png" className={styles.lightOnly} alt="Scan QR to visit my account Bilibili.com" />
        <img src="/images/scan/scan_dark.png" className={styles.darkOnly} alt="Scan QR to visit my account Bilibili.com" />
      </div>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
