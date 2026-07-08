# react-native-profile-sticky-tab

Componente de abas com header fixo e área de perfil recolhível para React Native.

A biblioteca combina `react-native-tab-view`, `react-native-reanimated` e listas animadas para entregar uma experiência comum em telas de perfil: um header fixo no topo, uma área de informações que recolhe com o scroll e abas com posição sincronizada entre `FlatList`, `FlashList` e `ScrollView`.

## Demos

### Exemplo básico

![](https://github.com/ruiluucas/react-native-profile-sticky-tab/docs/example.mp4)

![](https://github.com/ruiluucas/react-native-profile-sticky-tab/docs/instagram-example.mp4)

## Recursos

- Header fixo no topo da tela.
- Área de perfil recolhível abaixo do header.
- Tab bar integrada ao `react-native-tab-view`.
- Sincronização de scroll entre abas.
- Suporte a `FlatList`, `FlashList` e `ScrollView`.
- Controle programático via `useStickyTab`.
- Scroll animado na thread de UI com Reanimated.
- API composável para tab bars customizadas.

## Instalação

```bash
npm install react-native-profile-sticky-tab
```

Instale também as peer dependencies:

```bash
npm install react-native-reanimated react-native-tab-view @shopify/flash-list
```

Se o seu projeto ainda não usa Reanimated, finalize a configuração exigida pelo `react-native-reanimated` no app, incluindo o plugin do Babel quando necessário.

## Uso Básico

```tsx
import ProfileStickyTab from "react-native-profile-sticky-tab";
import { Text, View } from "react-native";
import { TabBar } from "react-native-tab-view";

const DATA = Array.from({ length: 40 }, (_, index) => ({
  id: String(index),
  title: `Post ${index + 1}`,
}));

export function ProfileScreen() {
  return (
    <ProfileStickyTab.Provider>
      <ProfileStickyTab
        header={<View style={{ height: 72, backgroundColor: "#111827" }} />}
        renderTabBar={(props) => <TabBar {...props} />}
        tabKeyScenes={[
          {
            key: "posts",
            title: "Posts",
            renderComponent: (stickyTab) => (
              <ProfileStickyTab.FlatList
                stickyTab={stickyTab}
                data={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text style={{ padding: 16 }}>{item.title}</Text>
                )}
              />
            ),
          },
          {
            key: "about",
            title: "Sobre",
            renderComponent: (stickyTab) => (
              <ProfileStickyTab.ScrollView stickyTab={stickyTab}>
                <Text style={{ padding: 16 }}>
                  Conteúdo da aba Sobre
                </Text>
              </ProfileStickyTab.ScrollView>
            ),
          },
        ]}
      >
        <View style={{ height: 220, backgroundColor: "#2563eb" }}>
          <Text style={{ color: "white", padding: 16, fontSize: 24 }}>
            Rui Lucas
          </Text>
          <Text style={{ color: "white", paddingHorizontal: 16 }}>
            Desenvolvedor React Native
          </Text>
        </View>
      </ProfileStickyTab>
    </ProfileStickyTab.Provider>
  );
}
```

## Como a Estrutura Funciona

```tsx
<ProfileStickyTab.Provider>
  <ProfileStickyTab
    header={<Header />}
    renderTabBar={(props) => <TabBar {...props} />}
    tabKeyScenes={scenes}
  >
    <ProfileInfo />
  </ProfileStickyTab>
</ProfileStickyTab.Provider>
```

`ProfileStickyTab.Provider` guarda os estados compartilhados de scroll, aba ativa e alturas do layout.

`header` fica fixo no topo da tela.

`children` representa a área recolhível, normalmente foto, bio, estatísticas ou ações do perfil.

`tabKeyScenes` define as abas e o componente renderizado em cada uma.

Cada cena precisa renderizar um container da biblioteca e repassar o `stickyTab` recebido em `renderComponent`.

## Containers de Aba

### FlatList

Use quando a aba renderiza uma lista padrão do React Native.

```tsx
<ProfileStickyTab.FlatList
  stickyTab={stickyTab}
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item item={item} />}
/>
```

### FlashList

Use quando a aba renderiza listas grandes e você quer usar `@shopify/flash-list`.

```tsx
<ProfileStickyTab.FlashList
  stickyTab={stickyTab}
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item item={item} />}
  estimatedItemSize={80}
/>
```

### ScrollView

Use quando a aba possui conteúdo livre, menor ou mais estático.

```tsx
<ProfileStickyTab.ScrollView stickyTab={stickyTab}>
  <ProfileDetails />
</ProfileStickyTab.ScrollView>
```

## Controle Programático

Use `useStickyTab` em qualquer componente renderizado dentro do `ProfileStickyTab.Provider`.

```tsx
import { useStickyTab } from "react-native-profile-sticky-tab";
import { Pressable, Text, View } from "react-native";

export function CustomActions() {
  const {
    currentTab,
    setTab,
    scrollToY,
    collapseHeader,
    expandHeader,
  } = useStickyTab();

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Pressable onPress={() => setTab(0)}>
        <Text style={{ fontWeight: currentTab === 0 ? "700" : "400" }}>
          Posts
        </Text>
      </Pressable>

      <Pressable onPress={() => setTab(1)}>
        <Text style={{ fontWeight: currentTab === 1 ? "700" : "400" }}>
          Sobre
        </Text>
      </Pressable>

      <Pressable onPress={() => collapseHeader(true)}>
        <Text>Recolher header</Text>
      </Pressable>

      <Pressable onPress={() => expandHeader(true)}>
        <Text>Expandir header</Text>
      </Pressable>

      <Pressable onPress={() => scrollToY(300, true)}>
        <Text>Scroll para Y 300</Text>
      </Pressable>
    </View>
  );
}
```

Também é possível acessar o hook pelo namespace do componente:

```tsx
const stickyTab = ProfileStickyTab.useStickyTab();
```

## API do Hook

| Retorno | Tipo | Descrição |
| --- | --- | --- |
| `currentTab` | `number` | Índice da aba ativa no estado React. |
| `setTab` | `(index: number) => void` | Altera a aba ativa programaticamente. |
| `scrollToY` | `(y: number, animated?: boolean) => void` | Rola a aba ativa para uma posição vertical. |
| `collapseHeader` | `(animated?: boolean) => void` | Rola até o limite que recolhe a área de perfil. |
| `expandHeader` | `(animated?: boolean) => void` | Volta o scroll para o topo e expande a área de perfil. |

## Props

### `ProfileStickyTab`

| Prop | Tipo | Descrição |
| --- | --- | --- |
| `header` | `ReactNode` | Conteúdo fixo no topo da tela. |
| `children` | `ReactNode` | Conteúdo recolhível abaixo do header. |
| `renderTabBar` | `(props) => ReactNode` | Função que renderiza a tab bar do `react-native-tab-view`. |
| `tabKeyScenes` | `TabScene[]` | Lista de abas e seus respectivos componentes. |

### `TabScene`

```ts
type TabScene = {
  key: string;
  title: string;
  renderComponent: (stickyTab: StickyTabType) => ReactNode;
  icon?: (color: string) => ReactNode;
};

type StickyTabType = {
  key: string;
  index: number;
};
```

### Containers

Todos os containers recebem a prop obrigatória `stickyTab`.

| Componente | Props adicionais |
| --- | --- |
| `ProfileStickyTab.FlatList` | Props de `Animated.FlatList`. |
| `ProfileStickyTab.FlashList` | Props de `@shopify/flash-list`. |
| `ProfileStickyTab.ScrollView` | Props de `Animated.ScrollView` e `children`. |

## Exports

```tsx
import ProfileStickyTab, {
  ProfileStickyTab as NamedProfileStickyTab,
  useStickyTab,
} from "react-native-profile-sticky-tab";

import type {
  ProfileStickyTabProps,
  ProfileStickyTabFlatListProps,
  ProfileStickyTabFlashListProps,
  ProfileStickyTabScrollViewProps,
} from "react-native-profile-sticky-tab";
```

## Boas Práticas

- Envolva a tela com `ProfileStickyTab.Provider`.
- Use `ProfileStickyTab.FlatList`, `ProfileStickyTab.FlashList` ou `ProfileStickyTab.ScrollView` dentro de cada `renderComponent`.
- Sempre repasse o objeto `stickyTab` recebido pela cena para o container da aba.
- Use `FlashList` em listas grandes e informe `estimatedItemSize`.
- Use `useStickyTab` somente dentro do provider.
- Evite controlar manualmente o scroll das listas por fora se o objetivo for sincronizar com o header recolhível.

## Exemplo Local

Este repositório inclui um exemplo em `example/index.tsx`.

Para rodar o projeto localmente:

```bash
npm install
npm run start
```

Para checar a tipagem:

```bash
npm run build
```

## Licença

MIT
