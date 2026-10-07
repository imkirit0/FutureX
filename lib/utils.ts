/* Tiny className joiner; avoids a dependency for the common case. */
export function cn(...parts: Array<string | number | bigint | boolean | null | undefined>) {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
