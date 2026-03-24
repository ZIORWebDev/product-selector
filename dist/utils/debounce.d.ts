type Debounced<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
export declare function debounce<T extends (...args: any[]) => void>(fn: T, delay?: number): Debounced<T>;
export {};
//# sourceMappingURL=debounce.d.ts.map