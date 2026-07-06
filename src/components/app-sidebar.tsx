import { Search } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/base/sidebar'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import {
  ALL_CATEGORY,
  ALL_CATEGORY_META,
  CATEGORIES,
  countsByCategory,
  registry,
} from '@/registry'

export function AppSidebar() {
  const { category, setCategory, query, setQuery } = useCatalogParams()

  const items = [
    { ...ALL_CATEGORY_META, count: registry.length },
    ...CATEGORIES.map((c) => ({ ...c, count: countsByCategory[c.id] ?? 0 })),
  ]

  return (
    <Sidebar>
      <SidebarHeader className="gap-2">
        <div className="px-2 pt-1">
          <h1 className="text-base font-semibold">UI/UX Collections</h1>
          <p className="text-xs text-muted-foreground">A gallery of components & effects</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components…"
            className="pl-8"
            aria-label="Search components"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon
                const isActive =
                  category === item.id ||
                  (item.id === ALL_CATEGORY && category === ALL_CATEGORY)
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setCategory(item.id)}
                      tooltip={item.label}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
