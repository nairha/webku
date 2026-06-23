"use client";

import { useEffect, useState } from "react";
import { Flex, Text, Heading, Column, RevealFx } from "@once-ui-system/core";
import confetti from "canvas-confetti";

export const RamadhanGreeting = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasShown = sessionStorage.getItem("ramadhan-greeting-1447");
        if (!hasShown) {
            setShow(true);
            sessionStorage.setItem("ramadhan-greeting-1447", "true");

            // Confetti "Shower" Effect (More like Google/GitHub falling effect)
            const duration = 4 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 0, spread: 360, ticks: 100, zIndex: 10001, gravity: 0.5, scalar: 0.75 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }

                const particleCount = 5;
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
                });
            }, 100);

            // Hide after 5 seconds
            const timer = setTimeout(() => {
                setShow(false);
            }, 5000);

            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, []);

    if (!show) return null;

    return (
        <Flex
            position="fixed"
            fillWidth
            fillHeight
            horizontal="center"
            vertical="center"
            style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
                zIndex: 10000,
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            <RevealFx speed="slow" translateY="20">
                <Column horizontal="center" align="center" gap="16" padding="xl" style={{ textAlign: 'center', width: '100%' }}>
                    <Text variant="label-strong-m" onBackground="brand-strong" style={{ letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                        Holy Month
                    </Text>
                    <Heading variant="display-strong-l" align="center">
                        <span key="marhaban-line1">Marhaban ya</span> <br key="marhaban-br" />
                        <Text as="span" onBackground="brand-strong" key="marhaban-ramadhan">Ramadhan 1447 H</Text>
                    </Heading>
                    <Text variant="heading-default-m" onBackground="neutral-weak" align="center" style={{ maxWidth: '400px' }}>
                        Selamat menunaikan ibadah puasa. Semoga bulan suci ini membawa keberkahan dan kedamaian.
                    </Text>
                </Column>
            </RevealFx>
        </Flex>
    );
};
