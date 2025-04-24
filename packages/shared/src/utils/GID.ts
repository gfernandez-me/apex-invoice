export function parseGid(gid: string) {
  const GID = /\d+\/?/g;
  const arry = GID.exec(gid.toString());

  if (!arry || !arry[0]) {
    throw new Error('Parse GID error');
  }
  return Number(arry[0]);
}

export function productVariantGid(id: number | string) {
  return `gid://shopify/ProductVariant/${id}`;
}

export function customerGid(id: number | string) {
  return `gid://shopify/Customer/${id}`;
}
