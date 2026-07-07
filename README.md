# react-native-profile-sticky-tab

Componente de abas com cabeçalho fixo e área de perfil recolhível para React Native.

A biblioteca combina `react-native-tab-view` com listas animadas para manter o scroll sincronizado entre abas usando `react-native-reanimated`.

## Instalação

```bash
npm install react-native-profile-sticky-tab
```

Dependências usadas pela biblioteca:

```bash
npm install react-native-reanimated react-native-tab-view @shopify/flash-list
```

Se o projeto ainda não usa Reanimated, finalize a configuração exigida pelo `react-native-reanimated` no seu app.

## Uso

```tsx
import ProfileStickyTab from "react-native-profile-sticky-tab";
import { Text, View } from "react-native";
import { TabBar } from "react-native-tab-view";

export function ProfileScreen() {
  return (
    <ProfileStickyTab.Provider>
      <ProfileStickyTab
        header={<View style={{ height: 80, backgroundColor: "#111" }} />}
        renderTabBar={(props) => <TabBar {...props} />}
        tabKeyScenes={[
          {
            key: "posts",
            title: "Posts",
            renderComponent: (stickyTab) => (
              <ProfileStickyTab.FlatList
                stickyTab={stickyTab}
                data={Array.from({ length: 50 })}
                keyExtractor={(_, index) => String(index)}
                renderItem={({ index }) => (
                  <Text style={{ padding: 16 }}>Post {index}</Text>
                )}
              />
            ),
          },
          {
            key: "about",
            title: "Sobre",
            renderComponent: (stickyTab) => (
              <ProfileStickyTab.ScrollView stickyTab={stickyTab}>
                <Text style={{ padding: 16 }}>Conteúdo da aba Sobre</Text>
              </ProfileStickyTab.ScrollView>
            ),
          },
        ]}
      >
        <View style={{ height: 220, backgroundColor: "#2563eb" }} />
      </ProfileStickyTab>
    </ProfileStickyTab.Provider>
  );
}
```

## Estrutura

`ProfileStickyTab.Provider` deve envolver o componente principal. Ele mantém o estado compartilhado de scroll, índice ativo e alturas do layout.

`ProfileStickyTab` recebe o cabeçalho fixo, a área recolhível e a configuração das cenas de cada aba.

`ProfileStickyTab.FlatList`, `ProfileStickyTab.FlashList` e `ProfileStickyTab.ScrollView` são os containers de conteúdo das abas. Use sempre o objeto recebido em `renderComponent` na prop `stickyTab`.

## Props

### `ProfileStickyTab`

| Prop           | Tipo                   | Descrição                                                                |
| -------------- | ---------------------- | ------------------------------------------------------------------------ |
| `header`       | `ReactNode`            | Conteúdo fixo no topo da tela.                                           |
| `children`     | `ReactNode`            | Conteúdo recolhível abaixo do header, normalmente informações do perfil. |
| `renderTabBar` | `(props) => ReactNode` | Renderiza a tab bar do `react-native-tab-view`.                          |
| `tabKeyScenes` | `TabScene[]`           | Lista de abas e seus respectivos componentes.                            |

### `tabKeyScenes`

```ts
type TabScene = {
  key: string;
  title: string;
  renderComponent: (stickyTab: { key: string; index: number }) => ReactNode;
  icon?: (color: string) => ReactNode;
};
```

### Containers de aba

Todos os containers recebem `stickyTab`.

```tsx
<ProfileStickyTab.FlatList stickyTab={stickyTab} />
<ProfileStickyTab.FlashList stickyTab={stickyTab} />
<ProfileStickyTab.ScrollView stickyTab={stickyTab} />
```

Além de `stickyTab`, cada container aceita as props nativas do componente correspondente:

- `FlatList`: props de `Animated.FlatList`
- `FlashList`: props de `@shopify/flash-list`
- `ScrollView`: props de `Animated.ScrollView`

## Exports

```tsx
import ProfileStickyTab, {
  ProfileStickyTab as NamedProfileStickyTab,
} from "react-native-profile-sticky-tab";

import type {
  ProfileStickyTabProps,
  ProfileStickyTabFlatListProps,
  ProfileStickyTabFlashListProps,
  ProfileStickyTabScrollViewProps,
} from "react-native-profile-sticky-tab";
```

## Exemplo local

Este repositório inclui um exemplo em `example/index.tsx`.

Para checar a tipagem:

```bash
npx tsc --noEmit
```

## Licença

MIT
