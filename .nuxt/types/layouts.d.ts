import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "loggedin"
declare module "../../node_modules/.pnpm/nuxt@3.13.1_@parcel+watcher@2.4.1_@types+node@22.5.2_ioredis@5.4.1_magicast@0.3.5_rollup@4.21_c5a23o2uglxixihmv33pyy7vza/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}