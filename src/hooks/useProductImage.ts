import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ProductImage } from "@/lib/types";

const cache = new Map<number, string | null>();
const inFlight = new Map<number, Promise<string | null>>();

async function loadPrincipalImage(productId: number): Promise<string | null> {
  if (cache.has(productId)) return cache.get(productId)!;
  if (inFlight.has(productId)) return inFlight.get(productId)!;

  const promise = api
    .post("/product-image/list", { product_id: productId, principal: true })
    .then((res) => {
      const images = res.data.data.data as ProductImage[];
      const url = images[0]?.url ?? null;
      cache.set(productId, url);
      return url;
    })
    .finally(() => inFlight.delete(productId));

  inFlight.set(productId, promise);
  return promise;
}

export function useProductImage(productId: number): string | null {
  const [url, setUrl] = useState<string | null>(cache.get(productId) ?? null);

  useEffect(() => {
    let active = true;
    loadPrincipalImage(productId).then((result) => {
      if (active) setUrl(result);
    });
    return () => {
      active = false;
    };
  }, [productId]);

  return url;
}
