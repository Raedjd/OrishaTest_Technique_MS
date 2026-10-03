"use client";

import { motion } from "framer-motion";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    showTagline?: boolean;
    variant?: "light" | "default";
}

// Couleurs de la charte Orisha
const ORISHA = {
    purple: "#4b2c82",
    magenta: "#e5007d",
    yellow: "#ffc93c",
};


const HalftoneTriangle = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span
        aria-hidden="true"
        className={`pointer-events-none block ${className}`}
        style={{
            background: `linear-gradient(180deg, ${ORISHA.yellow} 0%, ${ORISHA.magenta} 50%, ${ORISHA.yellow} 100%)`,
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            WebkitMaskImage: "radial-gradient(circle, #000 0 32%, transparent 36%)",
            maskImage: "radial-gradient(circle, #000 0 32%, transparent 36%)",
            WebkitMaskSize: "0.09em 0.09em",
            maskSize: "0.09em 0.09em",
            ...style,
        }}
    />
);

const Logo = ({
                  size = "md",
                  showText = true,
                  showTagline = true,
                  variant = "default",
              }: LogoProps): JSX.Element => {

    const sizeMap = {
        sm: { icon: 32, text: "text-2xl" },
        md: { icon: 48, text: "text-4xl" },
        lg: { icon: 64, text: "text-6xl" },
    };

    const { icon, text } = sizeMap[size];

    const textColorClass =
        variant === "light"
            ? "text-white"
            : "text-[#4b2c82] dark:text-white";

    // Mode icône seule (ex : sidebar repliée)
    if (!showText) {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative flex-shrink-0 flex items-center justify-center rounded-md ${
                    variant === "light" ? "bg-white/10" : "bg-[#4b2c82]/5 dark:bg-white/10"
                }`}
                style={{ width: icon, height: icon, fontSize: icon }}
            >
                <HalftoneTriangle
                    className="absolute"
                    style={{ width: "0.45em", height: "0.8em", left: "0.22em" }}
                />
                <span
                    className={`relative font-bold leading-none ${textColorClass}`}
                    style={{ fontSize: "0.55em" }}
                >
                    O
                </span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            className={`inline-flex flex-col items-end flex-shrink-0 select-none ${text} ${textColorClass}`}
        >
            <span
                className="font-bold leading-none whitespace-nowrap"
                style={{ letterSpacing: "0.06em" }}
            >
                OR
                {/* Trame dégradée derrière "IS", comme sur le logo officiel */}
                <span className="relative inline-block isolate">
                    <HalftoneTriangle
                        className="absolute top-1/2 -translate-y-1/2 -z-10"
                        style={{ left: "-0.08em", width: "1.05em", height: "1.6em" }}
                    />
                    IS
                </span>
                HA
            </span>

            {showTagline && (
                <span
                    className="font-normal leading-none whitespace-nowrap"
                    style={{ fontSize: "0.36em", marginTop: "0.25em" }}
                >
                    Commerce
                </span>
            )}
        </motion.div>
    );
};

export default Logo;