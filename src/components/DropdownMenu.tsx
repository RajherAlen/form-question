// components/DropdownMenu.tsx
import React, { useState, useRef, useEffect, createContext, useContext } from "react";

type DropdownContextType = {
    open: boolean;
    toggle: () => void;
    close: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
};

const DropdownCtx = createContext<DropdownContextType | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLElement | null>(null);

    const toggle = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);

    return (
        <DropdownCtx.Provider value={{ open, toggle, close, triggerRef }}>
            <div className="relative inline-block text-left">{children}</div>
        </DropdownCtx.Provider>
    );
}

export function DropdownMenuTrigger({
    asChild = false,
    children,
}: {
    asChild?: boolean;
    children: React.ReactElement<any>;
}) {
    const ctx = useContext(DropdownCtx);
    if (!ctx) throw new Error("DropdownMenuTrigger must be inside DropdownMenu");
    const { toggle, triggerRef } = ctx;

    if (asChild) {
        return React.cloneElement(children, {
            onClick: (e: React.MouseEvent) => {
                // safe call if child has its own onClick
                if (children.props.onClick) children.props.onClick(e);
                toggle();
            },
            ref: (node: HTMLElement) => {
                triggerRef.current = node;
                const { ref } = children as any;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
            },
        });
    }

    return (
        <button type="button" onClick={toggle} ref={triggerRef as React.Ref<HTMLButtonElement>}>
            {children}
        </button>
    );
}


export function DropdownMenuContent({
    children,
    align = "start",
    className = "",
}: {
    children: React.ReactNode;
    align?: "start" | "end";
    className?: string;
}) {
    const ctx = useContext(DropdownCtx);
    if (!ctx) throw new Error("DropdownMenuContent must be inside DropdownMenu");
    const { open, close, triggerRef } = ctx;
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const handleDocClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                ref.current &&
                !ref.current.contains(target) &&
                triggerRef.current &&
                !triggerRef.current.contains(target)
            ) {
                close();
            }
        };

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        document.addEventListener("mousedown", handleDocClick);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleDocClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [open, close, triggerRef]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[8rem] max-h-[300px] overflow-auto ${align === "end" ? "right-0" : "left-0"
                } ${className}`}
        >
            {children}
        </div>
    );
}

export function DropdownMenuItem({
    children,
    onClick,
    className = "",
}: {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent) => void;
    className?: string;
}) {
    const ctx = useContext(DropdownCtx);
    if (!ctx) throw new Error("DropdownMenuItem must be inside DropdownMenu");
    const { close } = ctx;

    const handle = (e: React.MouseEvent) => {
        onClick?.(e);
        setTimeout(() => close(), 0);
    };

    return (
        <button
            onClick={handle}
            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}
