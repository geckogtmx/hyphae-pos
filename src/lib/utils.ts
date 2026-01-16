import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Mini-CVA implementation since npm install is failing
export function cva(base: string, config: any) {
    return (props: any) => {
        const { variants, defaultVariants, compoundVariants } = config;
        const result = [base];

        // Handle variants
        if (variants) {
            Object.keys(variants).forEach(key => {
                const value = props?.[key] || defaultVariants?.[key];
                if (value && variants[key][value]) {
                    result.push(variants[key][value]);
                }
            });
        }

        // Handle compound variants (simple implementation)
        if (compoundVariants) {
            compoundVariants.forEach((cv: any) => {
                const { className, ...matchers } = cv;
                const isMatch = Object.entries(matchers).every(([key, val]) => {
                    const propVal = props?.[key] || defaultVariants?.[key];
                    return propVal === val;
                });
                if (isMatch) result.push(className);
            });
        }

        return cn(...result, props?.className);
    };
}
