import { AppSidebar } from '@/components/app-sidebar'
import { ComponentGallery } from '@/components/component-gallery'
import { ModeToggle } from '@/components/mode-toggle'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/base/sidebar'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { ALL_CATEGORY, ALL_CATEGORY_META, CATEGORIES } from '@/registry'

function ActiveTitle() {
  const { category } = useCatalogParams()
  const label =
    category === ALL_CATEGORY
      ? ALL_CATEGORY_META.label
      : (CATEGORIES.find((c) => c.id === category)?.label ?? category)
  return <h2 className="text-sm font-medium">{label}</h2>
}

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <ActiveTitle />
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col p-6">
          <ComponentGallery />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
