import { ArrowLeft } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { ComponentDetails } from '@/components/component-details'
import { CatalogToolbar } from '@/components/catalog-toolbar'
import { ComponentGallery } from '@/components/component-gallery'
import { TagFilterBar } from '@/components/tag-filter-bar'
import { ModeToggle } from '@/components/mode-toggle'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/base/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/base/sidebar'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { useUrlParam } from '@/hooks/use-url-param'
import {
  ALL_CATEGORY,
  ALL_CATEGORY_META,
  CATEGORIES,
  getShowcase,
} from '@/registry'

function GalleryTitle() {
  const { category } = useCatalogParams()
  const label =
    category === ALL_CATEGORY
      ? ALL_CATEGORY_META.label
      : (CATEGORIES.find((c) => c.id === category)?.label ?? category)
  return <h2 className="text-sm font-medium">{label}</h2>
}

function App() {
  const [componentId, setComponent] = useUrlParam('component', '')
  const selected = componentId ? getShowcase(componentId) : undefined

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          {selected ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setComponent('')}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <>
              <SidebarTrigger />
              <GalleryTitle />
            </>
          )}
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-5 p-6">
          {selected ? (
            <ComponentDetails showcase={selected} />
          ) : (
            <>
              <CatalogToolbar />
              <TagFilterBar />
              <ComponentGallery />
            </>
          )}
        </main>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
