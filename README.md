# react-partial-hydration

![hero image](https://res.cloudinary.com/dz3vsv9pg/image/upload/c_scale,w_800/v1632392020/projects/react-partial-hydration/hero.png)

[![codecov](https://codecov.io/gh/TomokiMiyauci/react-patial-hydration/branch/main/graph/badge.svg?token=uEgVrj9bof)](https://codecov.io/gh/TomokiMiyauci/react-patial-hydration)

---

React component to delay or skip hydration.

It can be combined with lazy component to achieve the best performance. See [React.lazy](#Lazy-component) for details.

## Quick view

### Install

```bash
yarn add react-partial-hydration
```

or

```bash
npm i react-partial-hydration
```

### Static

The `children` of the `Static` component will skip hydration.

```tsx
import { Static, Intersection } from 'react-partial-hydration'
;<Static>{children}</Static>
```

### Intersection

The `children` of the `Intersection` component will delay hydration until it intersects the viewport.

```tsx
import { Intersection } from 'react-partial-hydration'
;<Intersection>{children}</Intersection>
```

## API

This provide components as below:

- Static
- Intersection

### Static

No(skip) hydration component

If the component does not need to be reactive, it can be optimized for performance.

```tsx
import { Static } from 'react-partial-hydration'
;<Static>{children}</Static>
```

#### props

| Prop         | Default    | Description                                                                                                         |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `children`   | -          | `JSX.Element`<br />The children component                                                                           |
| `as`         | `div`      | `keyof ReactHTML` ? <br />`Static` component should render as.                                                      |
| `fallback`   | `children` | `false` &#124; `JSX.Element` ? <br />When The DOM is not exists, fallback to `children` or passed component or not. |
| `onFallback` | -          | `() => void` ? <br />On fallback component is rendered, then fire                                                   |
| `isServer`   | -          | `boolean` ? <br /> For debugging, switch rendering environment server side or client side                           |
| `...props`   | -          | `DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>` ? <br />All attributes to render `Static` component.  |

#### SSR render

By default, on the server side, it will be rendered as follows:

```html
<div style="display:contents">{children}</div>
```

The only drawback now is that it requires a wrapper `HTML` tag.
Fortunately, `display:contents` does not break the style of `children`. Also, there will probably be no impact on SEO.

#### CSR render

On the client side, skip hydration and keep the DOM tree.

```html
<div style="display:contents">{children}</div>
```

### Intersection

The component to delay hydration until it intersects the viewport.

```tsx
import { Intersection } from 'react-partial-hydration'
;<Intersection>{children}</Intersection>
```

#### props

| Prop         | Default    | Description                                                                                                                                                                               |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`   | -          | `JSX.Element`<br />The children component.                                                                                                                                                |
| `as`         | `div`      | `keyof ReactHTML` ? <br />`Intersection` component should render as.                                                                                                                      |
| `fallback`   | `children` | `false` &#124; `JSX.Element` ? <br />When The DOM is not exists, fallback to `children` or passed component or not.                                                                       |
| `onFallback` | -          | `() => void` ? <br />On fallback component is rendered, then fire.                                                                                                                        |
| `target`     | `<div />`  | `JSX.Element` ? <br />Target used for intersection.                                                                                                                                       |
| `root`       | -          | `Element` &#124; `Document` &#124; `null` ? <br />The element that is used as the viewport for checking visibility of the target.                                                         |
| `rootMargin` | -          | `string` ? <br />Margin around the root.                                                                                                                                                  |
| `threshold`  | -          | `number` &#124; `number[]` ? <br />Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. |
| `...props`   | -          | `DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>` ? <br />All attributes to render `Intersection` component.                                                                  |

#### SSR render

By default, on the server side, it will be rendered as follows:

```html
<div style="display:contents">
  <div />
  {children}
</div>
```

The only drawback now is that it requires a wrapper `HTML` tag.
Fortunately, `display:contents` does not break the style of `children`. Also, there will probably be no impact on SEO.

#### CSR render

On the client side, hydration is delayed until Intersect.

```html
<div style="display:contents">
  <div />
  {children}
</div>
```

### Architecture

Normally, if a react component does not return any `DOM Elements`, it will be removed from the `DOM` or React will report an error.

For example, the following component will cause a flush and be removed from the DOM tree in browser.

```tsx
import type { FC } from 'react'
const FlashThenRemove: FC = () => {
  if (isServer) {
    return <div>This will delete from DOM</div>
  }
  return <></>
  // or return void
}
```

SSR:

```html
<div>This will delete from DOM</div>
```

CSR:

```html
// Flash and disappear
```

In order to maintain the DOM tree without using `hydrate` or `render`, we can use `dangerouslySetInnerHTML`.

```tsx
const NoHydrate: FC = () => {
  if (isServer) {
    return <div>This will not delete from DOM</div>
  }
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: ''
      }}
    />
  )
}
```

It relies on the original `html`. On the server side and the client side, the parent component must be the same `HTML` tag.

For example, in the above example, if you change the `div` tag in the server-side generated `html` to a `span` tag, nothing will be rendered on the client side.

### The fallback system

From the above example, we can see that hydration skipping depends on the original `html`. If the `html` is not what you expect, it will disappear from the DOM tree. This can be a problem.

The best example of where this situation occurs is when you are using an [App Shell](https://developers.google.com/web/fundamentals/architecture/app-shell).

App Shell uses a `Service worker` to get assets from cache storage so that the app can work offline.

In this case, the original `html` DOM tree is empty unless you make your own changes, because App Shell is based on CSR.

To work correctly in this situation, all components have a fallback system implemented.

This means that if the correct DOM is not rendered, hydration will occur and the correct DOM will be corrected.

The `fallback` props allows you to specify which components to fallback. The default is `children`. You can disable fallback by setting it to `false`.

## Lazy component

By using these components, hydration will be delayed or not occur. This will improve performance.

However, the fetch of the component will still take place.

Let's look at the following example.

```tsx
import type { FC } from 'react'
type Props = {
  title: string
  description: string
}
const Headline: FC<Props> = ({ title, description }) => {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
export default Headline
```

```tsx
import Headline from 'path/to/headline'
import { Static } from 'react-partial-hydration'

<Static>
  <Headline title="Hello" description="World">
</Static>
```

The `Headline` component is not hydrated by the `Static` component. This is certainly a good thing for performance.
However, since the `Headline` component is not chunked, it will be included in the main bundle.

Even though it is not used for rendering, it increases the main bundle and the user is fetching unnecessary scripts.

To remedy this, we will use the lazy component.

### React.lazy

The `React.lazy` function can create lazy components.

The lazy component is characterized by the fact that it will be fetched only when it is needed.

For example, let's look at the following example:

```tsx
import { lazy, useState } from 'react'

const Headline = lazy(() => import('path/to/headline'))

const Main: FC = () => {
  const [isShow, changeShow] = useState(false)

  return isShow && <Headline title="Hello" description="World">
}
```

For the `Headline` component, the component fetch itself will be delayed until the `isShow` is `true`.

Unfortunately, `React.lazy` doesn't support SSR yet.

### Third-party lazy components

[Loadable Components](https://loadable-components.com/) is the [officially](https://reactjs.org/docs/code-splitting.html#reactlazy) recommended Code Splitting library that supports SSR. By using it, you can render lazy components on the server side.

> There are no dependencies in this project. You can also use solutions other than `Loadable Components`.

The rendering of lazy components on the server side depends on the bundler.

You can see how to use Loadable Components on the server side in the following example.

- Gatsby [WIP]
- Next.js [WIP]

Once your application is ready, you can use it as follows:

```tsx
import loadable from '@loadable/component'
import { Static } from 'react-partial-hydration'
const Headline = loadable(() => import('path/to/headline'))

<Static>
  <Headline title="Hello" description="World">
</Static>
```

This will cause the markup to be rendered on the server side.
And on the client side, the **fetch** and **hydration** of the component will be skipped.

Similarly for the `Intersection` component, no **fetch** or **hydration** will be done until it is intersected.

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check
[issues](https://github.com/TomokiMiyauci/utterances-component/issues).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/tomoki_miyauci">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## License

Copyright © 2021-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
