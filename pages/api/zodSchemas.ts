import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const Claimer = z.object({
  id: z.string().uuid(),
  address: z.string(),
  amount: z.number(),
  proof: z.string().optional(),
});

export type Claimer = z.infer<typeof Claimer>;

const NFTBase = z.object({
  identifier: z.string(),
  collection: z.string(),
  contract: z.string(),
  token_standard: z.string(),
  name: z.string(),
  description: z.string(),
  image_url: z.string(),
  metadata_url: z.string(),
  opensea_url: z.string(),
  updated_at: z.string(),
  is_disabled: z.boolean(),
  is_nsfw: z.boolean(),
});

export type NFT = z.infer<typeof NFTBase>;

export const Trait = z.object({
  trait_type: z.string(),
  display_type: z.number(),
  max_value: z.string(),
  value: z.number(),
});

export const Owner = z.object({
  address: z.string(),
  quantity: z.number(),
});

export const Rarity = z.object({
  strategy_version: z.string(),
  rank: z.number(),
  score: z.number(),
  calculated_at: z.string(),
  max_rank: z.number(),
  total_supply: z.number(),
  ranking_features: z.object({
    unique_attribute_count: z.number(),
  }),
});

export const NFTExpanded = z.object({
  nft: z.object({
    identifier: z.string(),
    collection: z.string(),
    contract: z.string(),
    token_standard: z.string(),
    name: z.string(),
    description: z.string(),
    image_url: z.string(),
    metadata_url: z.string(),
    opensea_url: z.string(),
    updated_at: z.string(),
    is_disabled: z.boolean(),
    is_nsfw: z.boolean(),
    animation_url: z.string(),
    is_suspicious: z.boolean(),
    creator: z.string(),
    traits: z.array(Trait),
    owners: z.array(Owner),
    rarity: Rarity,
  }),
});

export type NFTExpanded = z.infer<typeof NFTExpanded>;

export const NFTsBy = z.object({
  nfts: z.array(NFTBase),
  next: z
    .string()
    .optional()
    .describe(
      "if used in the next GET request, the next page of nfts will be retrieved according to specified limit"
    ),
});

export type NFTsBy = z.infer<typeof NFTsBy>;
