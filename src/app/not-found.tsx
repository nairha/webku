import { Column, Heading, Text, Button } from "@once-ui-system/core";
import { Providers } from "@/components";

export default function NotFound() {
  return (
    <Providers>
      <Column as="section" fill horizontal="center" vertical="center" paddingBottom="160" gap="24">
        <Text
          variant="display-strong-xl"
          style={{
            fontSize: "clamp(8rem, 20vw, 12rem)",
            lineHeight: "1",
            background: "linear-gradient(135deg, var(--brand-solid-strong), var(--accent-solid-strong))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: 0.8,
            filter: "drop-shadow(0 0 2rem var(--brand-alpha-medium))",
          }}
        >
          404
        </Text>
        <Column horizontal="center" gap="8">
          <Heading variant="display-default-xs">
            Halaman Tidak Ditemukan
          </Heading>
          <Text onBackground="neutral-weak" variant="body-default-l">
            Sepertinya Anda tersesat di dimensi yang salah.
          </Text>
        </Column>
        <Button
          href="/"
          variant="primary"
          size="l"
          prefixIcon="home"
          arrowIcon
        >
          Kembali ke Beranda
        </Button>
      </Column>
    </Providers>
  );
}
