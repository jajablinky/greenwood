import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import * as S from "./styles"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <S.TabsRoot
      data-slot="tabs"
      data-orientation={orientation}
      className={className}
      {...props}
    />
  )
}

function TabsIndicator({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.Indicator.Props & { variant?: "default" | "line" }) {
  return (
    <S.TabsIndicatorEl
      data-slot="tabs-indicator"
      $variant={variant}
      className={className}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & { variant?: "default" | "line" }) {
  return (
    <S.TabsListEl
      data-slot="tabs-list"
      data-variant={variant}
      $variant={variant}
      className={className}
      {...props}
    >
      {children}
      <TabsIndicator variant={variant} />
    </S.TabsListEl>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <S.TabsTriggerEl
      data-slot="tabs-trigger"
      className={className}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <S.TabsContentEl data-slot="tabs-content" className={className} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator }
