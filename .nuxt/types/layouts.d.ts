import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = string
declare module "../../node_modules/.pnpm/nuxt@3.13.0_@parcel+watcher@2.4.1_@types+node@22.5.2_ioredis@5.4.1_magicast@0.3.5_rollup@4.21_53zdip4ec53wrlbiawuczs7x7u/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}