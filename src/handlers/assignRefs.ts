import { useCallback } from "react";

/**
 * Hook que mescla múltiplas refs em uma única função de callback.
 * Recebe refs como any[] para contornar conflitos de tipagem de bibliotecas (ex: Reanimated vs React Native),
 * mas preserva a segurança de tipo (T) no callback retornado.
 */
export function useMergeRefs<T>(...refs: any[]) {
  return useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (ref == null) return;

        if (typeof ref === "function") {
          ref(node);
        } else {
          try {
            ref.current = node;
          } catch (error) {
            console.warn("Falha ao mesclar ref:", error);
          }
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
